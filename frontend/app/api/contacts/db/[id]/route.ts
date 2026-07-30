import { NextRequest, NextResponse } from "next/server";
import { store } from "../../../store";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const index = store.contacts.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    store.contacts[index] = { ...store.contacts[index], ...body };
    return NextResponse.json({ contact: store.contacts[index], message: "Contact updated" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    store.contacts = store.contacts.filter((c) => c.id !== id);
    return NextResponse.json({ message: "Contact deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
