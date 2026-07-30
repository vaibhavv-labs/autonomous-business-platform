import { NextRequest, NextResponse } from "next/server";
import { store } from "../../store";

export async function GET() {
  return NextResponse.json({ contacts: store.contacts });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newContact = {
      id: "cont_" + Math.random().toString(36).substring(2, 9),
      name: body.name || "Unknown",
      role: body.role || "",
      company: body.company || "",
      channel: body.channel || "Email",
      score: Number(body.score || 5),
      strategy: body.strategy || "",
      email: body.email || "",
      status: body.status || "New",
      created_at: new Date().toISOString(),
    };
    store.contacts.unshift(newContact);
    return NextResponse.json({ contact: newContact, message: "Contact saved" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
