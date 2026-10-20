import { Request, Response } from "express";
import dotenv from "dotenv";
import express from "express";
import Groq from "groq-sdk";

dotenv.config();

const router = express.Router();

let groqClient: Groq | null = null;
const getGroqClient = (): Groq | null => {
  if (groqClient) return groqClient;
  if (!process.env.GROQ_API_KEY) return null;
  groqClient = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
  return groqClient;
};

// Chat endpoint
router.post("/chatbot", async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res
        .status(400)
        .json({ error: "A valid 'message' string is required." });
    }

    const groq = getGroqClient();
    if (!groq) {
      return res.status(503).json({
        error: "AI Chatbot is currently unavailable. Set GROQ_API_KEY in backend .env to enable.",
      });
    }

    // Build conversation context for Groq
    let contextMessages: { role: "system" | "user" | "assistant"; content: string }[] = [];

    // Add conversation history (last 5 messages)
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      contextMessages = conversationHistory.slice(-5).map((msg: any) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: String(msg.content || ""),
      }));
    }
    contextMessages.push({
      role: "user",
      content: message.trim(),
    });

    const systemPrompt = `You are a helpful AI assistant for video meetings. You help users with:
    - Meeting management and scheduling
    - Technical troubleshooting
    - Meeting etiquette and best practices
    - Note-taking and action items
    - General meeting assistance

    Be concise, friendly, and helpful. Keep responses under 150 words when possible.`;

    // Call Groq API with valid versatile model
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...contextMessages,
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response =
      completion.choices[0]?.message?.content ||
      "I'm here to help with your meeting! What would you like to know?";

    res.json({ response });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({
      error: "Failed to process message",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export { router as chatbotRoutes };
