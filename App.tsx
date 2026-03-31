import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import CustomGlobe from './components/CustomGlobe';
import { ArrowUpRight, ArrowDown, Menu, X, ChevronRight } from 'lucide-react';

const FlipBook = lazy(() => import('./components/FlipBook'));

const HERO_BACKGROUND = '#F6F5F4';

const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollPhase2, setScrollPhase2] = useState(0);
  const [scrollPhase3, setScrollPhase3] = useState(0);
  const [scrollPhase4, setScrollPhase4] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const [navHeight, setNavHeight] = useState(96);
  const navRef = useRef<HTMLDivElement | null>(null);
  const whoSectionRef = useRef<HTMLDivElement | null>(null);
  const reportSectionRef = useRef<HTMLDivElement | null>(null);
  const projectsSectionRef = useRef<HTMLDivElement | null>(null);
  const [showFlipBook, setShowFlipBook] = useState(false);
  const navItems = ['About Us', 'Our Work', 'Work With Us'];

  useEffect(() => {
    const handleScroll = () => {
      // Transition completes after scrolling 1 viewport height
      const transitionHeight = window.innerHeight;
      const currentScroll = window.scrollY;
      // Clamp between 0 and 1
      const progress = Math.min(Math.max(currentScroll / transitionHeight, 0), 1);
      setScrollProgress(progress);
      // Phase 2: globe stays fully visible until 2vh, then transitions over 1.5vh
      setScrollPhase2(Math.min(Math.max((currentScroll - transitionHeight * 2) / (transitionHeight * 1.5), 0), 1));
      // Phase 3: who we are fades out, projects fades in
      setScrollPhase3(Math.min(Math.max((currentScroll - transitionHeight * 4.5) / (transitionHeight * 1.5), 0), 1));
      // Phase 4: projects fades out, annual report fades in
      setScrollPhase4(Math.min(Math.max((currentScroll - transitionHeight * 7) / (transitionHeight * 1.5), 0), 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateNavHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.getBoundingClientRect().height);
      }
    };

    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);

    const observer = new ResizeObserver(() => updateNavHeight());
    if (navRef.current) observer.observe(navRef.current);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateNavHeight);
    };
  }, []);

  useEffect(() => {
    const closeMobileMenuOnDesktop = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };

    window.addEventListener('resize', closeMobileMenuOnDesktop);
    return () => window.removeEventListener('resize', closeMobileMenuOnDesktop);
  }, []);

  useEffect(() => {
    const section = whoSectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const els = section.querySelectorAll('.who-we-are-title, .who-card');
            els.forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 150);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Animation values derived from scroll progress
  
  // Globe Translation:
  // Keep the initial position similar, but keep the scrolled position lower
  // so text sits clearly above the globe.
  const globeStartY = 35;
  const globeEndY = 16;
  const globeTranslateY = globeStartY - (scrollProgress * (globeStartY - globeEndY));
  
  // Hero text opacity:
  // Visible at start (1), fades out quickly as you scroll.
  // Gone by 50% of the transition.
  const heroOpacity = Math.max(1 - scrollProgress * 2, 0);
  
  // Header text opacity:
  // Invisible at start, fades in after 50% of the transition.
  const headerOpacity = Math.max((scrollProgress - 0.5) * 2, 0);

  // Scroll Indicator Opacity
  // Fades out as you scroll down
  const scrollIndicatorOpacity = Math.max(1 - scrollProgress * 3, 0);
  // Phase 2: globe fades out slowly, who we are fades in after
  const globeContentOpacity = Math.max(1 - scrollPhase2 * 1.5, 0);
  const globeScale = 1 - scrollPhase2 * 0.15;
  const whoWeAreRaw = Math.max((scrollPhase2 - 0.55) * 2.5, 0);
  const whoWeAreOpacity = Math.min(whoWeAreRaw, 1);
  const whoWeAreTranslateY = Math.max(30 - whoWeAreOpacity * 30, 0);

  // Re-appear after the globe settles so users know to keep scrolling.
  const postGlobeArrowOpacity = scrollPhase2 === 0 ? Math.max((scrollProgress - 0.78) * 4.5, 0) : 0;
  const contentTopPadding = Math.max(navHeight + 24, 120);
  const compactHeaderTop = navHeight + 36;

  // Phase 3: who we are fades out, projects fades in
  const whoWeAreFadeOut = Math.max(1 - scrollPhase3 * 1.5, 0);
  const projectsRaw = Math.max((scrollPhase3 - 0.45) * 2.5, 0);
  const projectsOpacity = Math.min(projectsRaw, 1);
  const projectsTranslateY = Math.max(30 - projectsOpacity * 30, 0);

  // Phase 4: projects fades out, annual report fades in
  const projectsFadeOut = Math.max(1 - scrollPhase4 * 1.5, 0);
  const reportRaw = Math.max((scrollPhase4 - 0.45) * 2.5, 0);
  const reportOpacity = Math.min(reportRaw, 1);
  const reportTranslateY = Math.max(30 - reportOpacity * 30, 0);

  useEffect(() => {
    if (reportOpacity > 0.1 && !showFlipBook) {
      setShowFlipBook(true);
    }
    if (reportOpacity > 0.3 && reportSectionRef.current) {
      const els = reportSectionRef.current.querySelectorAll('.annual-report-section');
      els.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 200);
      });
    }
  }, [reportOpacity, showFlipBook]);

  useEffect(() => {
    if (projectsOpacity > 0.3 && projectsSectionRef.current) {
      const els = projectsSectionRef.current.querySelectorAll('.project-card-animate');
      els.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 150);
      });
    }
  }, [projectsOpacity]);

  return (
    <div className="relative w-full min-h-[1100vh] bg-[#F6F5F4]">
      
      {/* Fixed Background Layer with Globe */}
      <div className="fixed inset-0 z-10 pointer-events-none" style={{ background: HERO_BACKGROUND, visibility: globeContentOpacity <= 0 ? 'hidden' : undefined }}>

        {/* Globe Container - Translates up based on scroll */}
        {/* Added pointer-events-auto so the globe can be spun by the user */}
        <div
          className="absolute inset-0 z-10 will-change-transform flex items-center justify-center pointer-events-auto"
          style={{ transform: `translateY(${globeTranslateY}vh) scale(${globeScale})`, opacity: globeContentOpacity }}
        >
          <CustomGlobe scrollProgress={scrollProgress} />
        </div>

      </div>

      {/* Persistent Top Navigation */}
      <div className="fixed top-2 md:top-3 left-0 w-full z-40 px-3 md:px-6 pointer-events-auto">
        <nav ref={navRef} className="mx-auto w-full max-w-6xl">
          <div>
            <div className="flex items-center justify-between gap-4 px-1 py-2 md:px-2 md:py-3">
              <div className="flex items-center min-w-0">
                {!logoLoadError ? (
                  <img
                    src="/image.png"
                    alt="Logo"
                    className="h-8 md:h-9 w-auto max-w-[180px] md:max-w-[260px] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                    onError={() => setLogoLoadError(true)}
                  />
                ) : (
                  <span className="text-slate-800 text-xl md:text-2xl font-semibold tracking-tight">
                    cornell hack4impact
                  </span>
                )}
              </div>

              <div className="hidden md:flex items-center gap-8">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-slate-700 text-sm font-semibold tracking-wide hover:text-slate-900 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>

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

            <div
              className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${mobileMenuOpen ? 'max-h-72 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
            >
              <div className="pt-2 grid grid-cols-1 gap-2">
                {navItems.map((item) => (
                  <a
                    key={`mobile-${item}`}
                    href="#"
                    className="text-slate-700 text-sm font-medium tracking-wide py-1"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Fixed Header Layer (Visible after scroll) */}
      <div 
        className="fixed left-0 w-full px-4 md:px-8 z-30 flex flex-col items-center justify-start pointer-events-none transition-opacity duration-300"
        style={{ opacity: headerOpacity * globeContentOpacity, top: `${compactHeaderTop}px` }}
      >
        <h2 className="text-[#17558E] text-3xl md:text-4xl font-medium text-center leading-tight tracking-wide">
          Tech For Social Good. <br />
          Built by Students.
        </h2>
      </div>

      {/* Hero Content Layer (Fades out on scroll) */}
      <div 
        className="fixed inset-0 z-20 flex flex-col items-center justify-start text-center px-4"
        style={{ 
          opacity: heroOpacity,
          paddingTop: `${contentTopPadding}px`,
          // Disable pointer events when invisible so it doesn't block the globe
          pointerEvents: heroOpacity <= 0 ? 'none' : 'auto' 
        }}
      >
        {/* Main Title */}
        <div className="mb-6">
          <h1 className="text-[clamp(1.35rem,7.2vw,4.4rem)] md:text-7xl font-medium text-[#17558E] tracking-wide leading-tight whitespace-nowrap">
          Tech For Social Good.
          </h1>
          <h1 className="text-[clamp(1.55rem,8vw,4.4rem)] md:text-7xl font-medium text-[#17558E] tracking-wide leading-tight mt-2 whitespace-nowrap">
          Built by Students.
          </h1>
        </div>

        {/* Subtitle / Description */}
        <p className="text-slate-500 max-w-3xl text-sm md:text-base leading-relaxed mb-8 font-light -mt-1">
        Building socially impactful tools to empower you to focus on what really matters. 
        </p>

        {/* Action Button */}
        <button className="group flex items-center gap-2 px-8 py-3 rounded-full bg-white/60 border border-white/80 text-slate-700 hover:bg-white/80 transition-all duration-300 backdrop-blur-md cursor-pointer shadow-sm">
          <span className="text-base md:text-lg font-light tracking-wide">See Our Work</span>
          <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Bottom Scroll Indicator (Fades out) */}
      <div 
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce pointer-events-none"
        style={{ opacity: scrollIndicatorOpacity }}
      >
        <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm">
          <ArrowDown className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Secondary scroll indicator shown once the globe is fully visible */}
      <div 
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce pointer-events-none"
        style={{ opacity: postGlobeArrowOpacity }}
      >
        <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
          <ArrowDown className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Who We Are Section */}
      <div ref={whoSectionRef} className="fixed inset-0 z-[5] overflow-hidden" style={{ opacity: whoWeAreOpacity * whoWeAreFadeOut, transform: `translateY(${whoWeAreTranslateY}px)`, pointerEvents: whoWeAreOpacity > 0.1 && whoWeAreFadeOut > 0.1 ? 'auto' : 'none' }}>
        <div className="h-full px-4 md:px-8 bg-[#F6F5F4] flex items-start justify-center" style={{ paddingTop: `${navHeight + 48}px` }}>
          <div className="max-w-6xl mx-auto w-full">
            <h2 className="text-[#17558E] text-3xl md:text-5xl font-medium text-center tracking-wide mb-8 md:mb-10 who-we-are-title relative z-10">
              Who We Are
            </h2>

            {/* Fan Carousel */}
            <div className="relative flex items-center justify-center mb-10 md:mb-14 who-card" style={{ height: 'clamp(300px, 45vh, 460px)' }}>
              {[
                { line1: 'Product', line2: 'Designers', img: '/design.JPG', rotate: -8, offsetX: '-55%', zIndex: 1 },
                { line1: 'Software', line2: 'Developers', img: '/dev.JPG', rotate: 0, offsetX: '0%', zIndex: 3 },
                { line1: 'Business', line2: 'Members', img: '/business.jpg', rotate: 8, offsetX: '55%', zIndex: 1 },
              ].map((card) => (
                <div
                  key={card.line1}
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
                  <img
                    src={card.img}
                    alt={`${card.line1} ${card.line2}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-0 right-0 text-center text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <span className="block text-sm md:text-base font-normal tracking-wide">{card.line1}</span>
                    <span className="block text-lg md:text-xl font-medium italic tracking-wide">{card.line2}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center who-card" style={{ animationDelay: '300ms' }}>
              <button className="group flex items-center gap-2 px-8 py-3 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 cursor-pointer">
                <span className="text-base md:text-lg font-light tracking-wide">About Us</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div ref={projectsSectionRef} className="fixed inset-0 z-[4] overflow-hidden" style={{ opacity: projectsOpacity * projectsFadeOut, transform: `translateY(${projectsTranslateY}px)`, pointerEvents: projectsOpacity > 0.1 && projectsFadeOut > 0.1 ? 'auto' : 'none' }}>
        <div className="h-full px-4 md:px-8 bg-[#F6F5F4] flex items-start justify-center overflow-y-auto" style={{ paddingTop: `${navHeight + 48}px` }}>
          <div className="max-w-6xl mx-auto w-full">
            <h2 className="text-[#17558E] text-3xl md:text-5xl font-medium tracking-wide mb-3 md:mb-4 project-card-animate">
              Powering Real Change
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-light leading-relaxed max-w-2xl mb-10 md:mb-14 project-card-animate">
              We turn vision into reality for nonprofits and socially impactful organizations, building the software that powers real change.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-14">
              {[
                {
                  semester: 'Fall 2024',
                  title: 'Helping combat food insecurity in Nigeria',
                  description: 'We empowered Lagos Food Bank to serve over 2,000,000 beneficiaries by streamlining their operations. Our system simplified volunteer sign-ups, and provided comprehensive tools for tracking events, and the work of 24,000+ volunteers.',
                  icon: '/lfbi.png',
                },
                {
                  semester: 'Fall 2024',
                  title: 'Connecting communities through local events',
                  description: 'We built a platform for Ithaca community organizations to share events, coordinate resources, and reach broader audiences — making it easier for residents to discover and participate in local initiatives.',
                  icon: '/cev.png',
                },
                {
                  semester: 'Spring 2025',
                  title: 'Streamlining mentorship for underserved youth',
                  description: 'We developed a matching and management platform for a youth mentorship nonprofit, helping mentors and mentees connect based on interests, availability, and goals — improving engagement and outcomes.',
                  icon: '/mentorship.png',
                },
              ].map((project, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col justify-between bg-white/50 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 md:p-7 hover:bg-white/80 hover:border-slate-300 hover:shadow-lg transition-all duration-300 project-card-animate"
                >
                  <div>
                    <span className="text-slate-400 text-xs font-medium tracking-widest uppercase">{project.semester}</span>
                    <h3 className="text-slate-800 text-lg md:text-xl font-medium leading-snug mt-2 mb-4">
                      {project.title}
                    </h3>
                    <p className="text-slate-500 text-sm font-light leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                    <a href="#" className="group/link flex items-center gap-1.5 text-slate-600 text-sm font-medium hover:text-[#17558E] transition-colors">
                      Learn more
                      <ChevronRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                    {project.icon && (
                      <img src={project.icon} alt="" className="w-9 h-9 rounded-lg object-contain opacity-60" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center project-card-animate">
              <a href="#" className="text-slate-600 text-sm font-medium tracking-wide underline underline-offset-4 decoration-slate-300 hover:text-[#17558E] hover:decoration-[#17558E] transition-colors">
                view more projects
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Annual Report Section */}
      <div ref={reportSectionRef} className="fixed inset-0 z-[3] overflow-hidden" style={{ opacity: reportOpacity, transform: `translateY(${reportTranslateY}px)`, pointerEvents: reportOpacity > 0.1 ? 'auto' : 'none' }}>
        <div className="h-full px-4 md:px-8 bg-[#F6F5F4] flex items-start justify-center overflow-y-auto" style={{ paddingTop: `${navHeight + 48}px` }}>
          <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
            <h2 className="text-[#17558E] text-3xl md:text-5xl font-medium text-center tracking-wide mb-8 md:mb-12 annual-report-section">
              Annual Report
            </h2>

            <div className="annual-report-section w-full flex justify-center">
              {showFlipBook ? (
                <Suspense fallback={
                  <div className="flex items-center justify-center h-[400px] text-slate-400 text-lg">
                    Loading report...
                  </div>
                }>
                  <FlipBook pdfUrl="/AnnualReport.pdf" />
                </Suspense>
              ) : null}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default App;
