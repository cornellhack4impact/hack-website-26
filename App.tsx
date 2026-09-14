import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import CustomGlobe from './components/CustomGlobe';
import AboutPage from './components/AboutPage';
import OurWorkPage from './components/OurWorkPage';
import WorkWithUsPage from './components/WorkWithUsPage';
import { ArrowUpRight, ArrowDown, Menu, X, ChevronLeft, ChevronRight, Mail, Linkedin, Instagram } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { fixedLayerStyle, normalize, useScrollPhases } from './utils/scroll';
import {
  CONTACT_EMAIL,
  DONATE_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
} from './utils/links';

/* ------------------------------------------------------------------
 * PDF.js worker setup — required so pdf.js can render the annual
 * report cover thumbnail on the main page (without this, getDocument
 * hangs because it can't find its worker file).
 * ------------------------------------------------------------------ */
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

/* FlipBook is heavy (pdf.js + react-pageflip) — lazy load so it
 * doesn't block the initial render. It's only used inside the
 * fullscreen annual-report modal. */
const FlipBook = lazy(() => import('./components/FlipBook'));

const HERO_BACKGROUND = '#F6F5F4';
type SiteView = 'home' | 'about' | 'work' | 'engage';

const FEATURED_PROJECTS = [
  {
    semester: 'Spring 2025',
    title: 'AI-driven virtual patients for medical training',
    description:
      'We partnered with MedSimAI to redesign their AI-driven virtual patient platform, adding onboarding flows, scheduling and difficulty-tiered cases so medical students can rehearse clinical conversations at their own pace.',
    icon: '/partners/medsim.png',
    link: 'https://medium.com/cornellh4i/medsimai-enhancing-medical-student-communication-through-ai-driven-virtual-patients-f4a487fe0de1',
  },
  {
    semester: 'Fall 2023',
    title: 'Making environmental violation data accessible',
    description:
      "We worked with the Environmental Data & Governance Initiative to replace the EPA's outdated PDF report cards with an interactive, county-level mapping tool, surfacing violation data through clickable maps and clean visualizations for journalists, educators, and residents.",
    icon: '/partners/edgi.jpg',
    link: 'https://medium.com/cornellh4i/edgi-improving-access-to-environmental-violation-data-1458ff1fde88',
  },
  {
    semester: 'Fall 2023',
    title: 'Connecting patients with psychiatrists in Ghana',
    description:
      'We built a telehealth platform for OKB Hope Foundation that connects mental health patients with psychiatrists in Ghana, through messaging, virtual appointments, and educational outreach.',
    icon: '/partners/okb.jpg',
    link: 'https://medium.com/cornellh4i/bridging-the-gap-connecting-patients-with-psychiatrists-and-demystifying-mental-health-in-ghana-4e9f2c076373',
  },
] as const;

/* Top-nav configuration. Every item is now wired to a view. */
const NAV_ITEMS: { label: string; view?: SiteView }[] = [
  { label: 'About Us', view: 'about' },
  { label: 'Our Work', view: 'work' },
  { label: 'Work With Us', view: 'engage' },
];

const resolveViewFromHash = (): SiteView => {
  if (typeof window === 'undefined') return 'home';
  const normalized = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (normalized === 'about') return 'about';
  if (normalized === 'work') return 'work';
  if (normalized === 'engage') return 'engage';
  return 'home';
};

const App: React.FC = () => {
  /* ================================================================
   * SCROLL-DRIVEN ANIMATION STATE
   *
   * Five visual sections are stacked as fixed-position layers and
   * crossfade between each other as the user scrolls. Four phase
   * transitions are needed:
   *
   *   scrollProgress  → Hero text → Globe + compact header
   *   scrollPhase2    → Globe → Who We Are
   *   scrollPhase3    → Who We Are → Projects
   *   scrollPhase4    → Projects → Get Involved
   * ================================================================ */
  const [scrollProgress, scrollPhase2, scrollPhase3, scrollPhase4] =
    useScrollPhases(4);

  /* UI state unrelated to scroll */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const [navHeight, setNavHeight] = useState(96);
  const [featuredProjectIdx, setFeaturedProjectIdx] = useState(0);
  const featuredTouchStartX = useRef<number | null>(null);
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));
  /* Tracks whether the user has scrolled past the very top of the
   * page. Used to give the desktop nav a blurred background so
   * content scrolling underneath doesn't show through awkwardly. */
  const [pageScrolled, setPageScrolled] = useState(false);

  /* Annual report state: coverUrl is the rendered first-page
   * thumbnail; showFlipBook gates mounting the heavy FlipBook
   * component; reportOpen controls the fullscreen modal. */
  const [showFlipBook, setShowFlipBook] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string>('');

  /* DOM refs — used for measuring nav height and for triggering
   * stagger-in animations via IntersectionObserver / effects. */
  const navRef = useRef<HTMLDivElement | null>(null);
  const whoSectionRef = useRef<HTMLDivElement | null>(null);
  const reportSectionRef = useRef<HTMLDivElement | null>(null);
  const projectsSectionRef = useRef<HTMLDivElement | null>(null);

  const [currentView, setCurrentView] = useState<SiteView>(resolveViewFromHash);
  const whoCards = [
    { label: 'Designers', img: '/design.JPG', rotate: -8, offsetX: '-55%', zIndex: 1 },
    { label: 'Developers', img: '/dev.JPG', rotate: 0, offsetX: '0%', zIndex: 3 },
    { label: 'Business', img: '/business.jpg', rotate: 8, offsetX: '55%', zIndex: 1 },
  ];

  const goToView = (view: SiteView) => {
    if (typeof window === 'undefined') return;
    const nextHash = view === 'home' ? '#/' : `#/${view}`;
    if (window.location.hash !== nextHash) window.location.hash = nextHash;
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  /* ----------------------------------------------------------------
   * Track viewport size so the hero copy band and globe offset can
   * adapt — short / narrow screens need the globe lower so headlines
   * never collide with the sphere.
   * ---------------------------------------------------------------- */
  useEffect(() => {
    const update = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* ----------------------------------------------------------------
   * Render the annual report cover (PDF page 1) to a data URL so it
   * can be shown as a thumbnail inside the Get Involved card.
   * ---------------------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdf = await pdfjsLib.getDocument('/AnnualReport.pdf').promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
        if (!cancelled) setCoverUrl(canvas.toDataURL('image/jpeg', 0.85));
      } catch {
        /* cover thumbnail is non-critical; fall back to "Loading…" text */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ----------------------------------------------------------------
   * When the fullscreen report modal opens, lock body scroll and
   * close on Escape. Restores both on unmount / close.
   * ---------------------------------------------------------------- */
  useEffect(() => {
    if (!reportOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setReportOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [reportOpen]);

  /* The scroll listener for layered phases is handled by
   * `useScrollPhases` above. We add a tiny separate listener here
   * just to flip a boolean once the user has scrolled past the very
   * top — drives the nav's scroll-aware blur background. */
  useEffect(() => {
    const update = () => setPageScrolled(window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  /* ----------------------------------------------------------------
   * Track the nav height so fixed-position sections can offset their
   * content below it. Uses ResizeObserver because the nav can grow
   * (mobile menu) and shrink.
   * ---------------------------------------------------------------- */
  useEffect(() => {
    const updateNavHeight = () => {
      if (navRef.current) setNavHeight(navRef.current.getBoundingClientRect().height);
    };
    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    const observer = new ResizeObserver(updateNavHeight);
    if (navRef.current) observer.observe(navRef.current);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateNavHeight);
    };
  }, []);

  /* Auto-close the mobile menu when the viewport grows to desktop. */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onHashChange = () => setCurrentView(resolveViewFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);


  /* ================================================================
   * DERIVED ANIMATION VALUES
   *
   * All of these are pure functions of the four scroll phases above.
   * Keeping them here (rather than inline in JSX) documents the
   * intent and makes the JSX readable.
   * ================================================================ */

  // Globe translateY (vh): starts low under the hero text, slides up
  // to sit centered behind the compact header as phase 1 completes.
  // Short / mobile viewports push the globe further down so the
  // crest clears the hero copy band.
  const isMobileViewport = viewport.width < 768;
  const isShortViewport = viewport.height < 780;
  const globeStartY = isMobileViewport
    ? isShortViewport
      ? 54
      : 48
    : isShortViewport
      ? 46
      : 44;
  const globeEndY = isMobileViewport ? 22 : 18;
  const globeTranslateY = globeStartY - scrollProgress * (globeStartY - globeEndY);

  // Hero text: full opacity at start, gone by halfway through phase 1.
  const heroOpacity = Math.max(1 - scrollProgress * 2, 0);
  // Compact header: mirror image — fades in during the second half of phase 1.
  const headerOpacity = Math.max((scrollProgress - 0.5) * 2, 0);

  // Phase 2 — globe shrinks and fades as Who We Are slides in.
  const globeContentOpacity = Math.max(1 - scrollPhase2 * 1.5, 0);
  const globeScale = 1 - scrollPhase2 * 0.15;
  const whoWeAreOpacity = Math.min(Math.max((scrollPhase2 - 0.55) * 2.5, 0), 1);
  const whoWeAreTranslateY = Math.max(30 - whoWeAreOpacity * 30, 0);

  // Scroll indicators. First arrow fades with phase 1; second arrow
  // re-appears briefly once the globe has settled, to hint that
  // there's more below.
  const scrollIndicatorOpacity = Math.max(1 - scrollProgress * 3, 0);
  const postGlobeArrowOpacity = scrollPhase2 === 0 ? Math.max((scrollProgress - 0.78) * 4.5, 0) : 0;

  const navTopOffset = isMobileViewport ? 8 : 12; // matches `top-2 md:top-3`
  const navClearance = navHeight + navTopOffset;

  // Padding offsets so fixed section content clears the full nav area.
  const contentTopPadding = Math.max(navClearance + 16, isShortViewport ? 88 : 112);
  const compactHeaderTop = navClearance + 36;
  // Keep all hero copy inside the upper band above the globe crest.
  const heroBandBottomVh = isMobileViewport
    ? isShortViewport
      ? 56
      : 52
    : isShortViewport
      ? 52
      : 50;

  // Phase 3 — Who We Are hands off to Projects without overlap.
  const whoWeAreFadeOut = 1 - normalize(scrollPhase3, 0.1, 0.58);
  const projectsOpacity = normalize(scrollPhase3, 0.58, 0.95);
  const projectsTranslateY = Math.max(30 - projectsOpacity * 30, 0);

  // Phase 4 — Projects hands off to Get Involved without overlap.
  const projectsFadeOut = 1 - normalize(scrollPhase4, 0.1, 0.58);
  const reportOpacity = normalize(scrollPhase4, 0.58, 0.95);
  const reportTranslateY = Math.max(30 - reportOpacity * 30, 0);

  const whoLayerOpacity = whoWeAreOpacity * whoWeAreFadeOut;
  const projectsLayerOpacity = projectsOpacity * projectsFadeOut;
  const reportLayerOpacity = reportOpacity;

  // Mobile-only "settled" gates: only allow internal scroll/clicks
  // once the layer has fully faded in AND the surrounding layers
  // have faded out. Prevents wheel events from bleeding across
  // phase transitions.
  const projectsIsSettled =
    projectsLayerOpacity >= 0.99 &&
    whoLayerOpacity <= 0.01 &&
    reportLayerOpacity <= 0.01 &&
    scrollPhase3 >= 0.99 &&
    scrollPhase4 <= 0.01;
  const reportIsSettled =
    reportLayerOpacity >= 0.99 &&
    projectsLayerOpacity <= 0.01 &&
    scrollPhase4 >= 0.99;
  const projectsInteractive = isMobileViewport ? projectsIsSettled : projectsLayerOpacity > 0.1;
  const reportInteractive = isMobileViewport ? reportIsSettled : reportLayerOpacity > 0.1;

  // Mobile sections need extra breathing room below the fixed nav
  // so large headings/cards never touch the header area.
  const projectsTopPadding = isMobileViewport ? navClearance + 72 : navClearance + 48;
  const reportTopPadding = isMobileViewport ? navClearance + 72 : navClearance + 48;
  const projectsBottomPadding = isMobileViewport ? 'calc(48px + env(safe-area-inset-bottom))' : '48px';
  const featuredProjectCount = FEATURED_PROJECTS.length;
  const activeFeaturedProject = FEATURED_PROJECTS[featuredProjectIdx]!;
  const canGoPrevFeatured = featuredProjectIdx > 0;
  const canGoNextFeatured = featuredProjectIdx < featuredProjectCount - 1;
  const goPrevFeatured = () => {
    if (!canGoPrevFeatured) return;
    setFeaturedProjectIdx((idx) => Math.max(0, idx - 1));
  };
  const goNextFeatured = () => {
    if (!canGoNextFeatured) return;
    setFeaturedProjectIdx((idx) => Math.min(featuredProjectCount - 1, idx + 1));
  };

  /* Lazy-mount the FlipBook + stagger-in the section's elements
   * once Get Involved starts to appear. */
  useEffect(() => {
    if (reportOpacity > 0.1 && !showFlipBook) setShowFlipBook(true);
    if (reportOpacity > 0.3 && reportSectionRef.current) {
      const els = reportSectionRef.current.querySelectorAll('.annual-report-section');
      els.forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 200));
    }
  }, [reportOpacity, showFlipBook]);

  /* Stagger-in for Projects cards once the section is visible. */
  useEffect(() => {
    if (projectsOpacity > 0.3 && projectsSectionRef.current) {
      const els = projectsSectionRef.current.querySelectorAll('.project-card-animate');
      els.forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 150));
    }
  }, [projectsOpacity]);

  /* ----------------------------------------------------------------
   * Stagger-in animation for the Who We Are section.
   *
   * Previously this used IntersectionObserver, but on a fixed-
   * positioned, initially `visibility: hidden` layer the IO callback
   * didn't always fire (browser/timing dependent). When it didn't,
   * the inner `.who-we-are-title` and `.who-card` elements stayed at
   * opacity 0 forever — so the layer would fade in via scroll but
   * its contents never appeared.
   *
   * We now match the same scroll-progress trigger that Projects and
   * Get Involved use: as soon as the section's opacity ramps up,
   * stagger in the .visible class. classList.add is idempotent so
   * back-and-forth scrolling is safe.
   * ---------------------------------------------------------------- */
  useEffect(() => {
    if (whoWeAreOpacity > 0.3 && whoSectionRef.current) {
      const els = whoSectionRef.current.querySelectorAll('.who-we-are-title, .who-card');
      els.forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 150));
    }
  }, [whoWeAreOpacity]);

  return (
    /* The page is one tall scroll container (1100vh) with every
     * visual section stacked as a fixed layer. Scrolling drives the
     * phase values above, which in turn animate opacity / transform
     * on those layers. */
    <div className="relative w-full bg-[#F6F5F4]">

      {/* ============================================================
          TOP NAVIGATION — always visible, sits above every section.
          Collapses to a hamburger menu below md.
          ============================================================ */}
      <div className="fixed top-2 md:top-3 left-0 w-full z-40 px-3 md:px-4 pointer-events-auto">
        <nav
          ref={navRef}
          className={[
            // Mobile is always a rounded card with a blurred bg —
            // the nav has to occlude content underneath since the
            // page scrolls below it.
            // Wider than page content (max-w-6xl) so the bar has
            // breathing room past the links without shifting them.
            'mx-auto w-full max-w-7xl rounded-xl border border-slate-200/80 bg-[#F6F5F4]/95 backdrop-blur-md shadow-sm transition-all duration-300 md:rounded-none',
            // Desktop: transparent at the very top so the hero feels
            // edge-to-edge; once the user starts scrolling, fade in
            // a blurred background so content can't bleed through.
            pageScrolled
              ? 'md:border-slate-200/40 md:bg-[#F6F5F4]/80 md:backdrop-blur-md md:shadow-sm'
              : 'md:border-transparent md:bg-transparent md:backdrop-blur-0 md:shadow-none',
          ].join(' ')}
        >
          <div className="mx-auto w-full max-w-6xl flex items-center justify-between gap-4 px-2 py-2 md:px-2 md:py-3">
            {/* Logo — clickable, returns to home. Falls back to a
                text wordmark if the image 404s. */}
            <button
              type="button"
              onClick={() => goToView('home')}
              className="flex items-center min-w-0 cursor-pointer"
              aria-label="Go to home"
            >
              {!logoLoadError ? (
                <img
                  src="/logos/logo.png"
                  alt="Logo"
                  fetchPriority="high"
                  className="h-11 md:h-14 w-auto max-w-[240px] md:max-w-[340px] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                  onError={() => setLogoLoadError(true)}
                />
              ) : (
                <span className="text-slate-800 text-xl md:text-2xl font-semibold tracking-tight">
                  cornell hack4impact
                </span>
              )}
            </button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => {
                const className = 'text-slate-700 text-sm font-semibold tracking-wide hover:text-slate-900 transition-colors';
                if (item.view) {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => goToView(item.view!)}
                      className={`${className} cursor-pointer bg-transparent border-0 p-0`}
                    >
                      {item.label}
                    </button>
                  );
                }
                return (
                  <a key={item.label} href="#" className={className}>
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Mobile hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden flex h-10 w-10 items-center justify-center border border-slate-300 text-slate-700"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile drawer — height animates via max-h. Items are
              full-width tappable rows with subtle dividers and a
              chevron on the right, matching the rest of the site's
              visual language. */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${mobileMenuOpen ? 'max-h-72 opacity-100 pb-2' : 'max-h-0 opacity-0'}`}>
            <div className="mt-1 border-t border-slate-200/80 divide-y divide-slate-200/70">
              {NAV_ITEMS.map((item) => {
                const className =
                  'w-full flex items-center justify-between gap-3 px-3 py-3.5 text-slate-700 text-[15px] font-semibold tracking-wide hover:bg-slate-100/60 active:bg-slate-100 transition-colors';
                const content = (
                  <>
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </>
                );
                if (item.view) {
                  return (
                    <button
                      key={`mobile-${item.label}`}
                      type="button"
                      onClick={() => goToView(item.view!)}
                      className={`${className} cursor-pointer bg-transparent border-0`}
                    >
                      {content}
                    </button>
                  );
                }
                return (
                  <a key={`mobile-${item.label}`} href="#" className={className}>
                    {content}
                  </a>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* ============================================================
          HOME VIEW — single tall scroll container (1100vh) with
          every section stacked as a fixed layer. The layers
          crossfade as the user scrolls through 4 phase transitions.
          Only mounted when the user is on the home route.
          ============================================================ */}
      {currentView === 'home' && (
      <div className="relative w-full min-h-[1100vh]">

      {/* ============================================================
          GLOBE BACKGROUND LAYER
          Fixed full-screen layer containing the interactive globe.
          Hidden once it has fully faded (phase 2 complete) so it
          doesn't capture pointer events over later sections.
          ============================================================ */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{ background: HERO_BACKGROUND, visibility: globeContentOpacity <= 0 ? 'hidden' : undefined }}
      >
        {/* pointer-events-auto lets the user drag to spin the globe. */}
        <div
          className="absolute inset-0 z-10 will-change-transform flex items-center justify-center pointer-events-auto"
          style={{ transform: `translateY(${globeTranslateY}vh) scale(${globeScale})`, opacity: globeContentOpacity }}
        >
          <CustomGlobe scrollProgress={scrollProgress} />
        </div>
      </div>

      {/* ============================================================
          SECTION 1 (compact header) — appears during the second half
          of phase 1 as the big hero title fades away. Multiplied by
          globeContentOpacity so it fades with the globe in phase 2.
          ============================================================ */}
      <div
        className="fixed left-0 w-full px-4 md:px-8 z-30 flex flex-col items-center justify-start pointer-events-none transition-opacity duration-300"
        style={{ opacity: headerOpacity * globeContentOpacity, top: `${compactHeaderTop}px` }}
      >
        <h2 className="text-[#17558E] font-medium text-center leading-tight">
          <span className="block text-2xl md:text-3xl tracking-wide">
            Tech For Social Good.
          </span>
          <span
            className="block text-3xl md:text-4xl italic tracking-tight mt-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Built by Students.
          </span>
        </h2>
      </div>

      {/* ============================================================
          SECTION 1 (hero title) — large landing copy. Kept in a
          fixed upper band above the globe crest so headlines never
          collide with the sphere at any viewport size. Fades out
          during phase 1.
          ============================================================ */}
      <div
        className="fixed inset-x-0 z-20 flex flex-col items-center text-center px-4"
        style={{
          opacity: heroOpacity,
          top: `${contentTopPadding}px`,
          bottom: `${heroBandBottomVh}vh`,
          pointerEvents: heroOpacity <= 0 ? 'none' : 'auto',
        }}
      >
        <div className="flex h-full w-full max-w-5xl flex-col items-center justify-center min-h-0">
          <div className={`shrink-0 ${isShortViewport ? 'mb-3' : 'mb-5 md:mb-6'}`}>
            <h1 className="text-[clamp(1.2rem,6.2vw,4rem)] md:text-7xl font-medium text-[#17558E] tracking-wide leading-[1.05] whitespace-nowrap">
              Tech For Social Good.
            </h1>
            <h1
              className="text-[clamp(1.35rem,6.8vw,4rem)] md:text-7xl font-medium text-[#17558E] leading-[1.05] mt-1 md:mt-2 whitespace-nowrap italic tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Built by Students.
            </h1>
          </div>

          <p
            className={`text-slate-500 max-w-2xl md:max-w-3xl text-sm md:text-base leading-relaxed font-light shrink-0 ${
              isShortViewport ? 'mb-4' : 'mb-6 md:mb-8'
            }`}
          >
            Building socially impactful tools to empower you to focus on what really matters.
          </p>

          <button
            type="button"
            onClick={() => goToView('work')}
            className="group shrink-0 flex items-center gap-2 px-7 py-2.5 md:px-8 md:py-3 rounded-full bg-white/60 border border-white/80 text-slate-700 hover:bg-white/80 transition-all duration-300 backdrop-blur-md cursor-pointer shadow-sm"
          >
            <span className="text-sm md:text-lg font-light tracking-wide">See Our Work</span>
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Primary bouncing scroll indicator — visible on load, fades
          with phase 1. */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce pointer-events-none" style={{ opacity: scrollIndicatorOpacity }}>
        <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm">
          <ArrowDown className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Secondary arrow — briefly re-appears once the globe has
          settled so the user knows to keep scrolling. */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce pointer-events-none" style={{ opacity: postGlobeArrowOpacity }}>
        <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
          <ArrowDown className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* ============================================================
          SECTION 3 — WHO WE ARE
          Fan-carousel of three role cards. Fades in during phase 2
          (whoWeAreOpacity) and out via the shared `layerExitOpacity`
          when the user reaches the end of the layered zone.
          ============================================================ */}
      <div
        ref={whoSectionRef}
        className="fixed inset-0 z-[5] overflow-hidden"
        style={fixedLayerStyle(whoLayerOpacity, whoWeAreTranslateY)}
      >
        <div className="h-full px-4 md:px-8 bg-[#F6F5F4] flex items-start justify-center" style={{ paddingTop: `${navHeight + 48}px` }}>
          <div className="max-w-6xl mx-auto w-full">
            <h2 className="text-[#17558E] text-3xl md:text-5xl font-medium text-center tracking-wide mb-8 md:mb-10 who-we-are-title relative z-10">
              Who We Are
            </h2>

            {/* Fan carousel — three cards, middle one centered, outer
                two rotated and offset. `--hover-offset` is consumed by
                the `.fan-card:hover` rule in index.css so the card can
                lift straight up without losing its horizontal offset. */}
            <div className="relative flex items-center justify-center mb-10 md:mb-14 who-card" style={{ height: 'clamp(300px, 45vh, 460px)' }}>
              {whoCards.map((card) => (
                <div
                  key={card.label}
                  className="absolute rounded-xl overflow-hidden shadow-lg cursor-pointer fan-card"
                  style={{
                    width: 'clamp(180px, 22vw, 280px)',
                    aspectRatio: '3 / 4',
                    left: '50%',
                    top: '55%',
                    transform: `translate(-50%, -50%) translateX(${card.offsetX}) rotate(${card.rotate}deg)`,
                    transformOrigin: 'center bottom',
                    zIndex: card.zIndex,
                    ['--hover-offset' as string]: card.offsetX,
                  }}
                >
                  <img src={card.img} alt={card.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-0 right-0 text-center text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <span className="block text-lg md:text-xl font-medium italic tracking-wide">{card.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center who-card">
              <button
                type="button"
                onClick={() => goToView('about')}
                className="group flex items-center gap-2 px-8 py-3 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 cursor-pointer"
              >
                <span className="text-base md:text-lg font-light tracking-wide">About Us</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          SECTION 4 — PROJECTS
          Three semester projects. Fades in phase 3 / out phase 4.
          ============================================================ */}
      <div
        ref={projectsSectionRef}
        className="fixed inset-0 z-[4] overflow-hidden"
        style={fixedLayerStyle(projectsLayerOpacity, projectsTranslateY, projectsInteractive)}
      >
        <div
          className={`h-full px-4 md:px-8 bg-[#F6F5F4] flex items-start justify-center ${isMobileViewport ? 'overflow-hidden' : 'overflow-y-auto'}`}
          style={{ paddingTop: `${projectsTopPadding}px`, paddingBottom: projectsBottomPadding }}
        >
          <div className="max-w-6xl mx-auto w-full">
            <h2 className="text-[#17558E] text-3xl md:text-5xl font-medium tracking-wide mb-3 md:mb-4 project-card-animate">
              Powering Real Change
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-light leading-relaxed max-w-2xl mb-6 md:mb-14 project-card-animate">
              We turn vision into reality for nonprofits and socially impactful organizations, building the software that powers real change.
            </p>

            {/* Desktop: three-up grid. Mobile: one-at-a-time carousel
             * so this fixed-height scroll phase never nests a second
             * vertical scroller. */}
            <div className="hidden md:grid grid-cols-3 gap-8 mb-14">
              {FEATURED_PROJECTS.map((project, idx) => (
                <div
                  key={project.title}
                  className="group flex flex-col justify-between bg-white/50 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-7 hover:bg-white/80 hover:border-slate-300 hover:shadow-lg transition-all duration-300 project-card-animate"
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  <div>
                    <span className="text-slate-400 text-xs font-medium tracking-widest uppercase">{project.semester}</span>
                    <h3 className="text-slate-800 text-xl font-medium leading-snug mt-2 mb-4">{project.title}</h3>
                    <p className="text-slate-500 text-sm font-light leading-relaxed">{project.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center gap-1.5 text-slate-600 text-sm font-medium hover:text-[#17558E] transition-colors"
                    >
                      Learn more
                      <ChevronRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                    {project.icon && <img src={project.icon} alt="" className="w-9 h-9 rounded-lg object-contain opacity-60" />}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="md:hidden mb-8 project-card-animate"
              onTouchStart={(e) => {
                featuredTouchStartX.current = e.changedTouches[0]?.clientX ?? null;
              }}
              onTouchEnd={(e) => {
                const startX = featuredTouchStartX.current;
                featuredTouchStartX.current = null;
                if (startX == null) return;
                const deltaX = (e.changedTouches[0]?.clientX ?? startX) - startX;
                if (Math.abs(deltaX) < 40) return;
                if (deltaX < 0) goNextFeatured();
                else goPrevFeatured();
              }}
            >
              <div className="flex flex-col justify-between bg-white/50 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6">
                <div>
                  <span className="text-slate-400 text-xs font-medium tracking-widest uppercase">
                    {activeFeaturedProject.semester}
                  </span>
                  <h3 className="text-slate-800 text-lg font-medium leading-snug mt-2 mb-4">
                    {activeFeaturedProject.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-light leading-relaxed">
                    {activeFeaturedProject.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                  <a
                    href={activeFeaturedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link flex items-center gap-1.5 text-slate-600 text-sm font-medium hover:text-[#17558E] transition-colors"
                  >
                    Learn more
                    <ChevronRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                  </a>
                  {activeFeaturedProject.icon && (
                    <img
                      src={activeFeaturedProject.icon}
                      alt=""
                      className="w-9 h-9 rounded-lg object-contain opacity-60"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-5">
                <span className="text-slate-400 text-xs tracking-wide tabular-nums">
                  {featuredProjectIdx + 1} / {featuredProjectCount}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Previous project"
                    onClick={goPrevFeatured}
                    disabled={!canGoPrevFeatured}
                    className={`p-2 rounded-lg transition-colors ${
                      canGoPrevFeatured
                        ? 'text-slate-700 hover:bg-slate-200/70'
                        : 'text-slate-300 cursor-default'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next project"
                    onClick={goNextFeatured}
                    disabled={!canGoNextFeatured}
                    className={`p-2 rounded-lg transition-colors ${
                      canGoNextFeatured
                        ? 'text-slate-700 hover:bg-slate-200/70'
                        : 'text-slate-300 cursor-default'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center project-card-animate">
              <button
                type="button"
                onClick={() => {
                  goToView('work');
                  /* goToView resets scroll to 0 and switches view.
                   * Defer with rAF + small timeout so React has
                   * mounted OurWorkPage before we scroll past its
                   * hero — landing the user directly on the
                   * Featured projects grid. */
                  requestAnimationFrame(() => {
                    setTimeout(() => {
                      if (typeof window !== 'undefined') {
                        window.scrollTo({
                          top: window.innerHeight * 3,
                          behavior: 'auto',
                        });
                      }
                    }, 50);
                  });
                }}
                className="bg-transparent border-0 p-0 cursor-pointer text-slate-600 text-sm font-medium tracking-wide underline underline-offset-4 decoration-slate-300 hover:text-[#17558E] hover:decoration-[#17558E] transition-colors"
              >
                view more projects
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          SECTION 5 — GET INVOLVED
          Split layout: large Annual Report hero card on the left,
          four equal action cards (Donate / Email / LinkedIn /
          Instagram) stacked on the right. Fades in during phase 4.
          ============================================================ */}
      <div
        ref={reportSectionRef}
        className="fixed inset-0 z-[3] overflow-hidden"
        style={fixedLayerStyle(reportLayerOpacity, reportTranslateY, reportInteractive)}
      >
        <div
          className={`h-full px-4 md:px-8 bg-[#F6F5F4] flex items-start md:items-center justify-center ${isMobileViewport ? (reportIsSettled ? 'overflow-y-auto' : 'overflow-hidden') : 'overflow-y-auto'}`}
          style={{ paddingTop: `${reportTopPadding}px`, paddingBottom: '24px' }}
        >
          {/* Ambient brand-colored glows — purely decorative. */}
          <div className="pointer-events-none absolute -top-20 -left-20 w-[40rem] h-[40rem] rounded-full opacity-[0.18] blur-3xl" style={{ background: 'radial-gradient(circle, #17558E 0%, transparent 60%)' }} />
          <div className="pointer-events-none absolute -bottom-32 -right-20 w-[38rem] h-[38rem] rounded-full opacity-[0.14] blur-3xl" style={{ background: 'radial-gradient(circle, #4CB6C4 0%, transparent 60%)' }} />

          <div className="relative max-w-6xl mx-auto w-full">
            {/* Section header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-6 md:mb-8 annual-report-section">
              <div>
                <h2 className="text-[#17558E] text-3xl md:text-5xl font-medium tracking-wide leading-tight">Get Involved</h2>
              </div>
              <p className="text-slate-500 text-sm md:text-base font-light max-w-sm md:text-right">
                Read our year in review, fuel the next chapter, or stay connected.
              </p>
            </div>

            {/* 12-col grid: report card (7) + action stack (5) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-7 items-stretch">

              {/* --- Annual Report hero card ------------------------
                   Opens the fullscreen flipbook modal on click. Uses
                   the `group` class so the tilted cover animates on
                   hover of the whole card. */}
              <button
                onClick={() => { setShowFlipBook(true); setReportOpen(true); }}
                className="group relative md:col-span-7 annual-report-section text-left rounded-3xl overflow-hidden cursor-pointer min-h-[260px] md:min-h-[380px]"
                style={{ background: 'linear-gradient(135deg, #0F3C6B 0%, #17558E 55%, #4CB6C4 120%)' }}
              >
                {/* Decorative concentric rings in the corner. */}
                <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -top-10 -right-10 w-56 h-56 rounded-full border border-white/10" />

                <div className="relative h-full flex flex-col md:flex-row items-center gap-5 md:gap-6 p-5 md:p-8">
                  <div className="flex-1 min-w-0 text-white">
                    <span className="text-white/70 text-[11px] md:text-xs font-semibold tracking-[0.3em] uppercase">2024 — 2025</span>
                    <h3 className="text-2xl md:text-4xl font-medium leading-tight mt-2 mb-3">
                      Annual <br className="hidden md:block" />Report
                    </h3>
                    <p className="text-white/75 text-xs md:text-sm font-light leading-relaxed max-w-xs mb-5">
                      A look at the projects, partnerships, and people that shaped our year.
                    </p>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs md:text-sm font-medium group-hover:bg-white group-hover:text-[#17558E] transition-all duration-300">
                      Open the report
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>

                  {/* Tilted floating cover thumbnail (page 1 of the PDF).
                      On hover it un-tilts and lifts. */}
                  <div className="relative shrink-0">
                    <div
                      className="relative overflow-hidden rounded-md bg-slate-100 transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-0"
                      style={{
                        width: 'clamp(130px, 18vw, 210px)',
                        aspectRatio: '3 / 4',
                        transform: 'rotate(6deg)',
                        boxShadow: '0 30px 60px -15px rgba(0,0,0,0.45), 0 10px 20px -10px rgba(0,0,0,0.4)',
                      }}
                    >
                      {coverUrl ? (
                        <img src={coverUrl} alt="Annual Report cover" className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">Loading…</div>
                      )}
                      {/* Subtle spine highlight along the left edge. */}
                      <div className="absolute inset-y-0 left-0 w-[6px] bg-gradient-to-r from-black/25 to-transparent" />
                    </div>
                  </div>
                </div>
              </button>

              {/* --- Right column: 4 equal cards, same total height
                   as the annual report card (flex-1 each). ---------- */}
              <div className="md:col-span-5 flex flex-col gap-3 md:gap-3.5">
                {/* Donate — external link, primary CTA styling. */}
                <a
                  href={DONATE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl px-5 md:px-6 flex-1 min-h-[72px] bg-white border border-slate-200/80 hover:border-[#17558E]/40 hover:shadow-lg transition-all duration-300 annual-report-section flex items-center justify-between gap-4"
                >
                  <div className="pointer-events-none absolute -right-16 -bottom-16 w-48 h-48 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: 'radial-gradient(circle, #17558E, transparent 70%)' }} />
                  <h3 className="relative text-slate-800 text-base md:text-lg font-medium leading-tight">Fuel our next project</h3>
                  <div className="relative shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#17558E] text-white text-sm font-medium group-hover:bg-[#0F3C6B] transition-colors shadow-sm">
                    Donate
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>

                {/* Contact links — email + socials. Share styling. */}
                {[
                  { href: `mailto:${CONTACT_EMAIL}`, label: 'Email', Icon: Mail, external: false },
                  { href: LINKEDIN_URL, label: 'LinkedIn', Icon: Linkedin, external: true },
                  { href: INSTAGRAM_URL, label: 'Instagram', Icon: Instagram, external: true },
                ].map(({ href, label, Icon, external }) => (
                  <a
                    key={label}
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group relative overflow-hidden rounded-2xl px-5 md:px-6 flex-1 min-h-[72px] bg-white border border-slate-200/80 hover:border-[#17558E]/40 hover:shadow-lg transition-all duration-300 annual-report-section flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0 w-9 h-9 rounded-full bg-[#17558E]/5 flex items-center justify-center text-[#17558E] group-hover:bg-[#17558E] group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-slate-800 text-sm md:text-base font-medium leading-tight">{label}</div>
                    </div>
                    <ArrowUpRight className="shrink-0 w-4 h-4 text-slate-400 group-hover:text-[#17558E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      </div>
      )}

      {/* ============================================================
          ABOUT VIEW — normal-flow scrollable page.
          ============================================================ */}
      {currentView === 'about' && (
        <AboutPage navClearance={navClearance} />
      )}

      {/* ============================================================
          OUR WORK VIEW — projects gallery with hero stats + grid.
          ============================================================ */}
      {currentView === 'work' && (
        <OurWorkPage navClearance={navClearance} />
      )}

      {/* ============================================================
          WORK WITH US VIEW — students / nonprofits / sponsors.
          ============================================================ */}
      {currentView === 'engage' && (
        <WorkWithUsPage navClearance={navClearance} />
      )}

      {/* ============================================================
          FULLSCREEN ANNUAL REPORT MODAL
          Black overlay with an X-to-close button. Mounts the lazy
          FlipBook so users can swipe through the PDF. Body scroll
          and Escape handling are managed in the reportOpen effect.
          ============================================================ */}
      {reportOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          <button
            type="button"
            onClick={() => setReportOpen(false)}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-[101] flex items-center justify-center w-11 h-11 rounded-full border border-white/30 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label="Close annual report"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-full h-full flex items-center justify-center px-4 py-16 overflow-y-auto">
            {showFlipBook && (
              <Suspense fallback={<div className="text-white/60 text-lg">Loading report...</div>}>
                <FlipBook pdfUrl="/AnnualReport.pdf" />
              </Suspense>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
