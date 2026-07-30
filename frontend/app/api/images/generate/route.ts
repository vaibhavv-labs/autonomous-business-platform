import { NextRequest, NextResponse } from "next/server";
import { store } from "../../store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const jobId = "job_" + Math.random().toString(36).substring(2, 9);
    const prompt = body.prompt || "artwork";
    const width = body.width || 1024;
    const height = body.height || 1024;
    const numOutputs = body.num_outputs || 2;
    const style = body.style || "";

    const variations = [
      "highly detailed masterpiece, studio lighting",
      "cinematic composition, vibrant colors, crisp focus",
      "trending on artstation, 8k resolution, elegant detail",
      "award winning artwork, professional product design",
    ];

    const images = [];
    for (let i = 0; i < numOutputs; i++) {
      const seed = Math.floor(Math.random() * 900000) + 100000;
      const ts = Date.now() + i * 250;
      const promptText = `${prompt}${style ? `, ${style} style` : ""}, ${variations[i % variations.length]}`;
      const encoded = encodeURIComponent(promptText);
      images.push(`https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&model=flux&nologo=true&seed=${seed}&ts=${ts}`);
    }

    store.jobs[jobId] = {
      id: jobId,
      status: "completed",
      progress: 100,
      result: { images },
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ job_id: jobId, status: "queued" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
