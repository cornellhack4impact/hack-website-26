import React, { useEffect, useRef, useState } from 'react';
import CustomGlobe from './components/CustomGlobe';
import { ArrowUpRight, ArrowDown, Menu, X } from 'lucide-react';

const HERO_BACKGROUND = '#dbeafe';

const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollPhase2, setScrollPhase2] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const [navHeight, setNavHeight] = useState(96);
  const navRef = useRef<HTMLDivElement | null>(null);
  const whoSectionRef = useRef<HTMLDivElement | null>(null);
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
  const whoWeAreOpacity = Math.max((scrollPhase2 - 0.4) * 1.67, 0);
  const whoWeAreTranslateY = Math.max(40 - whoWeAreOpacity * 40, 0);

  // Re-appear after the globe settles so users know to keep scrolling.
  const postGlobeArrowOpacity = scrollPhase2 === 0 ? Math.max((scrollProgress - 0.78) * 4.5, 0) : 0;
  const contentTopPadding = Math.max(navHeight + 24, 120);
  const compactHeaderTop = navHeight + 36;

  return (
    <div className="relative w-full min-h-[400vh] bg-[#dbeafe]">
      
      {/* Fixed Background Layer with Globe */}
      <div className="fixed inset-0 z-10 pointer-events-none" style={{ background: HERO_BACKGROUND, display: globeContentOpacity <= 0 ? 'none' : undefined }}>

        {/* Globe Container - Translates up based on scroll */}
        {/* Added pointer-events-auto so the globe can be spun by the user */}
        <div
          className="absolute inset-0 z-10 transition-transform duration-75 ease-out will-change-transform flex items-center justify-center pointer-events-auto"
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
        <h2 className="text-slate-800 text-3xl md:text-4xl font-light text-center leading-tight tracking-wide">
          Tech for social good. <br />
          Built by students.
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
          <h1 className="text-[clamp(1.35rem,7.2vw,4.4rem)] md:text-7xl font-thin text-slate-800 tracking-wide leading-tight whitespace-nowrap">
          Tech For Social Good.
          </h1>
          <h1 className="text-[clamp(1.55rem,8vw,4.4rem)] md:text-7xl font-normal text-slate-800 tracking-wide leading-tight mt-2 whitespace-nowrap">
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
      <div ref={whoSectionRef} className="fixed inset-0 z-[5] overflow-y-auto" style={{ opacity: whoWeAreOpacity, transform: `translateY(${whoWeAreTranslateY}px)`, pointerEvents: whoWeAreOpacity > 0.1 ? 'auto' : 'none' }}>
        <div className="min-h-screen px-4 md:px-8 py-20 md:py-28 bg-[#dbeafe]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-slate-800 text-3xl md:text-5xl font-light text-center tracking-wide mb-16 md:mb-20 who-we-are-title">
              Who We Are
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-14">
              {[
                { label: 'Design', img: '/design.JPG' },
                { label: 'Develop', img: '/dev.JPG' },
                { label: 'Business', img: '/business.jpg' },
              ].map((card, i) => (
                <div
                  key={card.label}
                  className="who-card group relative rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col items-center justify-end aspect-[4/5] cursor-pointer hover:border-slate-300 hover:shadow-lg transition-all duration-500"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <img
                    src={card.img}
                    alt={card.label}
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <span className="relative z-10 text-white text-xl md:text-2xl font-light tracking-wide pb-8">
                    {card.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-center who-card" style={{ animationDelay: '450ms' }}>
              <button className="group flex items-center gap-2 px-8 py-3 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 cursor-pointer">
                <span className="text-base md:text-lg font-light tracking-wide">About Us</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default App;
