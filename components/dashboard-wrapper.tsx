"use client"
import { useState } from "react"
import ScanChart from "@/components/scan-chart"
import IssuesList from "@/components/issues-list"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WebsiteDetail({
  websiteId,
  latestScanId,
}: {
  websiteId: string
  latestScanId: string
}) {
  const [selectedScanId, setSelectedScanId] = useState(latestScanId)

  return (
    <>
      <Card className="col-span-4 p-6">
        <CardTitle className="mb-4">Prestanda över tid</CardTitle>
        <div className="...">
          <ScanChart websiteId={websiteId} onScanClick={setSelectedScanId} />
        </div>
      </Card>
      <IssuesList scanId={selectedScanId} />
    </>
  )
}
