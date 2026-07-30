import { NextRequest, NextResponse } from "next/server";
import { store } from "../../store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const jobId = "job_" + Math.random().toString(36).substring(2, 9);
    const product = body.product_description || "Product";
    const num = Number(body.num_contacts || 6);

    const names = ["Sarah Johnson", "Marcus Vance", "Elena Rostova", "David Miller", "Chloe Bennett", "Liam O'Connor", "Aria Patel"];
    const roles = ["Lifestyle Influencer", "Tech Reviewer", "Fashion Blogger", "Podcast Host", "Brand Ambassador", "YouTube Creator"];
    const companies = ["SarahLives", "Vance Tech", "Rostova Style", "Miller Media", "Bennett Social", "O'Connor Daily"];
    const channels = ["Instagram", "YouTube", "TikTok", "Blog", "Podcast"];

    const contacts = [];
    for (let i = 0; i < num; i++) {
      const idx = i % names.length;
      contacts.push({
        name: names[idx],
        role: roles[i % roles.length],
        company: companies[i % companies.length],
        channel: channels[i % channels.length],
        score: Math.floor(Math.random() * 3) + 8,
        strategy: `Send personalized product sample of ${product} with custom outreach message.`,
        email: `${names[idx].toLowerCase().replace(/[^a-z]/g, "")}@example.com`,
      });
    }

    store.jobs[jobId] = {
      id: jobId,
      status: "completed",
      progress: 100,
      result: { contacts, raw: JSON.stringify(contacts) },
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ job_id: jobId, status: "queued" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
