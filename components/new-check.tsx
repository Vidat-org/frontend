"use client"

import { client } from "@/lib/orpc"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Monitor, Smartphone } from "lucide-react"
import { toast } from "sonner"
import { Spinner } from "./ui/spinner"
import { getQueryClient } from "@/lib/query-client"
import { parseAsIsoDateTime, parseAsStringEnum, useQueryState } from "nuqs"

export default function NewCheck({
  websiteId,
  defaultDeviceType,
}: {
  websiteId: string
  defaultDeviceType: "mobile" | "desktop"
}) {
  const [urlDevice, setUrlDevice] = useQueryState(
    "device",
    parseAsStringEnum(["mobile", "desktop"]).withDefault("mobile")
  )
  const [device, setDevice] = useState<"mobile" | "desktop">(defaultDeviceType)

  const [pollingSince, setPollingSince] = useQueryState(
    "scanning",
    parseAsIsoDateTime
  )

  // Poll for new scan
  const { data: latestScan } = useQuery({
    queryKey: ["latestScan", websiteId],
    queryFn: async () => await client.getLatestScan({ website: websiteId }),
    refetchInterval: pollingSince ? 3000 : false,
  })

  // Stop polling when a fresh scan arrives
  useEffect(() => {
    if (
      pollingSince &&
      latestScan?.createdAt &&
      new Date(latestScan.createdAt) > pollingSince
    ) {
      setPollingSince(null)
      getQueryClient().invalidateQueries({
        queryKey: ["scans", websiteId, urlDevice],
      })
      // getQueryClient().invalidateQueries({
      //   queryKey: ["scan", latestScan.id],
      // })
      toast.success("Skanning klar!")
    }
  }, [latestScan, pollingSince])

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (date: Date) =>
      await client.updateWebsiteNextCheck({ website: websiteId, date }),
    onSuccess: () => {
      setPollingSince(new Date())
    },
  })

  const isScanning = isPending || pollingSince !== null

  const { mutateAsync: updateDeviceType } = useMutation({
    mutationFn: async (device: "mobile" | "desktop") =>
      await client.updateWebsiteDeviceType({ website: websiteId, device }),
    onSuccess: (_, device) => {
      toast.success(
        device === "mobile"
          ? "Skanning sker nu som mobil"
          : "Skanning sker nu som dator"
      )
    },
  })

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-3">
        <Select
          value={device}
          onValueChange={async (v) => {
            const newDevice = v as "mobile" | "desktop"
            setDevice(newDevice)
            await updateDeviceType(newDevice)
          }}
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

        <Button
          disabled={isPending || isScanning}
          onClick={() => mutateAsync(new Date())}
        >
          {isPending || (isScanning && <Spinner />)}
          {isPending || isScanning ? "Skannar" : "Ny skanning"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {device === "mobile"
          ? "Mobil är standard — Google indexerar primärt din sida som mobilanvändare."
          : "Datorskanning mäter prestanda för besökare på större skärmar."}
      </p>
    </div>
  )
}
