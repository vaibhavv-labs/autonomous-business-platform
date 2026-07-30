import { NextRequest, NextResponse } from "next/server";
import { store } from "../../store";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const job = store.jobs[id] || { id, status: "completed", progress: 100, result: {} };
    return NextResponse.json(job);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
