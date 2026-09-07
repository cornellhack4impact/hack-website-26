import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Linkedin } from 'lucide-react';
import {
  TEAM_CATEGORIES,
  TEAM_DATA,
  type TeamCategory,
} from '../data/team';
import AlumniLogoWall from './AlumniLogoWall';

interface AboutPageProps {
  /** Height of the fixed top nav so the hero clears it on every screen. */
  navClearance: number;
}

/* Initials avatar — always rendered behind the optional headshot
 * image. When `member.image` is set and loads, it covers the
 * initials; if it 404s we hide the <img> via inline display:none and
 * the initials show through. So the same component handles both
 * "no photo yet" and "photo loading / broken" without conditionals. */
const InitialsAvatar: React.FC<{ name: string }> = ({ name }) => {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#E8F1F8] via-[#F6F5F4] to-[#E0EEF1] text-[#17558E] text-2xl md:text-3xl font-medium tracking-wide">
      {initials || '–'}
    </div>
  );
};

/* ------------------------------------------------------------------
 * About page — natural-flow scrolling layout. Three stacked sections
 * (Hero, Team, Alumni) plus a compliance footer. There are no fixed
 * layers and no scroll-driven phase transitions here: the page just
 * scrolls like a normal document, which avoids the "scroll within a
 * scroll" UX problem that nested overflow:auto containers create.
 *
 * The home page (App.tsx) is the only place that uses the layered
 * crossfade architecture; secondary pages favor familiarity over
 * spectacle so users can scan their content quickly.
 * ------------------------------------------------------------------ */
const AboutPage: React.FC<AboutPageProps> = ({ navClearance }) => {
  const [activeCategory, setActiveCategory] = useState<TeamCategory>('Eboard');
  const [teamImageBroken, setTeamImageBroken] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null);

  /* Close the mobile category dropdown when the user taps outside or
   * presses Escape — same behavior as a native <select>, in-theme. */
  useEffect(() => {
    if (!categoryDropdownOpen) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCategoryDropdownOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [categoryDropdownOpen]);

  return (
    <div className="relative w-full bg-[#F6F5F4]">

      {/* ============================================================
          HERO — title + sidebar chip + team photo. paddingTop clears
          the fixed nav; padding-bottom separates from the next
          section.
          ============================================================ */}
      <section
        className="px-4 md:px-8 pb-12 md:pb-20"
        style={{ paddingTop: `${navClearance + 48}px` }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-12 mb-8 md:mb-12">
            <h1 className="text-[#17558E] font-medium tracking-tight leading-[0.95]">
              <span className="block text-[clamp(1.85rem,6vw,4.25rem)]">
                Building for a
              </span>
              <span
                className="block italic text-[clamp(2.5rem,8.25vw,5.75rem)] mt-1 md:mt-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                better world.
              </span>
            </h1>
            <div className="md:text-right md:max-w-[18rem] md:pb-3 shrink-0">
              <p className="text-slate-500 text-base md:text-lg leading-snug font-light">
                Loved by nonprofits.
                <br />
                Built by students
              </p>
              {/* Non-button: looks like a chip, but isn't interactive. */}
              <span
                className="inline-block mt-3 px-4 py-2 rounded-full bg-[#E8F1F8] text-[#17558E] text-sm font-medium select-none cursor-default"
                role="note"
                aria-label="Application status"
              >
                Check here for applications later
              </span>
            </div>
          </div>

          {/* Team photo — full container width at natural aspect.
              Falls back to a placeholder while team.jpg isn't there. */}
          {!teamImageBroken ? (
            <img
              src="/team.jpg"
              alt="The Hack4Impact team"
              className="block w-full h-auto rounded-3xl border border-slate-200/80"
              onError={() => setTeamImageBroken(true)}
            />
          ) : (
            <div className="w-full aspect-[16/9] rounded-3xl border border-slate-200/80 bg-slate-100 flex items-center justify-center text-slate-400 text-sm tracking-wide">
              Add /public/team.jpg
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          OUR TEAM — heading, category switcher (mobile dropdown /
          desktop pill tabs), then the responsive grid of member
          cards. Whole grid is in natural flow; no inner scrollbox.
          ============================================================ */}
      <section className="px-4 md:px-8 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-8 mb-8 md:mb-10">
            <h2 className="text-[#17558E] text-3xl md:text-5xl font-medium tracking-tight">
              Our Team
            </h2>

            {/* Mobile — custom in-theme dropdown (the native <select>
                breaks the visual language with an OS-rendered list). */}
            <div ref={categoryDropdownRef} className="md:hidden relative w-full">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                className="w-full px-5 py-3 rounded-full bg-white border border-slate-200/80 shadow-sm text-[#17558E] text-sm font-semibold flex items-center justify-between gap-3 cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#17558E]/30 transition-colors"
                aria-haspopup="listbox"
                aria-expanded={categoryDropdownOpen}
                aria-label="Filter team members by group"
              >
                <span>{activeCategory}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Always-rendered panel so we can animate open/close
                  via opacity + scale rather than mount/unmount. */}
              <div
                role="listbox"
                aria-hidden={!categoryDropdownOpen}
                className={
                  'absolute left-0 right-0 top-full mt-2 z-30 origin-top rounded-2xl bg-white border border-slate-200/80 shadow-lg overflow-hidden transition-all duration-150 ease-out ' +
                  (categoryDropdownOpen
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-95 pointer-events-none')
                }
              >
                {TEAM_CATEGORIES.map((cat) => {
                  const active = cat === activeCategory;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        setActiveCategory(cat);
                        setCategoryDropdownOpen(false);
                      }}
                      className={
                        'w-full px-5 py-3 text-left text-sm font-medium flex items-center justify-between gap-3 transition-colors ' +
                        (active
                          ? 'bg-[#17558E]/[0.06] text-[#17558E]'
                          : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100')
                      }
                    >
                      <span>{cat}</span>
                      {active && <Check className="w-4 h-4 text-[#17558E]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop — pill tab switcher. */}
            <div className="hidden md:inline-flex gap-1 p-1 rounded-full bg-white border border-slate-200/80 shadow-sm">
              {TEAM_CATEGORIES.map((cat) => {
                const active = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={
                      'px-5 py-2 rounded-full text-[15px] font-medium transition-colors duration-200 ' +
                      (active
                        ? 'bg-[#17558E] text-white shadow-sm'
                        : 'text-slate-600 hover:text-[#17558E]')
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {TEAM_DATA[activeCategory].length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-12">
              No members in this category yet — add some in data/team.ts.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {TEAM_DATA[activeCategory].map((member, idx) => (
                <article
                  key={`${member.name}-${idx}`}
                  className="group rounded-2xl bg-white border border-slate-200/80 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300"
                >
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    <InitialsAvatar name={member.name} />
                    {member.image && (
                      <img
                        src={member.image}
                        alt={member.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={member.imagePosition ? { objectPosition: member.imagePosition } : undefined}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  <div className="px-3 md:px-4 py-3 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-slate-800 text-sm md:text-[15px] font-medium truncate">
                        {member.name}
                      </div>
                      <div className="text-slate-500 text-xs mt-0.5 truncate">
                        {member.role}
                      </div>
                    </div>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                        className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#17558E]/5 text-[#17558E] hover:bg-[#17558E] hover:text-white transition-colors"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          ALUMNI — logo wall constellation. The component already
          owns its horizontal padding; we add the vertical breathing
          room here.
          ============================================================ */}
      <section className="py-12 md:py-20">
        <AlumniLogoWall />
      </section>

      {/* ============================================================
          COMPLIANCE FOOTER — Cornell-required disclaimer. Sits at
          the very bottom of the page in normal flow.
          ============================================================ */}
      <footer className="px-4 md:px-8 pb-10 md:pb-14">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed">
            The{' '}
            <a
              href="https://hr.cornell.edu/about/workplace-rights/equal-education-and-employment"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#17558E] underline underline-offset-2 decoration-[#17558E]/30 hover:decoration-[#17558E] transition-colors"
            >
              Equal Education and Employment Opportunity Statement
            </a>{' '}
            is our university commitment to a welcoming and supportive community for students, faculty and staff.
          </p>
          <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed mt-1.5">
            This organization is a registered student organization of Cornell University.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
