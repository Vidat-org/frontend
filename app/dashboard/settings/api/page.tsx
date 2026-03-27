import SettingsCenter from "@/components/settings-center"

export default function Page() {
  return (
    <div className="space-y-4">
      <SettingsCenter section="api" />
      <div className="rounded-[1.5rem] border bg-card p-6">
        <h2 className="text-lg font-semibold tracking-tight">REST API</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Autentisera med <code>Authorization: Bearer &lt;api_key&gt;</code> eller
          <code> x-api-key</code>.
        </p>
        <div className="mt-4 space-y-2 font-mono text-xs text-muted-foreground">
          <p>GET /api/v1/workspaces/current</p>
          <p>GET /api/v1/websites</p>
          <p>GET /api/v1/websites/:id/scans/latest</p>
        </div>
      </div>
    </div>
  )
}
