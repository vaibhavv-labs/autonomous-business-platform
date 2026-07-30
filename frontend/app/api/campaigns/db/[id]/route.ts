import { NextRequest, NextResponse } from "next/server";
import { store } from "../../../store";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    store.campaigns = store.campaigns.filter((c) => c.id !== id);
    return NextResponse.json({ message: "Campaign deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
