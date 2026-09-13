/* ------------------------------------------------------------------
 * PARTNER ORGANIZATIONS
 *
 * The nonprofits we've built software for. Surfaced on the Our Work
 * page as a constellation of circular chips.
 *
 *   name → display name; also used as the chip's text fallback
 *          (initials) until a logo file is added
 *   logo → optional filename inside /public/partners/, e.g. 'lfbi.png'
 *          (omit while artwork is being prepared — chip just shows
 *          the initials on a soft brand-colored background)
 * ------------------------------------------------------------------ */

export type Partner = {
  name: string;
  logo?: string;
  /** Tailwind padding class for the logo inside the chip. Defaults
   *  to 'p-2'. Bump to 'p-3' or 'p-4' when a logo visually fills too
   *  much of the circle (e.g. a logo with very little built-in
   *  whitespace). */
  padding?: string;
};

export const PARTNERS: Partner[] = [
  { name: 'Lagos Food Bank Initiative', logo: 'lagos.jpg' },
  { name: 'MedExplain', logo: 'medexplain.jpg' },
  { name: 'MedSim', logo: 'medsim.png' },
  { name: 'EDGI', logo: 'edgi.jpg' },
  { name: 'WASH', logo: 'wash.jpg' },
  { name: 'OKB', logo: 'okb.jpg' },
  { name: 'Eco', logo: 'Eco.svg' },
  { name: 'PPAC', logo: 'ppac.png' },
  { name: 'Hudson Valley Textile Project', logo: 'hvtp.jpg', padding: 'p-3.5' },
  { name: "Anabel's Grocery", logo: 'anabels.png' },
  { name: 'Earth Law Center', logo: 'earthlaw.png' },
  { name: 'Ithaca Community', logo: 'ithaca.png' },
  { name: 'Rethink', logo: 'rethink.png' },
];
