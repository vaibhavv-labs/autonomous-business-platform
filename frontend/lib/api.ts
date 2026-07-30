async function fetchAPI(path: string, options: RequestInit = {}) {
  const customBase = process.env.NEXT_PUBLIC_API_URL;
  // If customBase is set (and not localhost on production), use it; otherwise use relative path /api/...
  const isVercel = typeof window !== "undefined" && window.location.hostname.includes("vercel.app");
  const baseUrl = (customBase && (!isVercel || !customBase.includes("localhost"))) ? customBase : "";
  const url = `${baseUrl}${path}`;

  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    if (res.ok) {
      return await res.json();
    }
    // If custom base returned error, attempt fallback to relative route
    if (baseUrl && url !== path) {
      const fb = await fetch(path, {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
      });
      if (fb.ok) return await fb.json();
    }
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error ${res.status}`);
  } catch (err: any) {
    // If network error (e.g. localhost unreachable on Vercel), fallback to relative route
    if (baseUrl && url !== path) {
      try {
        const fb = await fetch(path, {
          headers: { "Content-Type": "application/json", ...options.headers },
          ...options,
        });
        if (fb.ok) return await fb.json();
      } catch {
        /* ignore */
      }
    }
    throw err;
  }
}

// ─── Health ──────────────────────────────────────────────────
export const getHealth = () => fetchAPI("/health");

// ─── Jobs ─────────────────────────────────────────────────────
export const getJobs = (params?: { status?: string; limit?: number }) => {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  if (params?.limit) q.set("limit", String(params.limit));
  return fetchAPI(`/api/jobs?${q}`);
};
export const getJob = (id: string) => fetchAPI(`/api/jobs/${id}`);
export const cancelJob = (id: string) =>
  fetchAPI(`/api/jobs/${id}`, { method: "DELETE" });

// ─── Images ──────────────────────────────────────────────────
export const generateImage = (body: {
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  num_outputs?: number;
  style?: string;
  color_palette?: string;
}) => fetchAPI("/api/images/generate", { method: "POST", body: JSON.stringify(body) });

// ─── Campaigns ────────────────────────────────────────────────
export const generateCampaign = (body: {
  product_description: string;
  target_audience?: string;
  budget?: number;
  platforms?: string[];
  campaign_goal?: string;
  campaign_tone?: string;
  competitor_info?: string;
  fast_mode?: boolean;
}) => fetchAPI("/api/campaigns/generate", { method: "POST", body: JSON.stringify(body) });

// ─── Content ──────────────────────────────────────────────────
export const generateContent = (body: {
  topic: string;
  content_type?: string;
  tone?: string;
  target_audience?: string;
  keywords?: string[];
  word_count?: number;
}) => fetchAPI("/api/content/generate", { method: "POST", body: JSON.stringify(body) });

// ─── Video ────────────────────────────────────────────────────
export const generateVideo = (body: {
  prompt: string;
  model?: string;
  duration?: number;
  aspect_ratio?: string;
}) => fetchAPI("/api/videos/generate", { method: "POST", body: JSON.stringify(body) });

// ─── Chat ─────────────────────────────────────────────────────
export const sendChatMessage = (body: {
  message: string;
  conversation_id?: string;
  context?: Record<string, unknown>;
}) => fetchAPI("/api/chat", { method: "POST", body: JSON.stringify(body) });

// ─── Contacts ─────────────────────────────────────────────────
export const findContacts = (body: {
  product_description: string;
  target_market?: string;
  contact_types?: string[];
  num_contacts?: number;
}) => fetchAPI("/api/contacts/find", { method: "POST", body: JSON.stringify(body) });

// ─── Analytics ────────────────────────────────────────────────
export const getAnalytics = () => fetchAPI("/api/analytics/overview");

// ─── Poll job until done ──────────────────────────────────────
export async function pollJob(
  jobId: string,
  onUpdate: (job: Record<string, unknown>) => void,
  intervalMs = 1500,
  timeoutMs = 120000
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let iv: ReturnType<typeof setInterval> | null = null;
    let timedOut = false;

    const timeoutId = setTimeout(() => {
      timedOut = true;
      if (iv) clearInterval(iv);
      reject(new Error("Job timed out after 2 minutes"));
    }, timeoutMs);

    const check = async () => {
      if (timedOut) return;
      try {
        const job = await getJob(jobId);
        onUpdate(job);
        if (["completed", "failed", "cancelled"].includes(String(job.status))) {
          clearTimeout(timeoutId);
          if (iv) clearInterval(iv);
          if (job.status === "completed") resolve(job);
          else reject(new Error(String(job.error || "Job failed")));
        }
      } catch (err) {
        clearTimeout(timeoutId);
        if (iv) clearInterval(iv);
        reject(err);
      }
    };

    // Check immediately, then on interval
    check();
    iv = setInterval(check, intervalMs);
  });
}

// ─── CRUD Interfaces ──────────────────────────────────────────
export interface DBCustomer {
  id: string;
  name: string;
  email: string;
  product: string;
  status: string;
  spent: number;
  joined: string;
  created_at: string;
}

export interface DBContact {
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

export interface DBProduct {
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

// ─── Customers API ────────────────────────────────────────────
export const getCustomers = (): Promise<{ customers: DBCustomer[] }> => fetchAPI("/api/customers");
export const createCustomer = (body: Partial<DBCustomer>): Promise<{ customer: DBCustomer; message: string }> =>
  fetchAPI("/api/customers", { method: "POST", body: JSON.stringify(body) });
export const updateCustomer = (id: string, body: Partial<DBCustomer>): Promise<{ customer: DBCustomer; message: string }> =>
  fetchAPI(`/api/customers/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteCustomer = (id: string): Promise<{ message: string }> =>
  fetchAPI(`/api/customers/${id}`, { method: "DELETE" });

// ─── Contacts DB API ──────────────────────────────────────────
export const getDBContacts = (): Promise<{ contacts: DBContact[] }> => fetchAPI("/api/contacts/db");
export const createDBContact = (body: Partial<DBContact>): Promise<{ contact: DBContact; message: string }> =>
  fetchAPI("/api/contacts/db", { method: "POST", body: JSON.stringify(body) });
export const bulkCreateDBContacts = (contacts: Partial<DBContact>[]): Promise<{ contacts: DBContact[]; count: number; message: string }> =>
  fetchAPI("/api/contacts/db/bulk", { method: "POST", body: JSON.stringify(contacts) });
export const updateDBContact = (id: string, body: Partial<DBContact>): Promise<{ contact: DBContact; message: string }> =>
  fetchAPI(`/api/contacts/db/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteDBContact = (id: string): Promise<{ message: string }> =>
  fetchAPI(`/api/contacts/db/${id}`, { method: "DELETE" });

// ─── Products DB API ──────────────────────────────────────────
export const getDBProducts = (): Promise<{ products: DBProduct[] }> => fetchAPI("/api/products/db");
export const createDBProduct = (body: Partial<DBProduct>): Promise<{ product: DBProduct; message: string }> =>
  fetchAPI("/api/products/db", { method: "POST", body: JSON.stringify(body) });
export const updateDBProduct = (id: string, body: Partial<DBProduct>): Promise<{ product: DBProduct; message: string }> =>
  fetchAPI(`/api/products/db/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteDBProduct = (id: string): Promise<{ message: string }> =>
  fetchAPI(`/api/products/db/${id}`, { method: "DELETE" });

// ─── Campaigns DB API ─────────────────────────────────────────
export interface DBCampaign {
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

export const getDBCampaigns = (): Promise<{ campaigns: DBCampaign[] }> => fetchAPI("/api/campaigns/db");
export const createDBCampaign = (body: Partial<DBCampaign>): Promise<{ campaign: DBCampaign; message: string }> =>
  fetchAPI("/api/campaigns/db", { method: "POST", body: JSON.stringify(body) });
export const deleteDBCampaign = (id: string): Promise<{ message: string }> =>
  fetchAPI(`/api/campaigns/db/${id}`, { method: "DELETE" });

// ─── Real Email Outreach API ─────────────────────────────────
export const sendEmailOutreach = (body: {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from_name?: string;
}): Promise<{ success: boolean; provider: string; id: string; message: string }> =>
  fetchAPI("/api/email/send", { method: "POST", body: JSON.stringify(body) });

// ─── Scheduled Posts API ──────────────────────────────────────
export interface DBScheduledPost {
  id: string;
  title: string;
  content: string;
  platform: string;
  scheduled_time: string;
  status: string;
  created_at: string;
}

export const getScheduledPosts = (): Promise<{ scheduled_posts: DBScheduledPost[] }> => fetchAPI("/api/schedule");
export const createScheduledPost = (body: Partial<DBScheduledPost>): Promise<{ post: DBScheduledPost; message: string }> =>
  fetchAPI("/api/schedule", { method: "POST", body: JSON.stringify(body) });
export const deleteScheduledPost = (id: string): Promise<{ message: string }> =>
  fetchAPI(`/api/schedule/${id}`, { method: "DELETE" });
