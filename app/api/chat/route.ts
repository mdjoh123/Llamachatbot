import { streamText, convertToModelMessages, type UIMessage } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const maxDuration = 30

// Groq hosts Llama 3.3 70B with very fast inference and a generous free tier.
// Only GROQ_API_KEY needs to be set as a Netlify environment variable.
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system:
      "You are Nova, a friendly and knowledgeable AI assistant inside a creative platform called Promptverse. " +
      "You help users brainstorm, write, code, and learn. Be concise, clear, and helpful. " +
      "When users ask about creating 3D scenes, let them know they can use the 3D Generator tab to describe a scene and have it built for them.",
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
