/* ------------------------------------------------------------------
 * Shared external URLs and contact info.
 *
 * Single source of truth — change the value here once and every page
 * picks it up. Don't inline these in components; importing keeps the
 * site easy to update when a URL changes.
 * ------------------------------------------------------------------ */

export const CONTACT_EMAIL = 'cornellhack4impact@gmail.com';

export const INSTAGRAM_URL = 'https://www.instagram.com/cornellhack4impact/';
export const LINKEDIN_URL = 'https://www.linkedin.com/company/hack4impact/';

/* General "give to the project" link used by the home-page Get
 * Involved card. Goes through Cornell's Imodules giving portal. */
export const DONATE_URL =
  'https://securelb.imodules.com/s/1717/giving/interior.aspx?sid=1717&gid=2&pgid=16421&cid=27217&dids=5430&sort=1&bledit=1';

/* Crowdfunding link surfaced on the Work With Us → Sponsors tab.
 * Currently shares the giving-portal URL above; if Hack4Impact ever
 * gets a dedicated crowdfunding page, point this at it instead. */
export const CROWDFUNDING_URL = DONATE_URL;

/* PDF in Drive — sent to prospective sponsors so they can review the
 * tier breakdown and benefits offline. */
export const SPONSORSHIP_PACKAGE_URL =
  'https://drive.google.com/file/d/1LprJT5eWDMf2LsYzmDajj5SYnhDiDNbS/view';

/* Notion page describing what each member role (developer, designer,
 * business) actually does day-to-day. */
export const ROLE_DETAILS_URL =
  'https://h4i.notion.site/Member-Position-Descriptions-2e22a21bd9e84403a36936876508d7ac';

/* H4I publication on Medium where the team writes long-form
 * project recaps. Linked from the Our Work page footer. */
export const MEDIUM_URL = 'https://medium.com/cornellh4i';
