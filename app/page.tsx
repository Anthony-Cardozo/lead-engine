import { prisma } from "@/app/lib/prisma"

export default async function Home() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Leads</h1>

      <div style={{ marginTop: 12 }}>
        <a href="/api/discover">Run discovery</a>
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        {leads.map((l : any) => ( //fix
          <div key={l.id} style={{ border: "1px solid #ddd", padding: 12 }}>
            <div style={{ fontWeight: 600 }}>{l.name}</div>
            <div style={{ opacity: 0.8 }}>{l.address}</div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>{l.placeId}</div>
          </div>
        ))}
      </div>
    </main>
  )
}