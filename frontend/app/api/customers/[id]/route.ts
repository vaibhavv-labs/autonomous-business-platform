import { NextRequest, NextResponse } from "next/server";
import { store } from "../../store";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const index = store.customers.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    store.customers[index] = { ...store.customers[index], ...body };
    return NextResponse.json({ customer: store.customers[index], message: "Customer updated" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    store.customers = store.customers.filter((c) => c.id !== id);
    return NextResponse.json({ message: "Customer deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
