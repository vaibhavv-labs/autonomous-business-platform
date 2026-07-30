import { NextRequest, NextResponse } from "next/server";
import { store } from "../../store";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    store.scheduled_posts = store.scheduled_posts.filter((p) => p.id !== id);
    return NextResponse.json({ message: "Scheduled post deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
