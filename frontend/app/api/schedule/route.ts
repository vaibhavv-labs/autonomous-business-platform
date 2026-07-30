import { NextRequest, NextResponse } from "next/server";
import { store } from "../store";

export async function GET() {
  return NextResponse.json({ scheduled_posts: store.scheduled_posts });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newPost = {
      id: "sch_" + Math.random().toString(36).substring(2, 9),
      title: body.title || "Scheduled Post",
      content: body.content || "",
      platform: body.platform || "Twitter/X",
      scheduled_time: body.scheduled_time || new Date(Date.now() + 86400000).toISOString(),
      status: "Scheduled",
      created_at: new Date().toISOString(),
    };
    store.scheduled_posts.unshift(newPost);
    return NextResponse.json({ post: newPost, message: "Post scheduled successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
