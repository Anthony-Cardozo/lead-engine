import axios from "axios"
import { prisma } from "@/app/lib/prisma"

export async function GET() {
  const key = process.env.GOOGLE_PLACES_KEY
  if (!key) {
    return Response.json({ error: "Missing GOOGLE_PLACES_KEY" }, { status: 500 })
  }

  const res = await axios.get(
    "https://maps.googleapis.com/maps/api/place/textsearch/json",
    {
      params: {
        query: "fruteria Dallas Texas",
        key,
      },
    }
  )

  const places = res.data?.results ?? []

  let created = 0
  for (const place of places) {
    const placeId = place.place_id as string | undefined
    const name = place.name as string | undefined
    const address = place.formatted_address as string | undefined

    if (!placeId || !name) continue

    // Upsert prevents duplicates across repeated runs
    await prisma.lead.upsert({
      where: { placeId },
      update: { name, address },
      create: { placeId, name, address },
    })
    created++
  }

  return Response.json({ fetched: places.length, upserted: created })
}