import React, { useRef, useState } from 'react';
import { ArrowUpRight, Check, Mail } from 'lucide-react';
import { fixedLayerStyle, useScrollPhases } from '../utils/scroll';
import {
  APPLICATIONS_URL,
  COFFEE_CHATS_URL,
  CONTACT_EMAIL,
  CROWDFUNDING_URL,
  ROLE_DETAILS_URL,
  SPONSORSHIP_PACKAGE_URL,
} from '../utils/links';

interface WorkWithUsPageProps {
  /** Height of the fixed top nav so the hero clears it on every screen. */
  navClearance: number;
}

/* External URLs and contact info live in utils/links.ts so a single
 * change updates every page that references them. */

/* Recruitment timelines for the Students tab. */
const RECRUITMENT_TIMELINES: {
  title: string;
  items: { date: string; event: string; detail?: string }[];
}[] = [
  {
    title: 'Upperclassmen',
    items: [
      { date: '8/17', event: 'Applications Open' },
      { date: '8/25', event: 'Info Session #1', detail: '5–6pm · Gates 114' },
      { date: '8/26', event: 'Design Engineering Workshop', detail: '6–7:30pm · Hollister 314' },
      { date: '8/28', event: 'Cursor x Coffee Chats Lunch Hour', detail: '12–1:30pm · Gates Lobby' },
      { date: '8/28', event: 'Mastering the Behavioral Interview', detail: '5–6pm · Room TBD' },
      { date: '9/1', event: 'Project Teams Fest', detail: '4–6pm · Duffield Atrium' },
      { date: '9/1', event: 'Developer Technical Workshop', detail: '6–7:30pm · Hollister 314' },
      { date: '9/2', event: 'Info Session #2 & Speed Coffee Chats', detail: '5–6:30pm · Gates 114' },
      { date: '9/3', event: 'Applications Due' },
    ],
  },
  {
    title: 'Freshmen + Transfers',
    items: [
      { date: 'Late Sep', event: 'Applications Open' },
      {
        date: 'Sep–Oct 15',
        event: 'Freshmen Mentorship Program',
        detail: 'More info coming soon',
      },
      { date: '10/15', event: 'Applications Due' },
    ],
  },
];

/* Project lifecycle for the Nonprofits tab. */
const NONPROFIT_PROCESS: { title: string; subtitle: string }[] = [
  { title: 'Scoping with PMs', subtitle: 'Initial Call' },
  { title: 'User Interviews', subtitle: 'Month 1' },
  { title: 'Usability Testing', subtitle: 'Month 3' },
  { title: 'Product Showcase', subtitle: 'Month 5' },
  { title: 'Product Handoff', subtitle: '1–2 semesters later' },
];

/* Student role cards — image paths point at /public/. */
const ROLES: { title: string; description: string; image: string }[] = [
  {
    title: 'Developers',
    description:
      "Interested in developing products for social good? Apply to Hack4Impact's development team!",
    image: '/dev2.jpg',
  },
  {
    title: 'Designers',
    description:
      "Interested in end-to-end design from user research to high-fidelity screens? Apply to Hack4Impact's design team!",
    image: '/design2.jpg',
  },
  {
    title: 'Business',
    description:
      "Interested in product research, marketing, and management? Apply to Hack4Impact's business team!",
    image: '/business2.jpg',
  },
];

/* Sponsorship tiers. `highlight: true` adds a "Most popular" badge. */
const TIERS: {
  name: string;
  price: string;
  accent: string;
  highlight?: boolean;
  benefits: string[];
}[] = [
  {
    name: 'Bronze',
    price: '$1000',
    accent: '#A0734F',
    benefits: [
      'Access to resume book',
      'Publicity on our website',
      'Host a general body initiative (1 annual event)',
    ],
  },
  {
    name: 'Silver',
    price: '$1,000',
    accent: '#8E96A6',
    benefits: [
      'Access to resume book',
      'Publicity on our website',
      'Host a general body initiative (2 annual events)',
      'Host a campus-wide initiative',
    ],
  },
  {
    name: 'Gold',
    price: '$2,000',
    accent: '#C8A04C',
    highlight: true,
    benefits: [
      'Access to resume book',
      'Publicity on our website',
      'Host a general body initiative (4 annual events)',
      'Host a campus-wide initiative',
      'Feature in our annual report',
    ],
  },
  {
    name: 'Platinum',
    price: '$3,000',
    accent: '#17558E',
    benefits: [
      'Access to resume book',
      'Publicity on our website',
      'Host a general body initiative (unlimited events)',
      'Host a campus-wide initiative',
      'Feature in our annual report',
      'Targeted social media support',
      'Joint innovation lab',
    ],
  },
];

const AUDIENCES = [
  {
    key: 'students' as const,
    label: 'Students',
    blurb: 'Build alongside a tight-knit community of designers, developers, and PMs.',
  },
  {
    key: 'nonprofits' as const,
    label: 'Nonprofits',
    blurb: 'Partner with us to develop the software that powers your mission.',
  },
  {
    key: 'sponsors' as const,
    label: 'Sponsors',
    blurb: 'Help fund the next generation of student builders making real impact.',
  },
];

type Audience = (typeof AUDIENCES)[number]['key'];

/* ============================================================
 * SECTION COMPONENTS — one per audience tab. Each renders in
 * natural document flow inside the page.
 * ============================================================ */

const StudentsSection: React.FC = () => (
  <div className="space-y-10 md:space-y-14">
    <div>
      <h2 className="text-[#17558E] text-3xl md:text-4xl font-medium tracking-tight leading-tight mb-4">
        Students
      </h2>
      <p className="text-slate-500 text-base md:text-lg font-light leading-relaxed max-w-3xl">
        Passionate about software and social impact? Looking for a unique and close-knit community? Join us. Our mission gives you a distinct experience to develop technical skills and work with nonprofit clients — applying what you learn to lives that need it.
      </p>
      <p className="text-slate-500 text-sm md:text-base font-light leading-relaxed mt-3 max-w-3xl">
        Fall 2026 upperclassmen applications are open — due September 3rd at 11:59 PM.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={APPLICATIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#17558E] text-white text-sm font-medium hover:bg-[#0F3C6B] transition-colors shadow-sm"
        >
          Fall 2026 Applications
          <ArrowUpRight className="w-4 h-4" />
        </a>
        <a
          href={COFFEE_CHATS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#17558E]/30 bg-white text-[#17558E] text-sm font-medium hover:bg-[#E8F1F8] transition-colors shadow-sm"
        >
          Fall 2026 Coffee Chat Sign Up
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>

    {/* Full-width twin timeline cards — room to breathe */}
    <div>
      <div className="text-slate-400 text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">
        Recruitment Timelines
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 items-start">
        {RECRUITMENT_TIMELINES.map((section) => (
          <div
            key={section.title}
            className="rounded-2xl bg-white border border-slate-200/80 p-5 md:p-6 shadow-sm"
          >
            <h3 className="text-[#17558E] text-lg md:text-xl font-medium tracking-tight mb-4">
              {section.title}
            </h3>
            <ul className="space-y-3">
              {section.items.map((item, i) => (
                <li
                  key={`${section.title}-${item.date}-${i}`}
                  className="grid grid-cols-[3.25rem_1fr] sm:grid-cols-[3.75rem_1fr] gap-x-3 gap-y-0.5"
                >
                  <span className="text-[#17558E] text-sm font-semibold tabular-nums pt-0.5">
                    {item.date}
                  </span>
                  <div className="min-w-0">
                    <div className="text-slate-800 text-sm font-medium leading-snug">
                      {item.event}
                    </div>
                    {item.detail && (
                      <div className="text-slate-400 text-xs mt-0.5 leading-snug">
                        {item.detail}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* Role cards */}
    <div>
      <div className="h-px bg-slate-200 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {ROLES.map((role) => (
          <div
            key={role.title}
            className="group rounded-2xl overflow-hidden bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
          >
            <div className="relative aspect-[4/3] bg-gradient-to-br from-[#E8F1F8] via-[#F6F5F4] to-[#E0EEF1] overflow-hidden">
              <img
                src={role.image}
                alt={role.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="p-5">
              <h3 className="text-[#17558E] text-xl md:text-2xl font-medium tracking-tight mb-2">
                {role.title}
              </h3>
              <p className="text-slate-500 text-sm font-light leading-relaxed">
                {role.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 md:mt-8">
        <a
          href={ROLE_DETAILS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#17558E] text-white text-sm font-medium hover:bg-[#0F3C6B] transition-colors shadow-sm"
        >
          Learn more about each role
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  </div>
);

const NonprofitsSection: React.FC = () => (
  <div className="space-y-10 md:space-y-14">
    <div>
      <h2 className="text-[#17558E] text-3xl md:text-4xl font-medium tracking-tight leading-tight mb-4">
        Nonprofits
      </h2>
      <p className="text-slate-500 text-base md:text-lg font-light leading-relaxed max-w-3xl">
        At Hack4Impact, we recognize nonprofits as essential to the communities we serve. Our collaborations run 1–2 semesters (4–12 months), and we'll work with you to ship a software product tailored to your organization's needs.
      </p>
    </div>

    {/* Process timeline — navy "feature" panel for visual contrast. */}
    <div
      className="rounded-3xl px-5 md:px-10 py-10 md:py-14"
      style={{ background: 'linear-gradient(135deg, #0F3C6B 0%, #17558E 100%)' }}
    >
      <h3 className="text-white text-xl md:text-2xl font-medium tracking-tight text-center mb-2">
        What to Expect
      </h3>
      <p className="text-white/70 text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto text-center mb-10 md:mb-12">
        Each engagement follows the same arc — kickoff, research, iteration, demo, handoff.
      </p>

      {/* Desktop: horizontal milestones connected by a line */}
      <div className="hidden md:block relative">
        <div className="absolute left-[6%] right-[6%] top-1/2 h-px bg-white/30 -translate-y-1/2" />
        <div className="relative grid grid-cols-5 gap-4">
          {NONPROFIT_PROCESS.map((step) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <div className="text-white text-sm font-semibold tracking-tight mb-3 min-h-[2.5rem] flex items-end">
                {step.title}
              </div>
              <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.15)]" />
              <div className="text-white/70 text-xs font-light mt-3">
                {step.subtitle}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical milestones */}
      <div className="md:hidden">
        {NONPROFIT_PROCESS.map((step, i) => (
          <div key={step.title} className="flex items-start gap-4">
            <div className="flex flex-col items-center pt-1">
              <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.15)]" />
              {i < NONPROFIT_PROCESS.length - 1 && (
                <div className="w-px flex-1 bg-white/30 mt-2 min-h-[36px]" />
              )}
            </div>
            <div className={`flex-1 ${i < NONPROFIT_PROCESS.length - 1 ? 'pb-6' : ''}`}>
              <div className="text-white text-sm font-semibold tracking-tight">
                {step.title}
              </div>
              <div className="text-white/70 text-xs font-light mt-0.5">
                {step.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Contact CTA */}
    <div className="rounded-2xl bg-white border border-slate-200/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h3 className="text-slate-800 text-lg md:text-xl font-medium tracking-tight">
          Are you interested in working with us?
        </h3>
        <p className="text-slate-500 text-sm md:text-base font-light mt-1">
          Send us an email and we'll reach out in 3–5 business days.
        </p>
      </div>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#17558E] text-white text-sm font-medium hover:bg-[#0F3C6B] transition-colors shadow-sm self-start md:self-auto"
      >
        <Mail className="w-4 h-4" />
        {CONTACT_EMAIL}
      </a>
    </div>
  </div>
);

const SponsorsSection: React.FC = () => (
  <div className="space-y-10 md:space-y-14">
    <div className="grid md:grid-cols-[1.4fr_1fr] gap-8 md:gap-12 items-start">
      <div>
        <h2 className="text-[#17558E] text-3xl md:text-4xl font-medium tracking-tight leading-tight mb-4">
          Support Our Cause
        </h2>
        <p className="text-slate-500 text-base md:text-lg font-light leading-relaxed">
          Sponsorships fuel the social impact we create with our local and global partners. Your funding directly increases the quality and quantity of the projects we can take on.
        </p>
        <a
          href={SPONSORSHIP_PACKAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#17558E] text-white text-sm font-medium hover:bg-[#0F3C6B] transition-colors shadow-sm"
        >
          Sponsorship package
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      {/* "Your support matters" — three impact pillars. */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 md:p-6 shadow-sm">
        <div className="text-slate-400 text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">
          Your Support Matters
        </div>
        {[
          {
            title: 'Make an impact',
            body: "Your funding fuels everyday tools that help socially responsible organizations realize their missions.",
          },
          { title: 'Foster growth', body: 'Power the next generation of student builders learning to ship for real users.' },
          { title: 'Build connections', body: 'Open doors to a community of nonprofit partners and student talent.' },
        ].map((item, i, arr) => (
          <div
            key={item.title}
            className={`py-3 ${i < arr.length - 1 ? 'border-b border-slate-100' : ''}`}
          >
            <div className="text-[#17558E] text-sm font-semibold mb-1">{item.title}</div>
            <p className="text-slate-500 text-xs md:text-sm font-light leading-relaxed">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Sponsorship tiers */}
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-5 md:mb-6">
        <h3 className="text-slate-800 text-xl md:text-2xl font-medium tracking-tight">
          Sponsorship Tiers
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-2xl bg-white p-5 md:p-6 transition-all duration-300 ${
              tier.highlight
                ? 'border-2 border-[#17558E] shadow-md'
                : 'border border-slate-200/80 shadow-sm hover:border-slate-300 hover:shadow-md'
            }`}
          >
            {tier.highlight && (
              <span className="absolute -top-2.5 left-5 text-[10px] px-2 py-0.5 rounded-full bg-[#17558E] text-white font-semibold tracking-wide uppercase">
                Most popular
              </span>
            )}
            <div
              className="text-sm font-semibold tracking-[0.2em] uppercase"
              style={{ color: tier.accent }}
            >
              {tier.name}
            </div>
            <div className="text-slate-800 text-2xl md:text-3xl font-medium mt-1 mb-4">
              {tier.price}
            </div>
            <div className="h-px bg-slate-100 mb-4" />
            <ul className="space-y-2.5">
              {tier.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-xs md:text-[13px]">
                  <Check className="shrink-0 w-3.5 h-3.5 text-[#17558E] mt-0.5" />
                  <span className="text-slate-600 leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-slate-400 text-xs md:text-sm font-light mt-4">
        Questions? Email{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-[#17558E] underline underline-offset-2 hover:decoration-[#17558E]"
        >
          {CONTACT_EMAIL}
        </a>{' '}
        for our full sponsorship package.
      </p>
    </div>

    {/* Thank-you sponsors strip */}
    <div className="rounded-2xl bg-white border border-slate-200/80 px-5 py-8 md:px-8 md:py-10 text-center">
      <div className="text-slate-400 text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">
        Thank you to our sponsors
      </div>
      <div className="flex items-center justify-center gap-5 md:gap-8 flex-wrap">
        {([
          { src: 'bloomberg.png', alt: 'Bloomberg', scale: 1 },
          { src: 'accenture.png', alt: 'Accenture', scale: 1.08, nudgeY: '-20%' },
          { src: 'hrt.png', alt: 'HRT', scale: 0.92 },
          { src: 'roblox.png', alt: 'Roblox', scale: 1 },
          { src: 'verkada.png', alt: 'Verkada', scale: 0.95 },
        ] as { src: string; alt: string; scale: number; nudgeY?: string }[]).map((logo) => (
          <div
            key={logo.src}
            className="h-9 md:h-11 w-[6.5rem] md:w-[8.5rem] flex items-center justify-center"
          >
            <img
              src={`/logos/${logo.src}`}
              alt={logo.alt}
              className="max-h-full max-w-full object-contain opacity-80"
              style={{
                transform: `translateY(${logo.nudgeY ?? '0'}) scale(${logo.scale})`,
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>
    </div>

    {/* Contact + direct donation rail */}
    <div className="grid md:grid-cols-2 gap-4 md:gap-5">
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h4 className="text-slate-800 text-base md:text-lg font-medium">
            Interested in becoming a sponsor?
          </h4>
          <p className="text-slate-500 text-sm font-light mt-1">
            Or want to support us another way? We'd love to hear from you.
          </p>
        </div>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors self-start md:self-auto"
        >
          Contact us
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
      <div className="rounded-2xl bg-[#E8F1F8]/60 border border-[#17558E]/20 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h4 className="text-slate-800 text-base md:text-lg font-medium">Donations</h4>
          <p className="text-slate-500 text-sm font-light mt-1">
            Direct donations go through Cornell's official giving portal.
          </p>
        </div>
        <a
          href={CROWDFUNDING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#17558E] text-white text-sm font-medium hover:bg-[#0F3C6B] transition-colors self-start md:self-auto"
        >
          Donate now
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  </div>
);

/* ============================================================
 * MAIN PAGE — natural document flow with a hero, then a sticky
 * tab bar, then the selected audience's content. The tab bar
 * stays visible while scrolling so users can switch tabs without
 * scrolling back to the top.
 * ============================================================ */

const WorkWithUsPage: React.FC<WorkWithUsPageProps> = ({ navClearance }) => {
  const [audience, setAudience] = useState<Audience>('students');
  const tabBarRef = useRef<HTMLDivElement | null>(null);

  /* Hybrid layout — same idea as the home page:
   *   - The HERO is a fixed-position layer that crossfades out as
   *     the user scrolls (Frame 1).
   *   - Below the layered zone, the tab bar + audience content
   *     live in natural document flow (Frame 2). No nested scroll
   *     containers — the page itself just scrolls.
   *
   * Tight phase tuning: 0.5vh hold + 1vh fade keeps the hero from
   * lingering, and the 200vh wrapper makes Frame 2 land in the
   * viewport as the hero finishes fading — no "vast blank space"
   * between the two frames. */
  const [scrollPhase1] = useScrollPhases(1, 0.5, 1);
  const heroOpacity = Math.max(1 - scrollPhase1 * 2, 0);
  const heroTranslateY = -scrollPhase1 * 30;

  /* Tapping an audience card jumps the user past the layered hero
   * to the tab bar. Without this, the change in selection would be
   * easy to miss — the content sits below the layered zone. */
  const selectAudience = (a: Audience) => {
    setAudience(a);
    if (typeof window === 'undefined') return;
    if (tabBarRef.current) {
      const top = tabBarRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top - navClearance - 16, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full bg-[#F6F5F4]">

      {/* ============================================================
          LAYERED HERO ZONE (Frame 1)
          A 200vh-tall scroll budget for the hero crossfade. The
          hero is fixed-positioned inside; the tab bar + audience
          content sit just below this wrapper in natural flow, so
          they reach the viewport as the hero finishes fading.
          ============================================================ */}
      <div className="relative" style={{ minHeight: '200vh' }}>
        <div
          className="fixed inset-0 z-30 overflow-hidden"
          style={fixedLayerStyle(heroOpacity, heroTranslateY)}
        >
          <div
            className="relative h-full px-4 md:px-8 bg-[#F6F5F4] flex flex-col items-center justify-center overflow-hidden"
            style={{ paddingTop: `${navClearance + 48}px`, paddingBottom: '32px' }}
          >
            {/* Ambient brand-colored glows. */}
            <div
              className="pointer-events-none absolute -top-32 -left-24 w-[36rem] h-[36rem] rounded-full opacity-[0.16] blur-3xl"
              style={{ background: 'radial-gradient(circle, #17558E 0%, transparent 60%)' }}
            />
            <div
              className="pointer-events-none absolute -bottom-32 -right-24 w-[40rem] h-[40rem] rounded-full opacity-[0.12] blur-3xl"
              style={{ background: 'radial-gradient(circle, #4CB6C4 0%, transparent 60%)' }}
            />

            <div className="relative max-w-5xl mx-auto w-full text-center">
              <span className="block text-slate-400 text-xs md:text-sm font-semibold tracking-[0.3em] uppercase mb-4 md:mb-5">
                Work With Us
              </span>
              <h1 className="text-[#17558E] font-medium tracking-tight leading-[0.95]">
                <span className="block text-4xl md:text-5xl lg:text-6xl">
                  Three ways to
                </span>
                <span
                  className="block text-5xl md:text-7xl lg:text-[5.5rem] italic mt-1 md:mt-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  make an impact.
                </span>
              </h1>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed font-light max-w-2xl mx-auto mt-5 md:mt-6">
                Whether you're a student, a nonprofit, or a sponsor — there's a place for you in the work we do.
              </p>

              {/* Audience cards — clicking jumps to that tab. */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mt-10 md:mt-12 max-w-4xl mx-auto text-left">
                {AUDIENCES.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => selectAudience(a.key)}
                    className="group relative rounded-2xl bg-white border border-slate-200/80 hover:border-[#17558E]/50 hover:shadow-lg p-5 md:p-6 transition-all duration-300 text-left cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h3 className="text-[#17558E] text-xl md:text-2xl font-medium tracking-tight">
                        {a.label}
                      </h3>
                      <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-[#17558E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <p className="text-slate-500 text-sm font-light leading-relaxed">
                      {a.blurb}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          TAB BAR — sits at the top of Frame 2 in normal flow. Not
          sticky on purpose: the layered hero already gives users a
          dedicated "pick your audience" moment, so a tab bar that
          followed them down the page felt over-eager.
          ============================================================ */}
      <div ref={tabBarRef} className="px-4 md:px-8 pt-6 md:pt-8 pb-2">
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="inline-flex gap-1 p-1 rounded-full bg-white border border-slate-200/80 shadow-sm overflow-x-auto max-w-full">
            {AUDIENCES.map((a) => {
              const active = audience === a.key;
              return (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => setAudience(a.key)}
                  className={
                    'px-4 md:px-5 py-2 rounded-full text-sm md:text-[15px] font-medium transition-colors duration-200 whitespace-nowrap ' +
                    (active
                      ? 'bg-[#17558E] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#17558E]')
                  }
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================
          AUDIENCE CONTENT — the section selected by the tabs above.
          Renders in natural document flow.
          ============================================================ */}
      <section className="px-4 md:px-8 pt-2 md:pt-4 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto">
          {audience === 'students' && <StudentsSection />}
          {audience === 'nonprofits' && <NonprofitsSection />}
          {audience === 'sponsors' && <SponsorsSection />}
        </div>
      </section>
    </div>
  );
};

export default WorkWithUsPage;
