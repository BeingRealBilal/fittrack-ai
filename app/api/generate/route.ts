import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { goal, name } = await req.json();

    if (!goal || !name) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. Find the user in Neon
    const user = await prisma.user.findUnique({ where: { name } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const systemPrompt = `You are an elite strength coach. Provide a strict workout plan for: ${goal}. Format cleanly with exercises, sets, and reps. Max 150 words.`;

    // 2. Call OpenRouter using the 2026 "Universal Free" endpoint
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AI_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "FitTrack AI"
      },
      body: JSON.stringify({
        // This is the 2026 "Universal Free Router" ID
        model: "openrouter/free", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Build my protocol." }
        ],
        // Allows OpenRouter to pick the best available free provider
        provider: { order: ["DeepInfra", "Together", "Cloudflare"], allow_fallbacks: true }
      })
    });

    const aiData = await aiResponse.json();

    if (aiData.error) {
      console.error("OpenRouter Error Details:", aiData.error);
      return NextResponse.json({ 
        error: `AI Error: ${aiData.error.message || "No free endpoints available right now."}` 
      }, { status: 500 });
    }

    const generatedPlan = aiData.choices?.[0]?.message?.content || "AI failed to generate.";

    // 3. Clear old plans and save the new one
    await prisma.workout.deleteMany({ where: { userId: user.id } });
    
    const savedWorkout = await prisma.workout.create({
      data: { 
        userId: user.id, 
        title: `Target: ${goal}`, 
        plan: generatedPlan 
      }
    });

    return NextResponse.json({ success: true, workout: savedWorkout });

  } catch (error) {
    console.error("Critical Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}