/* ------------------------------------------------------------------
 * PROJECTS
 *
 * Each entry powers a card on the Our Work page.
 *
 *   name        → display name (also used as the image-fallback label
 *                 while the artwork is being prepared)
 *   semester    → e.g. 'Spring 2025' / 'Fall 2024'
 *   description → 1–3 sentences: partner, problem, solution, impact
 *   image       → drop file into /public/projects/, then point at it
 *                 with a leading slash, e.g. '/projects/lfbi.png'.
 *                 If the file is missing the card shows the project
 *                 name on a soft brand-colored gradient instead.
 *   tags        → optional pill labels (focus area, tech stack)
 *   link        → optional URL to a write-up or live site
 *   status      → 'active' for current cycle, 'past' for completed
 * ------------------------------------------------------------------ */

export type ProjectStatus = 'active' | 'past';

export type Project = {
  name: string;
  semester: string;
  description: string;
  image?: string;
  tags?: string[];
  link?: string;
  status: ProjectStatus;
};

export const PROJECTS: Project[] = [
  {
    name: 'PPAC',
    semester: 'Spring 2025',
    description:
      'Partnering with PPAC to build digital tools that help them organize campaigns, coordinate volunteers, and amplify their advocacy work.',
    image: '/projects/ppac.png',
    status: 'active',
  },
  {
    name: 'MedExplain',
    semester: 'Spring 2025',
    description:
      'A platform that translates complex medical information into plain language so patients can understand their care and advocate for themselves.',
    image: '/projects/medexplain.png',
    link: 'https://medium.com/cornellh4i/medexplain-health-simplifying-content-management-for-health-equity-79939cb8ce39',
    status: 'active',
  },
  {
    name: 'GreenZone',
    semester: 'Spring 2025',
    description:
      'Building software with our partner to support environmental advocacy, community organizing, and the reporting that drives accountable action.',
    image: '/projects/greenzone.png',
    link: 'https://medium.com/cornellh4i/greenzone-empowering-data-informed-mongolian-rangeland-decisions-02a44aa6c51e',
    status: 'active',
  },
  {
    name: 'HVTP',
    semester: 'Spring 2025',
    description:
      'Working with the Hudson Valley Textile Project to expand their reach, serve more participants, and measure long-term impact.',
    image: '/projects/hvtp.png',
    status: 'active',
  },
  {
    name: 'Lagos Food Bank Initiative',
    semester: 'Fall 2024',
    description:
      'We empowered Lagos Food Bank to serve over 2,000,000 beneficiaries by streamlining their operations. Our system simplified volunteer sign-ups and provided comprehensive tools for tracking events and the work of 24,000+ volunteers.',
    image: '/projects/lagos.png',
    link: 'https://medium.com/cornellh4i/transforming-lagos-food-bank-initiatives-approach-to-volunteer-management-e81315148752',
    status: 'past',
  },
];
