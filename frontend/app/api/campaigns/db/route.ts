import { NextRequest, NextResponse } from "next/server";
import { store } from "../../store";

export async function GET() {
  return NextResponse.json({ campaigns: store.campaigns });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newCampaign = {
      id: "camp_" + Math.random().toString(36).substring(2, 9),
      name: body.name || `Campaign - ${(body.product || "Product").slice(0, 30)}`,
      product: body.product || "",
      audience: body.audience || "",
      budget: Number(body.budget || 5000),
      platforms: Array.isArray(body.platforms) ? body.platforms : [],
      goal: body.goal || "",
      tone: body.tone || "",
      strategy: body.strategy || "",
      social_posts: body.social_posts || "",
      email: body.email || "",
      created_at: new Date().toISOString(),
    };
    store.campaigns.unshift(newCampaign);
    return NextResponse.json({ campaign: newCampaign, message: "Campaign saved to database" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
