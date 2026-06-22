import { generateText, Output } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const maxDuration = 30

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const objectSchema = z.object({
  shape: z
    .enum(["box", "sphere", "cylinder", "cone", "torus", "torusKnot", "dodecahedron", "icosahedron", "octahedron"])
    .describe("The geometry of this object"),
  color: z.string().describe("A hex color string like #ff6b35"),
  position: z.array(z.number()).length(3).describe("[x, y, z] position in the scene"),
  scale: z.number().describe("Uniform scale, typically between 0.3 and 2"),
  metalness: z.number().describe("Material metalness 0 to 1"),
  roughness: z.number().describe("Material roughness 0 to 1"),
  animation: z
    .enum(["none", "rotate", "float", "spin-fast", "orbit", "pulse"])
    .describe("Animation applied to this object"),
})

const sceneSchema = z.object({
  title: z.string().describe("A short 2-4 word title for this scene"),
  description: z.string().describe("A one sentence description of the scene"),
  background: z.string().describe("Background hex color for the scene"),
  ambientIntensity: z.number().describe("Ambient light intensity 0 to 2"),
  objects: z.array(objectSchema).min(1).max(12).describe("The objects that make up the scene"),
})

export type Scene = z.infer<typeof sceneSchema>

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { prompt } = await req.json()

  if (!prompt || typeof prompt !== "string") {
    return new Response("Missing prompt", { status: 400 })
  }

  const { experimental_output } = await generateText({
    model: groq("llama-3.3-70b-versatile"),
    system:
      "You are a 3D scene designer. Given a text description, design an interactive 3D scene composed of primitive shapes. " +
      "Compose multiple objects with varied positions, colors, scales, and animations to capture the spirit of the prompt. " +
      "Spread objects across positions so they do not overlap. Use harmonious colors. Pick animations that fit the mood.",
    prompt: `Design a 3D scene for: "${prompt}"`,
    experimental_output: Output.object({ schema: sceneSchema }),
  })

  return Response.json(experimental_output)
}
