import { db } from "@/db/drizzle"
import { users } from "@/migrations/schema"

export async function POST(request: Request) {
  const body = await request.json()

  console.log(body)

  await db.insert(users).values({ clerkUserId: body.data.id })

  return Response.json({ message: "created user" })
}
