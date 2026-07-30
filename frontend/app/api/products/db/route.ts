import { NextRequest, NextResponse } from "next/server";
import { store } from "../../store";

export async function GET() {
  return NextResponse.json({ products: store.products });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newProduct = {
      id: "prod_" + Math.random().toString(36).substring(2, 9),
      title: body.title || "AI Product Design",
      prompt: body.prompt || "",
      style: body.style || "",
      color_palette: body.color_palette || "",
      image_url: body.image_url || "",
      price: Number(body.price || 29.99),
      status: body.status || "Active",
      created_at: new Date().toISOString(),
    };
    store.products.unshift(newProduct);
    return NextResponse.json({ product: newProduct, message: "Product saved to catalog" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
