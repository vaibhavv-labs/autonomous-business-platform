const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchAPI(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  return res.json();
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
