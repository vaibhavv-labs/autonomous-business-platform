import { NextRequest, NextResponse } from "next/server";
import { store } from "../../../store";

export async function POST(req: NextRequest) {
  try {
    const list = await req.json();
    const saved = [];
    for (const item of list) {
      const newContact = {
        id: "cont_" + Math.random().toString(36).substring(2, 9),
        name: item.name || "Unknown",
        role: item.role || "",
        company: item.company || "",
        channel: item.channel || "Email",
        score: Number(item.score || 5),
        strategy: item.strategy || "",
        email: item.email || "",
        status: item.status || "New",
        created_at: new Date().toISOString(),
      };
      store.contacts.unshift(newContact);
      saved.push(newContact);
    }
    return NextResponse.json({ contacts: saved, count: saved.length, message: "Contacts saved" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
