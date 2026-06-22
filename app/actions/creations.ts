"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { creation } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export type CreationType = "chat" | "scene"

export async function getCreations(type?: CreationType) {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(creation)
    .where(
      type
        ? and(eq(creation.userId, userId), eq(creation.type, type))
        : eq(creation.userId, userId),
    )
    .orderBy(desc(creation.createdAt))
  return rows
}

export async function saveCreation(input: {
  type: CreationType
  title: string
  prompt: string
  data: unknown
}) {
  const userId = await getUserId()
  const [row] = await db
    .insert(creation)
    .values({
      userId,
      type: input.type,
      title: input.title.slice(0, 120),
      prompt: input.prompt,
      data: input.data as object,
    })
    .returning()
  revalidatePath("/dashboard")
  return row
}

export async function deleteCreation(id: number) {
  const userId = await getUserId()
  await db.delete(creation).where(and(eq(creation.id, id), eq(creation.userId, userId)))
  revalidatePath("/dashboard")
}
