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
  /** CSS object-position for headshot cropping, e.g. 'center top'. */
  imagePosition?: string;
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
    { name: 'Aditya Vashistha', role: 'Faculty Advisor', image: '/team/aditya.jpg', linkedin: 'https://www.linkedin.com/in/adityavashistha/' },
    { name: 'Justin Eburuoh', role: 'Co-Director', image: '/team/designers/justin.jpg', linkedin: 'https://www.linkedin.com/in/justin-eburuoh/' },
    { name: 'Tim Adeyemi', role: 'Co-Director', image: '/team/developers/tim.jpg', linkedin: 'https://www.linkedin.com/in/timade/' },
    { name: 'Nicole Qiu', role: 'Engineering Chair', image: '/team/developers/nicole.png', linkedin: 'https://www.linkedin.com/in/nicoleqiu/' },
    { name: 'Jeremy Cortez', role: 'Engineering Chair', image: '/team/developers/jeremy.jpg', linkedin: 'https://www.linkedin.com/in/jeremy-cortez-435a702aa/', imagePosition: 'center top' },
    { name: 'Brian Sa', role: 'Design Lead', image: '/team/designers/brian.jpeg', linkedin: 'https://www.linkedin.com/in/brian-sa-661aa62a1/' },
    { name: 'Arianna Hsu', role: 'Design Lead', image: '/team/designers/arianna.png', linkedin: 'https://www.linkedin.com/in/arianna-hsu/' },
    { name: 'Arshia Chakrabarti', role: 'Business Lead', image: '/team/business/arshia.png', linkedin: 'https://www.linkedin.com/in/arshia-chakrabarti/' },
    { name: 'Tanvi Mavani', role: 'Product Lead', image: '/team/developers/tanvi.png', linkedin: 'https://www.linkedin.com/in/tanvimavani/' },
    { name: 'Adya Uppal', role: 'PM', image: '/team/business/adya.png', linkedin: 'https://www.linkedin.com/in/adya-uppal/', imagePosition: 'center top' },
    { name: 'Maia Schlesiger', role: 'PM', image: '/team/designers/maia.jpg', linkedin: 'https://www.linkedin.com/in/maiasch/' },
    { name: 'Selena Chen', role: 'PM', image: '/team/designers/selenachen.jpg', linkedin: 'https://www.linkedin.com/in/selenachen-/', imagePosition: 'center top' },
    { name: 'Surabhi Shastry', role: 'Associate PM', image: '/team/business/surabhi.png', linkedin: 'https://www.linkedin.com/in/surabhi-shastry-3063b1231/' },
    { name: 'Krish Pai', role: 'Associate PM', image: '/team/business/krish.jpeg', linkedin: 'https://www.linkedin.com/in/krish-pai/' },
    { name: 'Katherine Hu', role: 'Tech Lead', image: '/team/developers/katherinehu.jpeg', linkedin: 'https://www.linkedin.com/in/katherine-hu317/' },
    { name: 'Zoey Jin', role: 'Tech Lead', image: '/team/developers/zoey.png', linkedin: 'https://www.linkedin.com/in/zoey-jin/' },
    { name: 'Akhil Kagithapu', role: 'Tech Lead', image: '/team/developers/akhil.jpg', linkedin: 'https://www.linkedin.com/in/akhil-kagithapu/' },
    { name: 'Ayan Kohli', role: 'Tech Lead', image: '/team/developers/ayan.jpg', linkedin: 'https://www.linkedin.com/in/ayankohli/' },
    { name: 'Grace Matsuoka', role: 'Tech Lead', image: '/team/developers/grace.jpg', linkedin: 'https://www.linkedin.com/in/grace-matsuoka/', imagePosition: 'center top' },
    { name: 'Jade Lee', role: 'Tech Lead', image: '/team/developers/jadelee.png', linkedin: 'https://www.linkedin.com/in/ysjade-lee/' },
    { name: 'Sydney Chin', role: 'PM & Tech Lead', image: '/team/developers/sydney.jpeg', linkedin: 'https://www.linkedin.com/in/sydney-chin/' },
    { name: 'Helen Qian', role: 'PM & Tech Lead', image: '/team/developers/helen.jpeg', linkedin: 'https://www.linkedin.com/in/helen-q-3243b9151/' },
    { name: 'Dhikshika Cherivirala', role: 'Design NME', image: '/team/designers/dhikshika.jpg', linkedin: 'https://www.linkedin.com/in/dhikshika-cherivirala/' },
    { name: 'Lauren Chin', role: 'Design NME', image: '/team/designers/lauren.jpg', linkedin: 'https://www.linkedin.com/in/laurenechin/', imagePosition: 'center top' },
    { name: 'Andrew Zhang', role: 'External Relations', image: '/team/developers/andrew.jpg', linkedin: 'https://www.linkedin.com/in/andrew-zhang-b7b867390/' },
    { name: 'Nathnael Tesfaw', role: 'Maintenance Lead', image: '/team/developers/nathnael.jpeg', linkedin: 'https://www.linkedin.com/in/nathnael-tesfaw/' },
    { name: 'Claire Wang', role: 'Recruitment Lead', image: '/team/developers/claire.jpg', linkedin: 'https://www.linkedin.com/in/claire-wang-173236245/' },
    { name: 'Eric Yen', role: 'Community Lead', image: '/team/developers/ericyen.jpg', linkedin: 'https://www.linkedin.com/in/eric-yen-/' },
    { name: 'Kate Xue', role: 'DEI Lead', image: '/team/designers/kate.jpeg', linkedin: 'https://www.linkedin.com/in/kate-xue/' },
    { name: 'Brittany Sun', role: 'DEI Lead', image: '/team/business/brittany.jpg', linkedin: 'https://www.linkedin.com/in/brittanys10/', imagePosition: 'center top' },
  ],
  Developers: [
    { name: 'Nicole Qiu', role: 'Engineering Chair', image: '/team/developers/nicole.png', linkedin: 'https://www.linkedin.com/in/nicoleqiu/' },
    { name: 'Jeremy Cortez', role: 'Engineering Chair', image: '/team/developers/jeremy.jpg', linkedin: 'https://www.linkedin.com/in/jeremy-cortez-435a702aa/', imagePosition: 'center top' },
    { name: 'Tanvi Mavani', role: 'Product Lead', image: '/team/developers/tanvi.png', linkedin: 'https://www.linkedin.com/in/tanvimavani/' },
    { name: 'Katherine Hu', role: 'Tech Lead', image: '/team/developers/katherinehu.jpeg', linkedin: 'https://www.linkedin.com/in/katherine-hu317/' },
    { name: 'Zoey Jin', role: 'Tech Lead', image: '/team/developers/zoey.png', linkedin: 'https://www.linkedin.com/in/zoey-jin/' },
    { name: 'Akhil Kagithapu', role: 'Tech Lead', image: '/team/developers/akhil.jpg', linkedin: 'https://www.linkedin.com/in/akhil-kagithapu/' },
    { name: 'Ayan Kohli', role: 'Tech Lead', image: '/team/developers/ayan.jpg', linkedin: 'https://www.linkedin.com/in/ayankohli/' },
    { name: 'Grace Matsuoka', role: 'Tech Lead', image: '/team/developers/grace.jpg', linkedin: 'https://www.linkedin.com/in/grace-matsuoka/', imagePosition: 'center top' },
    { name: 'Jade Lee', role: 'Tech Lead', image: '/team/developers/jadelee.png', linkedin: 'https://www.linkedin.com/in/ysjade-lee/' },
    { name: 'Sydney Chin', role: 'PM & Tech Lead', image: '/team/developers/sydney.jpeg', linkedin: 'https://www.linkedin.com/in/sydney-chin/' },
    { name: 'Helen Qian', role: 'PM & Tech Lead', image: '/team/developers/helen.jpeg', linkedin: 'https://www.linkedin.com/in/helen-q-3243b9151/' },
    { name: 'Andrew Zhang', role: 'External Relations', image: '/team/developers/andrew.jpg', linkedin: 'https://www.linkedin.com/in/andrew-zhang-b7b867390/' },
    { name: 'Nathnael Tesfaw', role: 'Maintenance Lead', image: '/team/developers/nathnael.jpeg', linkedin: 'https://www.linkedin.com/in/nathnael-tesfaw/' },
    { name: 'Claire Wang', role: 'Recruitment Lead', image: '/team/developers/claire.jpg', linkedin: 'https://www.linkedin.com/in/claire-wang-173236245/' },
    { name: 'Eric Yen', role: 'Community Lead', image: '/team/developers/ericyen.jpg', linkedin: 'https://www.linkedin.com/in/eric-yen-/' },
    { name: 'Krish Desai', role: 'Developer', image: '/team/developers/krish.jpg', linkedin: 'https://www.linkedin.com/in/desaikrish/' },
    { name: 'Nathan Dang', role: 'Developer', image: '/team/developers/nathan.jpg', linkedin: 'https://www.linkedin.com/in/nhatanh-dang/' },
    { name: 'Jonathan Liang', role: 'Developer', image: '/team/developers/jonathan.jpg', linkedin: 'https://www.linkedin.com/in/jonathan-liang11/' },
    { name: 'Samantha Cruz', role: 'Developer', image: '/team/developers/samantha.jpg', linkedin: 'https://www.linkedin.com/in/samanthajcruz/' },
    { name: 'Rohan Sahu', role: 'Developer', image: '/team/developers/rohansahu.jpg', linkedin: 'https://www.linkedin.com/in/rohan-sahu2006/' },
    { name: 'Carl Hu', role: 'Developer', image: '/team/developers/carl.jpg', linkedin: 'https://www.linkedin.com/in/carl-hu/' },
    { name: 'Erik Mauricio', role: 'Developer', image: '/team/developers/erik.jpg', linkedin: 'https://www.linkedin.com/in/erikmauricio/' },
    { name: 'Sanika Sharma', role: 'Developer', image: '/team/developers/sanika.jpg', linkedin: 'https://www.linkedin.com/in/sanika-sharma-3651a5282/' },
    { name: 'Olric Zeng', role: 'Developer', image: '/team/developers/olric.jpeg', linkedin: 'https://www.linkedin.com/in/olriczeng/' },
    { name: 'Ben Han', role: 'Developer', image: '/team/developers/benhan.png', linkedin: 'https://www.linkedin.com/in/benphans/' },
    { name: 'Oshin Rex', role: 'Developer', image: '/team/developers/oshin.png', linkedin: 'https://www.linkedin.com/in/oshin-rex-405b78266/' },
    { name: 'Nalini Agnihotri', role: 'Developer', image: '/team/developers/nalini.png', linkedin: 'https://www.linkedin.com/in/nalini-agnihotri/' },
    { name: 'Avery Yang', role: 'Developer', image: '/team/developers/avery.jpg', linkedin: 'https://www.linkedin.com/in/avery-s-yang/' },
    { name: 'Akul Maheshwari', role: 'Developer', image: '/team/developers/akul.jpg', linkedin: 'https://www.linkedin.com/in/akul-maheshwari/' },
    { name: 'Rohan Sedhain', role: 'Developer', image: '/team/developers/rohan.jpg', linkedin: 'https://www.linkedin.com/in/rsedhain1/' },
    { name: 'David Valarezo', role: 'Developer', image: '/team/developers/david.jpg', linkedin: 'https://www.linkedin.com/in/davidvalarezo/' },
    { name: 'Alisha Varma', role: 'Developer', image: '/team/developers/alisha.jpg', linkedin: 'https://www.linkedin.com/in/alishav1/' },
    { name: 'Srija Ghosh', role: 'Developer', image: '/team/developers/srija.png', linkedin: 'https://www.linkedin.com/in/srija-ghosh-1a703b1a8/' },
    { name: 'Sanya Mahajan', role: 'Developer', image: '/team/developers/sanya.jpg', linkedin: 'https://www.linkedin.com/in/sanyamahajan2027/' },
    { name: 'Leon Huang', role: 'Developer', image: '/team/developers/leon.jpg', linkedin: 'https://www.linkedin.com/in/lyh7/' },
    { name: 'Fadi Ismail', role: 'Developer', image: '/team/developers/fadi.jpg', linkedin: 'https://www.linkedin.com/in/fadimismail/' },
    { name: 'Nihaal Konda', role: 'Developer', image: '/team/developers/nihaal.jpg', linkedin: 'https://www.linkedin.com/in/nihaalkonda/' },
    { name: 'Victoria Yu', role: 'Developer', image: '/team/developers/victoria.jpg', linkedin: 'https://www.linkedin.com/in/nihaalkonda/' },
    { name: 'Chimdi Ejiogu', role: 'Developer', image: '/team/developers/chimdi.jpg', linkedin: 'https://www.linkedin.com/in/chimdi-ejiogu/' },
    { name: 'Ashlie Zhang', role: 'Developer', image: '/team/developers/ashlie.png', linkedin: 'https://www.linkedin.com/in/ashlie-zhang/' },
    { name: 'Will Nzeuton', role: 'Developer', image: '/team/developers/will.png', linkedin: 'https://www.linkedin.com/in/will-nzeuton/', imagePosition: 'center top' },
    { name: 'Audrey Dequito', role: 'Developer', image: '/team/developers/audrey.png', linkedin: 'https://www.linkedin.com/in/audrey-dequito/' },
    { name: 'Hasset Daniel', role: 'Developer', image: '/team/developers/hasset.jpeg', linkedin: 'https://www.linkedin.com/in/hassetdaniel/' },
    { name: 'Hannah Jacob', role: 'Developer', image: '/team/developers/hannah.PNG', linkedin: 'https://www.linkedin.com/in/hannahtjacob/' },
    { name: 'Sheki Okwayo', role: 'Developer', image: '/team/developers/sheki.JPG', linkedin: 'https://www.linkedin.com/in/sheki-okwayo/' },
    { name: 'Kashish Balan', role: 'Developer', image: '/team/developers/kashish.jpeg', linkedin: 'https://www.linkedin.com/in/kashishbalan/' },
    { name: 'Shreyaa Sanjay', role: 'Developer', image: '/team/developers/shreyaa.png', linkedin: 'https://www.linkedin.com/in/shreyaa-sanjay-3166b2275/' },
    { name: 'Maxwell Li', role: 'Developer', image: '/team/developers/maxwell.jpeg', linkedin: 'https://www.linkedin.com/in/maxwell-kaiyang-li/' },
  ],
  Designers: [
    { name: 'Brian Sa', role: 'Design Lead', image: '/team/designers/brian.jpeg', linkedin: 'https://www.linkedin.com/in/brian-sa-661aa62a1/' },
    { name: 'Arianna Hsu', role: 'Design Lead', image: '/team/designers/arianna.png', linkedin: 'https://www.linkedin.com/in/arianna-hsu/' },
    { name: 'Dhikshika Cherivirala', role: 'Design NME', image: '/team/designers/dhikshika.jpg', linkedin: 'https://www.linkedin.com/in/dhikshika-cherivirala/' },
    { name: 'Lauren Chin', role: 'Design NME', image: '/team/designers/lauren.jpg', linkedin: 'https://www.linkedin.com/in/laurenechin/', imagePosition: 'center top' },
    { name: 'Maia Schlesiger', role: 'PM', image: '/team/designers/maia.jpg', linkedin: 'https://www.linkedin.com/in/maiasch/' },
    { name: 'Selena Chen', role: 'PM', image: '/team/designers/selenachen.jpg', linkedin: 'https://www.linkedin.com/in/selenachen-/', imagePosition: 'center top' },
    { name: 'Kate Xue', role: 'DEI Lead', image: '/team/designers/kate.jpeg', linkedin: 'https://www.linkedin.com/in/kate-xue/' },
    { name: 'Yuki Li', role: 'Designer', image: '/team/designers/yuki.JPG', linkedin: 'https://www.linkedin.com/in/yuki-li2027/' },
    { name: 'Ting Fei', role: 'Designer', image: '/team/designers/ting.JPG', linkedin: 'https://www.linkedin.com/in/fei-ting/' },
    { name: 'Katelynn Han', role: 'Designer', image: '/team/designers/katelynn.JPG', linkedin: 'https://www.linkedin.com/in/katelynnhan/' },
    { name: 'Ethan Lee', role: 'Designer', image: '/team/designers/ethan.JPG', linkedin: 'https://www.linkedin.com/in/ethangrlee/' },
    { name: 'Jasmine Shi', role: 'Designer', image: '/team/designers/jasmine.png', linkedin: 'https://www.linkedin.com/in/jasmineshi1019/' },
    { name: 'Shun Tanaka', role: 'Designer', image: '/team/designers/shun.jpg', linkedin: 'https://www.linkedin.com/in/shun-tanaka/' },
    { name: 'Sophia Zhen', role: 'Designer', image: '/team/designers/sophia.jpeg', linkedin: 'https://www.linkedin.com/in/sophia-zhen-b78a98338/' },
    { name: 'Jenny Kim', role: 'Designer', image: '/team/designers/jenny.jpeg', linkedin: 'https://www.linkedin.com/in/jenny-e-kim/' },
  ],
  Business: [
    { name: 'Arshia Chakrabarti', role: 'Business Lead', image: '/team/business/arshia.png', linkedin: 'https://www.linkedin.com/in/arshia-chakrabarti/' },
    { name: 'Adya Uppal', role: 'PM', image: '/team/business/adya.png', linkedin: 'https://www.linkedin.com/in/adya-uppal/', imagePosition: 'center top' },
    { name: 'Surabhi Shastry', role: 'Associate PM', image: '/team/business/surabhi.png', linkedin: 'https://www.linkedin.com/in/surabhi-shastry-3063b1231/' },
    { name: 'Krish Pai', role: 'Associate PM', image: '/team/business/krish.jpeg', linkedin: 'https://www.linkedin.com/in/krish-pai/' },
    { name: 'Brittany Sun', role: 'DEI Lead', image: '/team/business/brittany.jpg', linkedin: 'https://www.linkedin.com/in/brittanys10/', imagePosition: 'center top' },
    { name: 'Brynn Li', role: 'Business Member', image: '/team/business/brynn.jpg', linkedin: 'https://www.linkedin.com/in/brynn-li-223513292/' },
    { name: 'Enzo Hiu', role: 'Business Member', image: '/team/business/enzo.JPG', linkedin: 'https://www.linkedin.com/in/enzohiu/' },
    { name: 'Alisa Zhang', role: 'Business Member', image: '/team/business/alisa.jpg', linkedin: 'https://www.linkedin.com/in/alisazhanggg/', imagePosition: 'center top' },
    { name: 'Karina Jagdeo', role: 'Business Member', image: '/team/business/karina.png', linkedin: 'https://www.linkedin.com/in/karina-jagdeo/' },
    { name: 'Priya Gokhale', role: 'Business Member', image: '/team/business/priya.jpeg', linkedin: 'https://www.linkedin.com/in/priyagokhale06/' },
    { name: 'Nicholas Channg', role: 'Business Member', image: '/team/business/nick.jpg', linkedin: 'https://www.linkedin.com/in/nickchanng/' },
  ],
  Alumni: [
    { name: 'Sonia Appasamy', role: 'Co-Founder of H4I @CU', image: '/team/alumni/sonia.jpg', linkedin: 'https://www.linkedin.com/in/soniaappasamy/' },
    { name: 'Fatima Al-Sammak', role: 'Co-Director', image: '/team/alumni/fatima.jpg', linkedin: 'https://www.linkedin.com/in/fatima-alsammak-285ab822b/' },
    { name: 'Connie Liu', role: 'Co-Director + Design Lead', image: '/team/alumni/connie.png', linkedin: 'https://www.linkedin.com/in/connieliu23/' },
    { name: 'Josh Feuerstein', role: 'Co-Director', image: '/team/alumni/joshua.jpg', linkedin: 'https://www.linkedin.com/in/joshua-feuerstein/' },
    { name: 'JJ Bai', role: 'Co-Director', image: '/team/alumni/jj.jpg', linkedin: 'https://www.linkedin.com/in/jiayi-bai-4a33a5220/' },
    { name: 'Melissa Chu', role: 'Co-Director', image: '/team/alumni/melissa.jpg', linkedin: 'https://www.linkedin.com/in/melissa-chu-096151222/' },
    { name: 'Afran Ahmed', role: 'Co-Director', image: '/team/alumni/afran.jpg', linkedin: 'https://www.linkedin.com/in/afranahmed/' },
    { name: 'Mohamed Kane', role: 'Co-Director', image: '/team/alumni/mohamed.png', linkedin: 'https://www.linkedin.com/in/melimanekane/' },
    { name: 'Julia Papp', role: 'Engineering Chair', image: '/team/alumni/julia.jpg', linkedin: 'https://www.linkedin.com/in/julia-papp/' },
    { name: 'Bryant Lee', role: 'Engineering Chair', image: '/team/alumni/bryant.jpg', linkedin: 'https://www.linkedin.com/in/bryantleee/' },
    { name: 'Jason Zheng', role: 'Engineering Chair', image: '/team/alumni/jason.jpg', linkedin: 'https://www.linkedin.com/in/jason-zheng-07a4a5223/' },
    { name: 'Brianna Liu', role: 'Engineering Chair', image: '/team/alumni/brianna.jpg', linkedin: 'https://www.linkedin.com/in/liu-brianna/' },
    { name: 'Jessica Cho', role: 'Engineering Chair', image: '/team/alumni/jessica.jpg', linkedin: 'https://www.linkedin.com/in/jessicajcho/' },
    { name: 'Leane Ying', role: 'Engineering Chair', image: '/team/alumni/leane.jpg', linkedin: 'https://www.linkedin.com/in/leane-ying-792a63210/' },
    { name: 'Arushi Aggarwal', role: 'DEI Lead', image: '/team/alumni/arushi.png', linkedin: 'https://www.linkedin.com/in/arushiagg/' },
    { name: 'Aiden Montesinos', role: 'Recruitment Lead', image: '/team/alumni/aiden.jpg', linkedin: 'https://www.linkedin.com/in/aidenmontesinos/' },
    { name: 'Joe Ugarte', role: 'Maintenance Lead', image: '/team/alumni/joe.jpg', linkedin: 'https://www.linkedin.com/in/joseph-ugarte/' },
    { name: 'Tiffany Lee', role: 'Design Lead', image: '/team/alumni/tiffany.jpg', linkedin: 'https://www.linkedin.com/in/tiffany-lee-design/' },
    { name: 'Sonia Mar', role: 'Design Lead', image: '/team/alumni/soniamar.jpg', linkedin: 'https://www.linkedin.com/in/mar-sonia116/' },
    { name: 'Naomi Rufian', role: 'Design Lead', image: '/team/alumni/naomi.jpg', linkedin: 'https://www.linkedin.com/in/naomi-rufian/' },
    { name: 'Mika Labadan', role: 'Design Lead', image: '/team/alumni/mika.jpg', linkedin: 'https://www.linkedin.com/in/mika-labadan/' },
    { name: 'Jessica Andrews', role: 'Design Lead', image: '/team/alumni/jessica.png', linkedin: 'https://www.linkedin.com/in/jessica-andrews-a34842228/' },
    { name: 'Sophie Z Wang', role: 'Business Lead', image: '/team/alumni/sophie_z_wang.jpg', linkedin: 'https://www.linkedin.com/in/swang235/' },
    { name: 'Sophie L Wang', role: 'Alumni', image: '/team/alumni/sophie.jpg', linkedin: 'https://www.linkedin.com/in/sophie-wang-1a12241a7/' },
    { name: 'John Joshua Bernardino', role: 'Business Lead', image: '/team/alumni/john.jpg', linkedin: 'https://www.linkedin.com/in/john-joshua-bernardino/' },
    { name: 'Selena Zheng', role: 'Technical Lead', image: '/team/alumni/selena.jpg', linkedin: 'https://www.linkedin.com/in/sese-zheng/' },
    { name: 'Daniel Thorne', role: 'Technical Lead', image: '/team/alumni/daniel.png', linkedin: 'https://www.linkedin.com/in/thorne-daniel/' },
    { name: 'Amy Wu', role: 'Technical Lead', image: '/team/alumni/amy.jpg', linkedin: 'https://www.linkedin.com/in/-amywu/' },
    { name: 'Brandon Lerit', role: 'Technical Lead', image: '/team/alumni/brandon.jpg', linkedin: 'https://www.linkedin.com/in/brandonlerit/' },
    { name: 'Sneha Rajaraman', role: 'Technical Lead', image: '/team/alumni/sneha.png', linkedin: 'https://www.linkedin.com/in/sneha-rajaraman-4884b5253/' },
    { name: 'Owen Chen', role: 'Technical Lead', image: '/team/alumni/owen.jpg', linkedin: 'https://www.linkedin.com/in/owen-j-chen/' },
    { name: 'Tuni Le', role: 'Technical Lead', image: '/team/alumni/tuni.png', linkedin: 'https://www.linkedin.com/in/tunile943/' },
    { name: 'Eric Zhong', role: 'Developer', image: '/team/alumni/ericzhong.jpg', linkedin: 'https://www.linkedin.com/in/ericzhong1/' },
    { name: 'Luke Leh', role: 'Developer', image: '/team/alumni/luke.png', linkedin: 'https://www.linkedin.com/in/lukeleh/' },
    { name: 'Mohammad Islam', role: 'Developer', image: '/team/alumni/mohammed.jpg', linkedin: 'https://www.linkedin.com/in/mohammadaislam/' },
    { name: 'Hubert He', role: 'Developer', image: '/team/alumni/hubert.jpg', linkedin: 'https://www.linkedin.com/in/huberthe/' },
    { name: 'Nicole Fan', role: 'Developer', image: '/team/alumni/nicolefan.jpg', linkedin: 'https://www.linkedin.com/in/nicole-fan/' },
    { name: 'Phoebe Qian', role: 'Developer', image: '/team/alumni/phoebe.jpg', linkedin: 'https://www.linkedin.com/in/phoebe-qian/' },
    { name: 'Akhil Iyengar', role: 'Developer', image: '/team/alumni/akhiliyengar.png', linkedin: 'https://www.linkedin.com/in/akhiliyengar/' },
    { name: 'Diego Marques', role: 'Developer', image: '/team/alumni/diegomarques.jpg', linkedin: 'https://www.linkedin.com/in/dmarques/' },
    { name: 'Katherine Chang', role: 'Designer', image: '/team/alumni/katherinechang.jpg', linkedin: 'https://www.linkedin.com/in/katjch/' },
    { name: 'Ella Keen Allee', role: 'Designer', image: '/team/alumni/ellakeen.jpg', linkedin: 'https://www.linkedin.com/in/ella-keen-allee/' },
    { name: 'Nneoma Udoyeh', role: 'Business', image: '/team/alumni/Nneoma.png', linkedin: 'https://www.linkedin.com/in/nneoma-udoyeh-831260215/' },
  ],
};
