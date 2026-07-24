// Mock data for all landing page sections

export const STATS = [
  { id: 1, value: 18000000, prefix: "£", suffix: "M+", label: "Raised Since 2010", icon: "volunteer_activism" },
  { id: 2, value: 120000, suffix: "K+", label: "Global Donors", icon: "people" },
  { id: 3, value: 350, suffix: "+", label: "Active Projects", icon: "rocket_launch" },
  { id: 4, value: 18, suffix: "", label: "Countries Served", icon: "public" },
];

const commonLongDescription = `
### The Crisis
Families have fled their homes with nothing, now living in makeshift shelters exposed to harsh weather without access to clean water, food, or medical care.

### Our Response
Our field teams are working around the clock to deliver life-saving aid. We are distributing relief packs, setting up mobile clinics, and providing clean drinking water.

### How Your Donation Helps
- **£50** provides an emergency food parcel for a month.
- **£100** supplies clean drinking water for a week.
- **£250** funds a mobile medical unit to treat 50 patients daily.
`;

export const CAMPAIGNS = [
  {
    id: 1,
    title: "Gaza Emergency Medical Aid",
    category: "Emergency",
    description: "Providing life-saving medicine and emergency surgeries to displaced families across the region.",
    longDescription: `
### The Crisis
Hospitals are overwhelmed and out of supplies. Thousands of displaced individuals, primarily women and children, lack access to immediate medical care and trauma treatment.

### Our Response
We have established 3 mobile field clinics treating over 500 patients daily, distributing emergency trauma relief packs in the hardest-hit zones.

### How Your Donation Helps
- **£50** provides essential trauma medicine for 5 patients.
- **£100** supplies a family with a hygiene and food parcel.
- **£250** funds a mobile medical unit to treat 50 patients daily.
`,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    documents: [
      { id: 1, title: "Official Project Proposal (PDF)", size: "4.2 MB", url: "/mock-proposal.pdf" },
      { id: 2, title: "Medical Supply List (PDF)", size: "1.1 MB", url: "#" }
    ],
    raised: 84500,
    goal: 112000,
    donors: 2847,
    daysLeft: 4,
    image: "https://loremflickr.com/800/500/humanitarian,medical/all",
    urgent: true,
    badge: "Emergency",
    badgeColor: "emergency",
  },
  {
    id: 2,
    title: "Community Water Well Projects",
    category: "Water",
    description: "Building sustainable water sources for villages in drought-prone areas of Africa.",
    longDescription: `
### The Crisis
Over 2 billion people lack access to safely managed drinking water. In remote villages, women and children walk up to 6km daily to fetch contaminated water, risking deadly diseases.

### Our Response
We build deep, solar-powered water wells that serve entire villages. We train local water committees to maintain them, ensuring reliable clean water for decades.

### How Your Donation Helps
- **£30** provides a family with clean water for a year.
- **£150** funds the installation of a local community hand pump.
- **£2,500** builds a complete deep water well serving 1,000 people.
`,
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    documents: [
      { id: 1, title: "WASH Impact Report 2024", size: "4.8 MB", url: "#" },
      { id: 2, title: "Technical Well Proposal", size: "3.2 MB", url: "#" }
    ],
    raised: 12300,
    goal: 29000,
    donors: 631,
    daysLeft: 21,
    image: "https://loremflickr.com/800/500/water,well,africa/all",
    urgent: false,
    badge: "Sustainability",
    badgeColor: "primary",
  },
  {
    id: 3,
    title: "Sponsor a Child's Education",
    category: "Education",
    description: "Provide monthly food, education, and healthcare to an orphan in need.",
    longDescription: commonLongDescription,
    videoUrl: null,
    documents: [
      { id: 1, title: "Sponsorship Curriculum (PDF)", size: "2.1 MB", url: "#" }
    ],
    raised: 45000,
    goal: 50000,
    donors: 1204,
    daysLeft: 8,
    image: "https://loremflickr.com/800/500/children,school,education/all",
    urgent: false,
    badge: "Most Loved",
    badgeColor: "secondary",
  },
  {
    id: 4,
    title: "Winter Food & Blanket Packs",
    category: "Food",
    description: "Nutritious food supplies and warm bedding for families during harsh winter months.",
    longDescription: commonLongDescription,
    videoUrl: null,
    documents: [
      { id: 1, title: "Winter Distribution Plan", size: "1.4 MB", url: "#" }
    ],
    raised: 22100,
    goal: 36000,
    donors: 890,
    daysLeft: 12,
    image: "https://loremflickr.com/800/500/food,relief,winter/all",
    urgent: false,
    badge: "Food Security",
    badgeColor: "accent",
  },
  {
    id: 5,
    title: "Yemen Crisis Response",
    category: "Emergency",
    description: "Emergency nutrition, clean water and health support for millions facing famine.",
    longDescription: commonLongDescription,
    videoUrl: null,
    documents: [
      { id: 1, title: "Crisis Assessment Report", size: "3.5 MB", url: "#" },
      { id: 2, title: "Nutrition Guidelines", size: "1.2 MB", url: "#" }
    ],
    raised: 67800,
    goal: 80000,
    donors: 3120,
    daysLeft: 2,
    image: "https://loremflickr.com/800/500/humanitarian,aid/all",
    urgent: true,
    badge: "Emergency",
    badgeColor: "emergency",
  },
  {
    id: 6,
    title: "Rebuild Rohingya Homes",
    category: "Shelter",
    description: "Safe, durable shelters for 500 Rohingya families currently living in makeshift camps.",
    longDescription: commonLongDescription,
    videoUrl: null,
    documents: [
      { id: 1, title: "Shelter Blueprints (PDF)", size: "5.1 MB", url: "#" }
    ],
    raised: 31500,
    goal: 60000,
    donors: 724,
    daysLeft: 30,
    image: "https://loremflickr.com/800/500/shelter,refugee/all",
    urgent: false,
    badge: "Shelter",
    badgeColor: "primary",
  },
  {
    id: 7,
    title: "Eye Surgery for 1000 Children",
    category: "Medical",
    description: "Restore sight to children suffering from preventable blindness across South Asia.",
    longDescription: commonLongDescription,
    videoUrl: null,
    documents: [
      { id: 1, title: "Medical Impact Summary", size: "2.8 MB", url: "#" }
    ],
    raised: 18900,
    goal: 25000,
    donors: 492,
    daysLeft: 18,
    image: "https://loremflickr.com/800/500/children,medical,clinic/all",
    urgent: false,
    badge: "Medical",
    badgeColor: "secondary",
  },
  {
    id: 8,
    title: "Ramadan Food Parcels 2025",
    category: "Food",
    description: "Deliver food parcels to 10,000 needy families across 10 countries this Ramadan.",
    longDescription: commonLongDescription,
    videoUrl: null,
    documents: [
      { id: 1, title: "Ramadan Logistics Plan", size: "1.9 MB", url: "#" }
    ],
    raised: 95000,
    goal: 100000,
    donors: 4500,
    daysLeft: 5,
    image: "https://loremflickr.com/800/500/food,ramadan,parcels/all",
    urgent: true,
    badge: "Almost Funded",
    badgeColor: "success",
  }
];

export const CAMPAIGN_CATEGORIES = ["All", "Emergency", "Water", "Education", "Food", "Medical", "Shelter"];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Choose a Cause",
    description: "Browse our verified campaigns and find a cause close to your heart, from emergency relief to education.",
    icon: "search",
  },
  {
    step: 2,
    title: "Make Your Donation",
    description: "Donate securely using any payment method. One-time or recurring monthly giving available.",
    icon: "volunteer_activism",
  },
  {
    step: 3,
    title: "We Deliver Aid",
    description: "Our field teams on the ground deploy your funds within 48 hours to those who need it most.",
    icon: "local_shipping",
  },
  {
    step: 4,
    title: "Track Your Impact",
    description: "Receive real-time updates, photos, and impact reports showing exactly how your donation helped.",
    icon: "analytics",
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Ahmed",
    location: "London, UK",
    avatar: "https://loremflickr.com/80/80/woman,portrait/all",
    quote: "I've donated to many charities, but Crescent Relief's transparency is unmatched. I can see exactly where every pound goes. It's given me so much confidence to give more.",
    donated: "£2,400 donated",
    campaigns: 12,
  },
  {
    id: 2,
    name: "Mohammed Al-Rashid",
    location: "Dubai, UAE",
    avatar: "https://loremflickr.com/80/80/man,portrait/all",
    quote: "The impact reports made me cry. Seeing little Aisha finally able to attend school because of my monthly donation — that's why I keep giving every single month.",
    donated: "£850/month",
    campaigns: 3,
  },
  {
    id: 3,
    name: "Dr. Fatima Malik",
    location: "Toronto, Canada",
    avatar: "https://loremflickr.com/80/80/woman,hijab,portrait/all",
    quote: "As a doctor, I appreciate how Crescent Relief prioritizes dignified medical aid. Their Yemen medical response saved hundreds of lives. Highly recommend.",
    donated: "£5,200 donated",
    campaigns: 8,
  },
  {
    id: 4,
    name: "James Okoye",
    location: "Lagos, Nigeria",
    avatar: "https://loremflickr.com/80/80/man,african,portrait/all",
    quote: "The water well in my village was built through Crescent Relief donors. Now 400 families have clean water. I am forever grateful to each donor.",
    donated: "Beneficiary",
    campaigns: 0,
  },
  {
    id: 5,
    name: "Aisha Rahman",
    location: "Birmingham, UK",
    avatar: "https://loremflickr.com/80/80/woman,young,portrait/all",
    quote: "Started my own fundraising page last Ramadan and raised £12,000 from my community. The platform made it so easy. I'll do it again this year!",
    donated: "£12,000 raised",
    campaigns: 2,
  },
];

export const FAQ_ITEMS = [
  {
    id: 1,
    question: "How do I know my donation reaches those in need?",
    answer: "We publish full financial reports quarterly. Every project has a dedicated page with real-time progress updates, field photos, and beneficiary stories. We are registered charity #1234567.",
  },
  {
    id: 2,
    question: "Can I donate Zakat through Crescent Relief?",
    answer: "Yes. We have dedicated Zakat-eligible campaigns clearly marked on the platform. Our scholars have reviewed and certified the eligible projects.",
  },
  {
    id: 3,
    question: "Is my payment information secure?",
    answer: "Absolutely. All payments are processed through Stripe with bank-level 256-bit SSL encryption. We never store your card details on our servers.",
  },
  {
    id: 4,
    question: "Can I set up a monthly recurring donation?",
    answer: "Yes, you can become a Monthly Donor with any amount starting from £5/month. You can pause, change, or cancel anytime from your dashboard.",
  },
  {
    id: 5,
    question: "How can I start my own fundraising page?",
    answer: "Simply register an account, click 'Start Fundraising', choose a campaign or create your own, set your goal and share your unique link with friends and family.",
  },
  {
    id: 6,
    question: "Do you offer Gift Aid for UK donors?",
    answer: "Yes! UK taxpayers can boost their donation by 25% at no extra cost through Gift Aid. Just tick the Gift Aid box during checkout.",
  },
  {
    id: 7,
    question: "How can I volunteer with Crescent Relief?",
    answer: "Register as a volunteer through our Volunteer portal. We have remote opportunities (translation, content, tech) and local events across 18 countries.",
  },
  {
    id: 8,
    question: "What percentage goes to the cause?",
    answer: "We are committed to ensuring at least 85p of every £1 reaches beneficiaries. Our admin and fundraising costs are published transparently in our annual report.",
  },
];

export const PARTNERS = [
  { id: 1, name: "UNICEF", logo: null },
  { id: 2, name: "UNHCR", logo: null },
  { id: 3, name: "WHO", logo: null },
  { id: 4, name: "Red Cross", logo: null },
  { id: 5, name: "Oxfam", logo: null },
  { id: 6, name: "Save the Children", logo: null },
];

export const IMPACT_STORIES = [
  {
    id: 1,
    name: "Skills Development",
    category: "Education & Skills",
    headline: "Bringing Hope Back to Refugees",
    story: "By conducting various skill development programmes and self-reliance projects, we help bring hope and confidence back into the lives of displaced people, teaching them important life-skills.",
    image: "https://loremflickr.com/900/600/education,skills,people/all",
    featured: true,
  },
  {
    id: 2,
    name: "Pure Water Initiative",
    category: "Water Projects",
    headline: "Digging Wells for Communities",
    story: "Everyone should have access to clean water. We help communities suffering from water shortages by digging wells and carrying out essential Water and Sanitation projects.",
    image: "https://loremflickr.com/600/400/water,well,africa/all",
    featured: false,
  },
  {
    id: 3,
    name: "Health Care Aid",
    category: "Medical Response",
    headline: "Restoring Hope and Saving Lives",
    story: "Everyone deserves the chance to heal. We provide essential medical care to those who can’t afford it—saving lives and restoring hope in crisis zones.",
    image: "https://loremflickr.com/600/400/medical,care,clinic/all",
    featured: false,
  },
  {
    id: 4,
    name: "Healthy Food Distribution",
    category: "Food Security",
    headline: "Nourishing Meals for the Needy",
    story: "No one deserves to go hungry. We provide warm, nourishing meals to those in need—bringing hope, dignity, and care to their lives.",
    image: "https://loremflickr.com/600/400/food,relief,meal/all",
    featured: false,
  },
  {
    id: 5,
    name: "Social Care & Employment",
    category: "Social Care",
    headline: "Creating Income Opportunities",
    story: "We take special efforts to help communities find a source of income generation, providing employment opportunities to the needy through our networks.",
    image: "https://loremflickr.com/600/400/social,care,community/all",
    featured: false,
  },
  {
    id: 6,
    name: "Residence Facilities",
    category: "Shelter",
    headline: "Safe Housing for Families in Crisis",
    story: "We offer safe, stable housing for families in crisis—helping them rebuild their lives with dignity and peace of mind after disaster strikes.",
    image: "https://loremflickr.com/600/400/shelter,house,rebuild/all",
    featured: false,
  },
];
