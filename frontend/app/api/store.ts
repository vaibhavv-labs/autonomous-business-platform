// Shared Serverless Data Store for Next.js API Routes (Vercel)

export interface Customer {
  id: string;
  name: string;
  email: string;
  product: string;
  status: string;
  spent: number;
  joined: string;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  channel: string;
  score: number;
  strategy: string;
  email: string;
  status: string;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  prompt: string;
  style: string;
  color_palette: string;
  image_url: string;
  price: number;
  status: string;
  created_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  product: string;
  audience: string;
  budget: number;
  platforms: string[];
  goal: string;
  tone: string;
  strategy: string;
  social_posts: string;
  email: string;
  created_at: string;
}

// Initial Seed Data
const defaultCustomers: Customer[] = [
  { id: "1", name: "Emma Johnson", email: "emma@example.com", product: "Eco Tote Bag", status: "Active", spent: 124, joined: "2024-01-15", created_at: new Date().toISOString() },
  { id: "2", name: "Liam Chen", email: "liam@example.com", product: "Custom Hoodie", status: "Active", spent: 89, joined: "2024-02-20", created_at: new Date().toISOString() },
  { id: "3", name: "Sofia Martinez", email: "sofia@example.com", product: "Phone Case", status: "Inactive", spent: 45, joined: "2024-03-10", created_at: new Date().toISOString() },
  { id: "4", name: "Noah Williams", email: "noah@example.com", product: "Ceramic Mug Set", status: "Active", spent: 210, joined: "2024-03-22", created_at: new Date().toISOString() },
  { id: "5", name: "Ava Brown", email: "ava@example.com", product: "Wall Art Print", status: "VIP", spent: 560, joined: "2024-04-01", created_at: new Date().toISOString() },
];

const defaultProducts: Product[] = [
  {
    id: "p1",
    title: "Cyberpunk Neon Hoodie",
    prompt: "Futuristic cyberpunk hoodie design with neon glow, high detail",
    style: "Cyberpunk",
    color_palette: "Neon",
    image_url: "https://image.pollinations.ai/prompt/Futuristic%20cyberpunk%20hoodie%20design%20with%20neon%20glow?width=800&height=800&model=flux&nologo=true&seed=101",
    price: 49.99,
    status: "Active",
    created_at: new Date().toISOString(),
  },
  {
    id: "p2",
    title: "Minimalist Botanical Mug",
    prompt: "Minimalist line art monstera leaf on ceramic coffee mug",
    style: "Minimalist",
    color_palette: "Pastel",
    image_url: "https://image.pollinations.ai/prompt/Minimalist%20line%20art%20monstera%20leaf%20ceramic%20mug?width=800&height=800&model=flux&nologo=true&seed=202",
    price: 24.99,
    status: "Active",
    created_at: new Date().toISOString(),
  },
  {
    id: "p3",
    title: "Vintage Sunset Tote Bag",
    prompt: "Retro 70s vintage beach sunset graphic design",
    style: "Vintage",
    color_palette: "Sunset Warm",
    image_url: "https://image.pollinations.ai/prompt/Retro%2070s%20vintage%20beach%20sunset%20graphic%20tote?width=800&height=800&model=flux&nologo=true&seed=303",
    price: 19.99,
    status: "Active",
    created_at: new Date().toISOString(),
  },
];

const defaultContacts: Contact[] = [
  {
    id: "c1",
    name: "Sarah Johnson",
    role: "Lifestyle Influencer",
    company: "SarahLives",
    channel: "Instagram",
    score: 9,
    strategy: "Send product sample with personalized video pitch",
    email: "sarah@sarahlives.com",
    status: "New",
    created_at: new Date().toISOString(),
  },
  {
    id: "c2",
    name: "Marcus Vance",
    role: "Tech Reviewer",
    company: "Vance Tech",
    channel: "YouTube",
    score: 8,
    strategy: "Offer exclusive launch sponsorship & early access",
    email: "marcus@vancetech.io",
    status: "Contacted",
    created_at: new Date().toISOString(),
  },
];

export interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  platform: string;
  scheduled_time: string;
  status: string;
  created_at: string;
}

// In-Memory Global Store for Vercel Lambdas
declare global {
  /* eslint-disable no-var */
  var __ABP_STORE__: {
    customers: Customer[];
    products: Product[];
    contacts: Contact[];
    campaigns: Campaign[];
    scheduled_posts: ScheduledPost[];
    jobs: Record<string, any>;
  } | undefined;
}

if (!globalThis.__ABP_STORE__) {
  globalThis.__ABP_STORE__ = {
    customers: defaultCustomers,
    products: defaultProducts,
    contacts: defaultContacts,
    campaigns: [],
    scheduled_posts: [
      {
        id: "sch_1",
        title: "Product Launch Announcement",
        content: "🚀 Excited to unveil our brand new AI Product Studio! Check out the future of design. #AI #Innovation",
        platform: "Twitter/X",
        scheduled_time: new Date(Date.now() + 86400000).toISOString(),
        status: "Scheduled",
        created_at: new Date().toISOString(),
      }
    ],
    jobs: {},
  };
}

export const store = globalThis.__ABP_STORE__;
