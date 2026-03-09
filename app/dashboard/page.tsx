"use client"

import AddWebsite from "@/components/add-website"
import WebsiteCard, { WebsiteCardSkeleton } from "@/components/website-card"
import { client } from "@/lib/orpc"
import { useQuery } from "@tanstack/react-query"
import { Link } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => await client.listWebsites(),
  })

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Dina hemsidor</h3>
          {data && data?.length > 0 && <AddWebsite />}
        </div>

        {data?.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Link />
              </EmptyMedia>

              <EmptyTitle>Inga hemsidor ännu</EmptyTitle>

              <EmptyDescription>
                Du har inte lagt till några hemsidor att övervaka ännu. Lägg
                till din första hemsida för att börja kontrollera att den är
                online.
              </EmptyDescription>
            </EmptyHeader>

            <EmptyContent>
              <AddWebsite />
            </EmptyContent>
          </Empty>
        ) : (
          <ul className="grid grid-cols-3 gap-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <li key={i}>
                    <WebsiteCardSkeleton />
                  </li>
                ))
              : data?.map((website) => (
                  <li key={website.id}>
                    <WebsiteCard website={website} />
                  </li>
                ))}
          </ul>
        )}
      </section>
    </div>
  )
}
