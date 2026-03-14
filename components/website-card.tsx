"use client"
import {
  Card,
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
  if (!website.isEnabled) {
    return (
      <div className="cursor-not-allowed">
        <Card className="pointer-events-none border-dashed opacity-50 grayscale select-none">
          <CardHeader>
            <CardTitle className="truncate text-muted-foreground">
              {website.url}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Senast kollad:{" "}
              {website.lastCheckedAt
                ? new Date(website.lastCheckedAt).toDateString()
                : "Aldrig"}
            </p>
            <p className="text-muted-foreground">
              Körs varje: {website.intervalSeconds / 60 / 60}h
            </p>
          </CardContent>
          <CardFooter>
            <p className="text-muted-foreground">
              Senast uppdaterad:{" "}
              {new Date(website.createdAt || "").toDateString()}
            </p>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <Link href={`/dashboard/${website.id}`}>
      <Card>
        <CardHeader>
          <CardTitle className="truncate">{website.url}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Senast kollad:{" "}
            {website.lastCheckedAt
              ? new Date(website.lastCheckedAt).toDateString()
              : "Aldrig"}
          </p>
          <p>Körs varje: {website.intervalSeconds / 60 / 60}h</p>
        </CardContent>
        <CardFooter>
          <p>
            Senast uppdaterad:{" "}
            {new Date(website.createdAt || "").toDateString()}
          </p>
        </CardFooter>
      </Card>
    </Link>
  )
}

export function WebsiteCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-48" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-4 w-32" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-52" />
      </CardFooter>
    </Card>
  )
}
