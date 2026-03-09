"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Website } from "@/migrations/schema"
import { Skeleton } from "./ui/skeleton"

import Link from "next/link"

type Props = {
  website: Website
}

export default function WebsiteCard({ website }: Props) {
  return (
    <Link href={`/dashboard/${website.id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{website.url}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Senast kollad:{" "}
            {website.lastCheckedAt
              ? new Date(website.lastCheckedAt).toDateString()
              : "Aldrig"}
          </p>
          <p>Körs varje: {website.interval / 60 / 60}h</p>
        </CardContent>
        <CardFooter>
          <p>Senast uppdaterad: {new Date(website.createdAt).toDateString()}</p>
        </CardFooter>
      </Card>
    </Link>
  )
}

export function WebsiteCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        {/* Title / URL link */}
        <Skeleton className="h-5 w-48" />
      </CardHeader>
      <CardContent className="space-y-2">
        {/* "Senast kollad: ..." */}
        <Skeleton className="h-4 w-56" />
        {/* "Körs varje: ...h" */}
        <Skeleton className="h-4 w-32" />
      </CardContent>
      <CardFooter>
        {/* "Senast uppdaterad: ..." */}
        <Skeleton className="h-4 w-52" />
      </CardFooter>
    </Card>
  )
}
