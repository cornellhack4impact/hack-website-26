import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { PROJECTS, type Project } from '../data/projects';
import { PARTNERS, type Partner } from '../data/partners';
import { MEDIUM_URL } from '../utils/links';

interface OurWorkPageProps {
  /** Height of the fixed top nav so the hero clears it on every screen. */
  navClearance: number;
}

/* ------------------------------------------------------------------
 * Partner chip — circular avatar. Always renders the partner's
 * initials on a soft brand-colored gradient. If `logo` is set the
 * image overlays the initials; if it 404s we hide the img inline so
 * the initials show through. Local state tracks load failures so
 * transparent PNGs / SVGs don't show the initials behind the logo.
 * ------------------------------------------------------------------ */
const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || '–';

const PartnerChip: React.FC<{ partner: Partner; size?: 'sm' | 'md' }> = ({
  partner,
  size = 'md',
}) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const showInitials = !partner.logo || logoFailed;

  const dims =
    size === 'sm'
      ? 'w-12 h-12 text-[11px]'
      : 'w-14 h-14 md:w-16 md:h-16 text-[11px] md:text-xs';
  return (
    <div
      className={`relative ${dims} rounded-full bg-white border border-slate-200/80 shadow-sm overflow-hidden flex items-center justify-center text-[#17558E] font-semibold tracking-wide hover:shadow-md hover:border-slate-300 transition-all duration-300`}
      title={partner.name}
      aria-label={partner.name}
    >
      {showInitials && <span>{initialsOf(partner.name)}</span>}
      {partner.logo && !logoFailed && (
        <img
          src={`/partners/${partner.logo}`}
          alt={partner.name}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-contain ${partner.padding ?? 'p-2'}`}
          onError={() => setLogoFailed(true)}
        />
      )}
    </div>
  );
};

/* ------------------------------------------------------------------
 * Featured project card — wide horizontal layout with copy on one
 * side and a large image on the other. Soft brand gradient sits
 * behind transparent mockups; the image uses object-contain so the
 * gradient stays visible around the artwork.
 * ------------------------------------------------------------------ */
const FeaturedProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const showPlaceholder = !project.image || imageFailed;

  return (
    <article className="group grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)] gap-5 md:gap-8 items-stretch">
      <div className="flex flex-col">
        <h3 className="text-slate-800 text-xl md:text-2xl font-medium tracking-tight mb-2 md:mb-3">
          {project.name}
        </h3>
        <p className="text-slate-500 text-sm md:text-[15px] font-light leading-relaxed">
          {project.description}
        </p>
        <span className="text-slate-400 text-[11px] font-semibold tracking-[0.2em] uppercase mt-3 md:mt-4">
          {project.semester}
        </span>
        <a
          href={project.link ?? '#'}
          {...(project.link
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : { onClick: (e: React.MouseEvent) => e.preventDefault() })}
          className="inline-flex items-center gap-1 text-[#17558E] text-sm font-medium hover:underline self-start mt-auto pt-4"
        >
          View project
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      <div className="relative aspect-[16/9] md:aspect-[16/10] rounded-2xl bg-gradient-to-br from-[#E8F1F8] via-[#F6F5F4] to-[#E0EEF1] border border-slate-200/80 overflow-hidden">
        {showPlaceholder ? (
          <div className="absolute inset-0 flex items-center justify-center text-[#17558E] text-2xl md:text-3xl font-medium tracking-wide px-4 text-center">
            {project.name}
          </div>
        ) : (
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain p-1 md:p-1.5 transition-transform duration-500 group-hover:scale-[1.02]"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>
    </article>
  );
};

/* Hand-tuned 0..100 percent positions for the hero's partner
 * constellation. Picked so chips at scale 0.8–1.15 don't overlap.
 * Cycles through the array if more partners exist. */
const CONSTELLATION: { top: string; left: string; scale: number; delay: string }[] = [
  { top: '4%',  left: '32%', scale: 1.0,  delay: '0.0s' },
  { top: '12%', left: '68%', scale: 0.85, delay: '0.6s' },
  { top: '22%', left: '8%',  scale: 0.9,  delay: '1.1s' },
  { top: '30%', left: '46%', scale: 1.15, delay: '0.3s' },
  { top: '34%', left: '82%', scale: 0.85, delay: '0.9s' },
  { top: '46%', left: '22%', scale: 0.95, delay: '1.4s' },
  { top: '50%', left: '60%', scale: 0.9,  delay: '0.5s' },
  { top: '60%', left: '4%',  scale: 0.85, delay: '1.0s' },
  { top: '64%', left: '40%', scale: 1.05, delay: '1.7s' },
  { top: '66%', left: '78%', scale: 0.9,  delay: '0.4s' },
  { top: '78%', left: '20%', scale: 0.95, delay: '0.8s' },
  { top: '82%', left: '56%', scale: 0.85, delay: '1.3s' },
  { top: '88%', left: '84%', scale: 0.8,  delay: '0.2s' },
];

/* ------------------------------------------------------------------
 * Our Work page — natural-flow scrolling layout. Two stacked
 * sections (Hero with reach stats + partner constellation, Featured
 * projects list with Medium footer). No fixed layers, no inner
 * scroll containers.
 * ------------------------------------------------------------------ */
const OurWorkPage: React.FC<OurWorkPageProps> = ({ navClearance }) => {
  const reachStats: { value: string; label: string }[] = [
    { value: '11', label: 'Cities' },
    { value: '5', label: 'States' },
    { value: '4', label: 'Countries' },
    { value: '3', label: 'Continents' },
  ];

  return (
    <div className="relative w-full bg-[#F6F5F4]">

      {/* ============================================================
          HERO — copy on the left + partner constellation on the
          right. paddingTop clears the fixed nav.
          ============================================================ */}
      <section
        className="relative px-4 md:px-8 pb-12 md:pb-20 overflow-hidden"
        style={{ paddingTop: `${navClearance + 48}px` }}
      >
        {/* Ambient brand-colored glows — purely decorative. */}
        <div
          className="pointer-events-none absolute -top-32 -left-24 w-[36rem] h-[36rem] rounded-full opacity-[0.16] blur-3xl"
          style={{ background: 'radial-gradient(circle, #17558E 0%, transparent 60%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-24 w-[40rem] h-[40rem] rounded-full opacity-[0.12] blur-3xl"
          style={{ background: 'radial-gradient(circle, #4CB6C4 0%, transparent 60%)' }}
        />

        <div className="relative max-w-6xl mx-auto w-full grid md:grid-cols-[1.05fr_1fr] gap-10 md:gap-14 items-center">

          {/* ── LEFT: copy + stats ───────────────────────────── */}
          <div>
            <span className="block text-slate-400 text-xs md:text-sm font-semibold tracking-[0.3em] uppercase mb-4 md:mb-5">
              Our Work
            </span>
            <h1 className="text-[#17558E] font-medium tracking-tight leading-[0.95]">
              <span className="block text-4xl md:text-5xl lg:text-6xl">
                Built to
              </span>
              <span
                className="block text-5xl md:text-6xl lg:text-7xl italic mt-1 md:mt-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Make a Difference.
              </span>
            </h1>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed font-light max-w-md mt-5 md:mt-6">
              We build with empathy, impact, and for the communities we're here to support.
            </p>

            {/* Stats — 2x2 grid of glassy fact tiles. */}
            <div className="mt-7 md:mt-8 grid grid-cols-4 gap-2 md:gap-3 max-w-md">
              {reachStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200/80 px-2 py-3 md:px-3 md:py-4 text-center"
                >
                  <div className="text-[#17558E] text-xl md:text-2xl font-medium tracking-tight leading-none">
                    {stat.value}
                  </div>
                  <div className="text-slate-500 text-[10px] md:text-[11px] font-medium tracking-wide mt-1.5 md:mt-2 uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-[11px] md:text-xs font-medium tracking-[0.2em] uppercase mt-3 md:mt-4">
              Our clients span the world
            </p>
          </div>

          {/* ── RIGHT: partner constellation (desktop) ────────── */}
          <div className="hidden md:block relative">
            {/* Soft inner glow behind the cluster. */}
            <div
              className="pointer-events-none absolute inset-6 rounded-full opacity-50 blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(232,241,248,0.9) 0%, rgba(224,238,241,0.4) 50%, transparent 80%)',
              }}
            />
            <div className="relative w-full mx-auto aspect-[4/5] max-w-[26rem]">
              {PARTNERS.map((partner, i) => {
                const pos = CONSTELLATION[i % CONSTELLATION.length];
                return (
                  <div
                    key={partner.name}
                    className="absolute partner-float"
                    style={{
                      top: pos.top,
                      left: pos.left,
                      animationDelay: pos.delay,
                      // CSS variable consumed by `partnerFloat` keyframe
                      // so the static scale isn't lost when the
                      // animation overrides `transform`.
                      ['--chip-scale' as string]: pos.scale,
                    } as React.CSSProperties}
                  >
                    <PartnerChip partner={partner} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── BELOW (mobile only): chips wrap into rows ─────── */}
          <div className="md:hidden">
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-sm mx-auto">
              {PARTNERS.map((partner) => (
                <PartnerChip key={partner.name} partner={partner} size="sm" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURED — vertical list of horizontal project cards in
          natural document flow. Hairlines separate cards.
          ============================================================ */}
      <section className="px-4 md:px-8 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between gap-4 mb-8 md:mb-10">
            <h2 className="text-[#17558E] text-3xl md:text-5xl font-medium tracking-tight leading-tight">
              Featured
            </h2>
            <span className="hidden md:inline text-slate-400 text-sm font-medium">
              {PROJECTS.length} projects
            </span>
          </div>

          <div className="divide-y divide-slate-200">
            {PROJECTS.map((project) => (
              <div key={project.name} className="py-6 md:py-8 first:pt-0 last:pb-0">
                <FeaturedProjectCard project={project} />
              </div>
            ))}
          </div>

          <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-500 text-sm md:text-base font-light">
              Want to learn more about our previous projects? Check out our{' '}
              <a
                href={MEDIUM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#17558E] underline underline-offset-2 decoration-[#17558E]/40 hover:decoration-[#17558E] font-medium transition-colors"
              >
                Medium
              </a>{' '}
              page.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurWorkPage;
