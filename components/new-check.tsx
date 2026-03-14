"use client"

import { client } from "@/lib/orpc"
import { useMutation } from "@tanstack/react-query"
import { Button } from "./ui/button"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Monitor, Smartphone } from "lucide-react"

export default function NewCheck({ websiteId }: { websiteId: string }) {
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile")

  const handleCheck = () => {
    // trigger your scan with `device` value
  }

  const { mutateAsync } = useMutation({
    mutationFn: async (date: Date) =>
      await client.updateWebsiteNextCheck({ website: websiteId, date }),
  })

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-3">
        <Select
          value={device}
          onValueChange={(v) => setDevice(v as "mobile" | "desktop")}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mobile">
              <span className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" /> Mobil
              </span>
            </SelectItem>
            <SelectItem value="desktop">
              <span className="flex items-center gap-2">
                <Monitor className="h-4 w-4" /> Dator
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => mutateAsync(new Date())}>Ny skanning</Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {device === "mobile"
          ? "Mobil är standard — Google indexerar primärt din sida som mobilanvändare."
          : "Datorskanning mäter prestanda för besökare på större skärmar."}
      </p>
    </div>
  )
}
