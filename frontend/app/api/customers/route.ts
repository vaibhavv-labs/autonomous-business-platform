import { NextRequest, NextResponse } from "next/server";
import { store } from "../store";

export async function GET() {
  return NextResponse.json({ customers: store.customers });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newCustomer = {
      id: "cust_" + Math.random().toString(36).substring(2, 9),
      name: body.name || "New Customer",
      email: body.email || "",
      product: body.product || "",
      status: body.status || "Active",
      spent: Number(body.spent || 0),
      joined: body.joined || new Date().toISOString().slice(0, 10),
      created_at: new Date().toISOString(),
    };
    store.customers.unshift(newCustomer);
    return NextResponse.json({ customer: newCustomer, message: "Customer created successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
