import { NextRequest, NextResponse } from "next/server";
import { store } from "../../../store";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const index = store.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    store.products[index] = { ...store.products[index], ...body };
    return NextResponse.json({ product: store.products[index], message: "Product updated" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    store.products = store.products.filter((p) => p.id !== id);
    return NextResponse.json({ message: "Product deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
