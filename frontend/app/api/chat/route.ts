import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage = body.message || "Hello";
    const convId = body.conversation_id || "conv_" + Math.random().toString(36).substring(2, 9);

    const groqKey = process.env.GROQ_API_KEY;

    if (groqKey) {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are Otto, an expert AI business automation assistant for the Autonomous Business Platform.
You help with: marketing campaigns, product design, content writing, video production, business contacts, and email outreach.
Be concise, professional, and action-oriented. Provide practical advice and ready-to-use business content.`,
            },
            { role: "user", content: userMessage },
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        const responseText = groqData.choices?.[0]?.message?.content || "I'm ready to help with your business automation!";
        return NextResponse.json({ response: responseText, conversation_id: convId });
      }
    }

    // Smart Otto AI Assistant fallback response
    let responseText = `I am **Otto**, your AI Business Assistant. I analyzed your query: "${userMessage}".\n\n`;
    const lower = userMessage.toLowerCase();

    if (lower.includes("campaign") || lower.includes("marketing")) {
      responseText += `🚀 **Campaign Advice:** For ${userMessage}, I recommend a multi-channel campaign targeting Instagram & LinkedIn. You can use our **Campaign Creator** to generate full strategies, social posts, and email copy with 1 click!`;
    } else if (lower.includes("product") || lower.includes("design") || lower.includes("image")) {
      responseText += `🎨 **Product Design Strategy:** You can use our **Product Studio** powered by Flux AI to render high-resolution 1024×1024 product mockups and save them to your catalog!`;
    } else if (lower.includes("email") || lower.includes("contact") || lower.includes("outreach")) {
      responseText += `💌 **Outreach Recommendation:** Use our **Contact Studio** to discover influencers and potential buyers, then launch automated email outreach via **Resend.com**!`;
    } else {
      responseText += `Here is your action plan:\n1. **Define Your Goal**: Target a specific audience with high intent.\n2. **Automate Content**: Use AI for blog posts, social media, and product designs.\n3. **Track CRM**: Store customers and track live revenue in your Analytics dashboard.`;
    }

    return NextResponse.json({ response: responseText, conversation_id: convId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
