import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, html, text, from_name } = body;

    if (!to || !subject) {
      return NextResponse.json({ error: "Recipient email ('to') and 'subject' are required." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey) {
      // Send real email via Resend.com API
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${from_name || "ABP Outreach"} <onboarding@resend.dev>`,
          to: Array.isArray(to) ? to : [to],
          subject: subject,
          html: html || `<p>${text || subject}</p>`,
        }),
      });

      const resendData = await resendRes.json();
      if (!resendRes.ok) {
        return NextResponse.json({ error: resendData.message || "Resend API error", details: resendData }, { status: resendRes.status });
      }

      return NextResponse.json({
        success: true,
        provider: "resend",
        id: resendData.id,
        message: `Email successfully sent to ${Array.isArray(to) ? to.join(", ") : to} via Resend.com! 🚀`,
      });
    } else {
      // Simulated Email Delivery (when RESEND_API_KEY is not set)
      const simulatedId = "sim_" + Math.random().toString(36).substring(2, 9);
      return NextResponse.json({
        success: true,
        provider: "simulated",
        id: simulatedId,
        message: `[Simulated Send] Email "${subject}" dispatched to ${Array.isArray(to) ? to.join(", ") : to}. Add RESEND_API_KEY to send real emails! ✉️`,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
