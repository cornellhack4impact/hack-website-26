/* ------------------------------------------------------------------
 * TEAM ROSTER
 *
 * Each entry can have a headshot and a LinkedIn URL. Both are
 * optional — leave them off (or empty) and the card falls back to a
 * plain initials avatar with no LinkedIn icon.
 *
 *   image     → drop the file into /public/team/, then point at it
 *               with a leading slash, e.g. '/team/alisha.jpg'
 *   linkedin  → full profile URL, e.g. 'https://www.linkedin.com/in/alisha'
 *
 * Example:
 *   {
 *     name: 'Alisha Smith',
 *     role: 'Co-Director',
 *     image: '/team/alisha.jpg',
 *     linkedin: 'https://www.linkedin.com/in/alisha-smith',
 *   },
 * ------------------------------------------------------------------ */

export type TeamMember = {
  name: string;
  role: string;
  /** Path under /public, e.g. '/team/alisha.jpg'. Omit for initials avatar. */
  image?: string;
  /** Full LinkedIn profile URL. Omit to hide the LinkedIn icon. */
  linkedin?: string;
};

export type TeamCategory =
  | 'Eboard'
  | 'Developers'
  | 'Designers'
  | 'Business'
  | 'Alumni';

export const TEAM_CATEGORIES: TeamCategory[] = [
  'Eboard',
  'Developers',
  'Designers',
  'Business',
  'Alumni',
];

export const TEAM_DATA: Record<TeamCategory, TeamMember[]> = {
  Eboard: [
    { name: 'Aditya Vashistha', role: 'Faculty Advisor', image: '/team/aditya.jpg', linkedin: 'https://www.linkedin.com/in/aditya-vashistha-010101010101010101' },
    { name: 'Mohamed Kane', role: 'Co-Director' },
    { name: 'Justin Eburuoh', role: 'Co-Director', image: '/team/designers/justin.jpg', linkedin: 'https://www.linkedin.com/in/justin-eburuoh/' },
    { name: 'Leane Ying', role: 'Engineering Chair' },
    { name: 'Ashlie Zhang', role: 'Engineering Chair' },
    { name: 'Yuki Li', role: 'Design Lead' },
    { name: 'Brynn Li', role: 'Business Lead' },
    { name: 'Adya Uppal', role: 'Product Lead & PM' },
    { name: 'Krish Desai', role: 'Recruitment Lead' },
    { name: 'Nathnael Tesfaw', role: 'Maintenance Lead' },
    { name: 'Helen Qian', role: 'Community Lead & Tech Lead' },
    { name: 'Ayan Kohli', role: 'DEI Lead' },
    { name: 'Eric Yen', role: 'Community Lead' },
    { name: 'Jonathan Liang', role: 'NME Instructor' },
    { name: 'Arianna Hsu', role: 'NME Instructor & PM', image: '/team/designers/arianna.png', linkedin: 'https://www.linkedin.com/in/arianna-hsu/' },
    { name: 'Alisa Zhang', role: 'NME Instructor' },
    { name: 'Akhil Kagithapu', role: 'Tech Lead' },
    { name: 'Grace Matsuoka', role: 'Tech Lead' },
    { name: 'Katherine Hu', role: 'Tech Lead', image: '/team/developers/katherinehu.jpg', linkedin: 'https://www.linkedin.com/in/katherine-hu317/' },
    { name: 'Zoey Jin', role: 'Tech Lead' },
    { name: 'Brian Sa', role: 'PM' },
    { name: 'Jade Lee', role: 'Tech Lead' },
    { name: 'Jeremy Cortez', role: 'Tech Lead' },

  ],
  Developers: [
    { name: 'Leane Ying', role: 'Engineering Chair' },
    { name: 'Ashlie Zhang', role: 'Engineering Chair' },
    { name: 'Akhil Kagithapu', role: 'MedExplain Tech Lead' },
    { name: 'Helen Qian', role: 'MedExplain Tech Lead' },
    { name: 'Jade Lee', role: 'Dillmun Hill Tech Lead' },
    { name: 'Brian Sa', role: 'Dillmun Hill PM' },
    { name: 'Grace Matsuoka', role: 'PPAC Tech Lead' },
    { name: 'Katherine Hu', role: 'IMA Tech Lead', image: '/team/developers/katherinehu.jpg', linkedin: 'https://www.linkedin.com/in/katherine-hu317/' },
    { name: 'Zoey Jin', role: 'IMA Tech Lead' },
    { name: 'Jeremy Cortez', role: 'HVTP Tech Lead' },
    { name: 'Krish Desai', role: 'Developer', image: '/team/developers/krish.jpg', linkedin: 'https://www.linkedin.com/in/desaikrish/' },
    { name: 'Nathnael Tesfaw', role: 'Developer' },
    { name: 'Nathan Dang', role: 'Developer' },
    { name: 'Jonathan Liang', role: 'Developer' },
    { name: 'Samantha Cruz', role: 'Developer' },
    { name: 'Rohan Sahu', role: 'Developer', image: '/team/developers/rohansahu.jpg', linkedin: 'https://www.linkedin.com/in/rohan-sahu2006/' },
    { name: 'Eric Yen', role: 'Developer', image: '/team/developers/ericyen.jpg', linkedin: 'https://www.linkedin.com/in/eric-yen-/' },
    { name: 'Erik Mauricio', role: 'Developer', image: '/team/developers/erik.jpg', linkedin: 'https://www.linkedin.com/in/erikmauricio/' },
    { name: 'Sanika Sharma', role: 'Developer', image: '/team/developers/sanika.jpg', linkedin: 'https://www.linkedin.com/in/sanika-sharma-3651a5282/' },
    { name: 'Andrew Zhang', role: 'Developer', image: '/team/developers/andrew.jpg', linkedin: 'https://www.linkedin.com/in/andrew-zhang-b7b867390/' },
    { name: 'Olric Zeng', role: 'Developer', image: '/team/developers/olric.jpeg', linkedin: 'https://www.linkedin.com/in/olriczeng/' },
    { name: 'Ben Han', role: 'Developer', image: '/team/developers/benhan.png', linkedin: 'https://www.linkedin.com/in/benphans/' },
    { name: 'Oshin Rex', role: 'Developer', image: '/team/developers/oshin.png', linkedin: 'https://www.linkedin.com/in/oshin-rex-405b78266/' },
    { name: 'Nalini Agnihotri', role: 'Developer', image: '/team/developers/nalini.png', linkedin: 'https://www.linkedin.com/in/nalini-agnihotri/' },
    { name: 'Avery Yang', role: 'Developer', image: '/team/developers/avery.jpg', linkedin: 'https://www.linkedin.com/in/avery-s-yang/' },
    { name: 'Tanvi Mavani', role: 'Developer' },
    { name: 'Nicole Qiu', role: 'Developer' },
    { name: 'Claire Wang', role: 'Developer' },
    { name: 'Akul Maheshwari', role: 'Developer' },
    { name: 'Rohan Sedhain', role: 'Developer' },
    { name: 'David Valarezo', role: 'Developer' },
    { name: 'Alisha Varma', role: 'Developer' },
    { name: 'Tim Adeyemi', role: 'Developer' },
    { name: 'Srija Ghosh', role: 'Developer' },
    { name: 'Sanya Mahajan', role: 'Developer' },
    { name: 'Leon Huang', role: 'Developer' },
    { name: 'Fadi Ismail', role: 'Developer' },
    { name: 'Nihaal Konda', role: 'Developer' },
    { name: 'Victoria Yu', role: 'Developer' },
    { name: 'Sydney Chin', role: 'Developer' },
    { name: 'Chimdi Ejiogu', role: 'Developer' },
  ],
  Designers: [
    { name: 'Yuki Li', role: 'Design Lead', image: '/team/designers/yuki.JPG', linkedin: 'https://www.linkedin.com/in/yuki-li2027/' },
    { name: 'Jessica Andrews', role: 'Design Lead', image: '/team/alumni/jessica.png', linkedin: 'https://www.linkedin.com/in/jessica-andrews-a34842228/' },
    { name: 'Ting Fei', role: 'Designer', image: '/team/designers/ting.JPG', linkedin: 'https://www.linkedin.com/in/fei-ting/' },
    { name: 'Selena Chen', role: 'Designer', image: '/team/designers/selenachen.jpg', linkedin: 'https://www.linkedin.com/in/selenachen-/' },
    { name: 'Lauren Chin', role: 'Designer', image: '/team/designers/lauren.jpg', linkedin: 'https://www.linkedin.com/in/laurenechin/' },
    { name: 'Katelynn Han', role: 'Designer', image: '/team/designers/katelynn.JPG', linkedin: 'https://www.linkedin.com/in/katelynnhan/' },
    { name: 'Ethan Lee', role: 'Designer', image: '/team/designers/ethan.JPG', linkedin: 'https://www.linkedin.com/in/ethangrlee/'  },
    { name: 'Arianna Hsu', role: 'Designer', image: '/team/designers/arianna.png', linkedin: 'https://www.linkedin.com/in/arianna-hsu/' },
    { name: 'Jasmine Shi', role: 'Designer', image: '/team/designers/jasmine.png', linkedin: 'https://www.linkedin.com/in/jasmineshi1019/' },
    { name: 'Kate Xue', role: 'Designer', image: '/team/designers/kate.png', linkedin: 'https://www.linkedin.com/in/kate-xue/'  },
    { name: 'Maia Schleisger', role: 'Designer', image: '/team/designers/maia.jpg', linkedin: 'https://www.linkedin.com/in/maiasch/' },
    { name: 'Dhikshika Cherivirala', role: 'Designer', image: '/team/designers/dhikshika.jpg', linkedin: 'https://www.linkedin.com/in/dhikshika-cherivirala/' },
    { name: 'Shun Tanaka', role: 'Designer', image: '/team/designers/shun.jpg', linkedin: 'https://www.linkedin.com/in/shun-tanaka/' },
  ],
  Business: [
    { name: 'Brynn Li', role: 'Business Lead', image: '/team/business/brynn.jpg', linkedin: 'https://www.linkedin.com/in/brynn-li-223513292/'   },
    { name: 'Adya Uppal', role: 'Business Member' },
    { name: 'Ayan Kohli', role: 'Business Member', image: '/team/business/ayan.jpg', linkedin: 'https://www.linkedin.com/in/ayankohli/' },
    { name: 'Shreyaa Sanjay', role: 'Business Member' },
    { name: 'Enzo Hiu', role: 'Business Member', image: '/team/business/enzo.JPG', linkedin: 'https://www.linkedin.com/in/enzohiu/'  },
    { name: 'Alisa Zhang', role: 'Business Member' },
    { name: 'Karina Jagdeo', role: 'Business Member' },
    { name: 'Annika Shekdar', role: 'Business Member' },
    { name: 'Brittany Sun', role: 'Business Member', image: '/team/business/brittany.jpg', linkedin: 'https://www.linkedin.com/in/brittanys10/' },
    { name: 'Nicholas Channg', role: 'Business Member' },
    { name: 'Arshia Chakrabarti', role: 'Business Member', image: '/team/business/arshia.png', linkedin: 'https://www.linkedin.com/in/arshia-chakrabarti/' },
  ],
  Alumni: [
    { name: 'Sonia Appasamy', role: 'Co-Founder of H4I @CU' },
    { name: 'Fatima Al-Sammak', role: 'Co-Director' },
    { name: 'Connie Liu', role: 'Co-Director + Design Lead' },
    { name: 'Josh Feuerstein', role: 'Co-Director' },
    { name: 'JJ Bai', role: 'Co-Director' },
    { name: 'Melissa Chu', role: 'Co-Director' },
    { name: 'Afran Ahmed', role: 'Co-Director', image: '/team/alumni/afran.jpg', linkedin: 'https://www.linkedin.com/in/afranahmed/' },
    { name: 'Julia Papp', role: 'Engineering Chair' },
    { name: 'Bryant Lee', role: 'Engineering Chair' },
    { name: 'Jason Zheng', role: 'Engineering Chair' },
    { name: 'Brianna Liu', role: 'Engineering Chair' },
    { name: 'Jessica Cho', role: 'Engineering Chair' },
    { name: 'Arushi Aggarwal', role: 'DEI Lead', image: '/team/alumni/arushi.png', linkedin: 'https://www.linkedin.com/in/arushiagg/' },
    { name: 'Aiden Montesinos', role: 'Recruitment Lead' },
    { name: 'Joe Ugarte', role: 'Maintenance Lead' },
    { name: 'Tiffany Lee', role: 'Design Lead' },
    { name: 'Sonia Mar', role: 'Design Lead' },
    { name: 'Naomi Rufian', role: 'Design Lead' },
    { name: 'Mika Labadan', role: 'Design Lead' },
    { name: 'Jessica Andrews', role: 'Design Lead', image: '/team/alumni/jessica.png', linkedin: 'https://www.linkedin.com/in/jessica-andrews-a34842228/' },
    { name: 'Sophie Z Wang', role: 'Business Lead' },
    { name: 'John Joshua Bernardino', role: 'Business Lead' },
    { name: 'Selena Zheng', role: 'Technical Lead' },
    { name: 'Daniel Thorne', role: 'Technical Lead' },
    { name: 'Amy Wu', role: 'Technical Lead' },
    { name: 'Brandon Lerit', role: 'Technical Lead' },
    { name: 'Sneha Rajaraman', role: 'Technical Lead', image: '/team/alumni/sneha.png', linkedin: 'https://www.linkedin.com/in/sneha-rajaraman-4884b5253/' },
    { name: 'Owen Chen', role: 'Technical Lead' },
    { name: 'Tuni Le', role: 'Technical Lead' },
    { name: 'Eric Zhong', role: 'Developer' },
    { name: 'Luke Leh', role: 'Developer' },
    { name: 'Mohammad Islam', role: 'Developer' },
    { name: 'Hubert He', role: 'Developer' },
    { name: 'Nicole Fan', role: 'Developer' },
    { name: 'Phoebe Qian', role: 'Developer' },
    { name: 'Akhil Iyengar', role: 'Developer' },
    { name: 'Diego Marques', role: 'Developer' },
    { name: 'Katherine Chang', role: 'Designer' },
    { name: 'Ella Keen Allee', role: 'Designer' },
    { name: 'Nneoma Udoyeh', role: 'Business' },
  ],
};
