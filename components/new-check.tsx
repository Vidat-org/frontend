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
import { useT } from "next-i18next/client"
import { useRouter } from "next/navigation"

export default function NewCheck({
  websiteId,
  defaultDeviceType,
}: {
  websiteId: string
  defaultDeviceType: "mobile" | "desktop"
}) {
  const { t } = useT("common")
  const router = useRouter()
  const [urlDevice] = useQueryState(
    "device",
    parseAsStringEnum(["mobile", "desktop"]).withDefault("mobile")
  )
  const [onboarding] = useQueryState(
    "onboarding",
    parseAsStringEnum(["1"])
  )
  const [device, setDevice] = useState<"mobile" | "desktop">(defaultDeviceType)

  const [pollingSince, setPollingSince] = useQueryState(
    "scanning",
    parseAsIsoDateTime
  )

  const { data: latestScan } = useQuery({
    queryKey: ["latestScan", websiteId],
    queryFn: async () => await client.getLatestScan({ website: websiteId }),
    refetchInterval: pollingSince ? 6000 : false,
  })

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
      toast.success(t("newCheck.scanDone"))

      if (onboarding === "1") {
        router.push(`/dashboard/reports?onboarding=1&website=${websiteId}`)
      }
    }
  }, [
    latestScan,
    onboarding,
    pollingSince,
    router,
    setPollingSince,
    t,
    urlDevice,
    websiteId,
  ])

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (date: Date) =>
      await client.updateWebsiteNextCheck({ website: websiteId, date }),
    onSuccess: () => {
      setPollingSince(new Date())
    },
  })

  const isScanning = isPending || pollingSince !== null

  const { mutateAsync: updateDeviceType } = useMutation({
    mutationFn: async (nextDevice: "mobile" | "desktop") =>
      await client.updateWebsiteDeviceType({
        website: websiteId,
        device: nextDevice,
      }),
    onSuccess: (_, nextDevice) => {
      toast.success(
        nextDevice === "mobile"
          ? t("newCheck.deviceMobileActive")
          : t("newCheck.deviceDesktopActive")
      )
    },
  })

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full flex-col items-stretch justify-end gap-3 sm:flex-row sm:items-center">
        <Select
          value={device}
          onValueChange={async (value) => {
            const nextDevice = value as "mobile" | "desktop"
            setDevice(nextDevice)
            await updateDeviceType(nextDevice)
          }}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mobile">
              <span className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" /> {t("common.mobile")}
              </span>
            </SelectItem>
            <SelectItem value="desktop">
              <span className="flex items-center gap-2">
                <Monitor className="h-4 w-4" /> {t("common.desktop")}
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          disabled={isPending || isScanning}
          onClick={() => mutateAsync(new Date())}
          className="w-full sm:w-auto"
        >
          {(isPending || isScanning) && <Spinner />}
          {isPending || isScanning
            ? t("newCheck.scanning")
            : t("newCheck.newScan")}
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground sm:text-left">
        {device === "mobile"
          ? t("newCheck.mobileHint")
          : t("newCheck.desktopHint")}
      </p>
    </div>
  )
}
