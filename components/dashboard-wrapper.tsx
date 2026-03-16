"use client"
import { useState } from "react"
import ScanChart from "@/components/scan-chart"
import IssuesList from "@/components/issues-list"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { parseAsStringEnum, useQueryState } from "nuqs"
import { Monitor, Smartphone } from "lucide-react"
import CoreWebVitals from "./core-web-vitals"

export default function WebsiteDetail({
  websiteId,
  latestScanId,
}: {
  websiteId: string
  latestScanId: string
}) {
  const [selectedScanId, setSelectedScanId] = useState(latestScanId)
  const [device, setDevice] = useQueryState(
    "device",
    parseAsStringEnum(["mobile", "desktop"]).withDefault("mobile")
  )

  return (
    <>
      <Card className="col-span-4 p-6">
        <CardHeader className="flex justify-between">
          <CardTitle className="mb-4">Prestanda över tid</CardTitle>
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
        </CardHeader>
        <div>
          <ScanChart websiteId={websiteId} onScanClick={setSelectedScanId} />
        </div>
      </Card>
      <IssuesList scanId={selectedScanId} />
      <CoreWebVitals scanId={selectedScanId} />
    </>
  )
}
