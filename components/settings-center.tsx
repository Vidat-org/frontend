"use client"

import Link from "next/link"
import { useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { client } from "@/lib/orpc"
import { getQueryClient } from "@/lib/query-client"
import { t } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Bell,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  History,
  KeyRound,
  LifeBuoy,
  MailPlus,
  Rocket,
  Trash2,
  Users,
  Webhook,
  X,
} from "lucide-react"

const webhookEvents = ["scan.failed", "score.regression", "report.ready"] as const
const billingStatuses = [
  "trialing",
  "active",
  "past_due",
  "canceled",
  "incomplete",
] as const
const dunningStatuses = ["clear", "at_risk", "in_dunning", "write_off"] as const

type BillingFormState = {
  provider: string
  planSlug: string
  status: string
  amountSek: number
  dunningStatus: string
  checkoutUrl: string
  portalUrl: string
  lastInvoiceUrl: string
}

type SupportFormState = {
  subject: string
  priority: "low" | "normal" | "high" | "urgent"
  category: "support" | "billing" | "security" | "success"
  message: string
}

export type SettingsSection =
  | "all"
  | "billing"
  | "notifications"
  | "team"
  | "integrations"
  | "api"
  | "support"
  | "logs"

export default function SettingsCenter({
  section = "all",
}: {
  section?: SettingsSection
}) {
  const router = useRouter()
  const accountQuery = useQuery({
    queryKey: ["accountSummary"],
    queryFn: async () => client.getAccountSummary(),
  })
  const webhooksQuery = useQuery({
    queryKey: ["webhookDestinations"],
    queryFn: async () => client.listWebhookDestinations(),
  })
  const workspaceQuery = useQuery({
    queryKey: ["workspaceMembers"],
    queryFn: async () => client.listWorkspaceMembers(),
  })
  const auditQuery = useQuery({
    queryKey: ["auditLogs"],
    queryFn: async () => client.listAuditLogs(),
  })
  const deliveriesQuery = useQuery({
    queryKey: ["notificationDeliveries"],
    queryFn: async () => client.listNotificationDeliveries(),
  })
  const onboardingQuery = useQuery({
    queryKey: ["onboardingState"],
    queryFn: async () => client.getOnboardingState(),
  })
  const apiKeysQuery = useQuery({
    queryKey: ["apiKeys"],
    queryFn: async () => client.listApiKeys(),
  })
  const supportQuery = useQuery({
    queryKey: ["supportRequests"],
    queryFn: async () => client.listSupportRequests(),
  })
  const userWorkspacesQuery = useQuery({
    queryKey: ["userWorkspaces"],
    queryFn: async () => client.listUserWorkspaces(),
  })
  const pendingInvitesQuery = useQuery({
    queryKey: ["pendingInvites"],
    queryFn: async () => client.listPendingInvites(),
  })

  const [settingsForm, setSettingsForm] = useState({
    emailAlerts: undefined as boolean | undefined,
    weeklyDigest: undefined as boolean | undefined,
    productUpdates: undefined as boolean | undefined,
    billingEmails: undefined as boolean | undefined,
    notifyOnScanFailure: undefined as boolean | undefined,
    notifyOnScoreDrop: undefined as boolean | undefined,
    scoreDropThreshold: undefined as number | undefined,
    slackWebhookUrl: undefined as string | undefined,
  })
  const [webhookForm, setWebhookForm] = useState({
    label: "",
    url: "",
    eventTypes: ["scan.failed", "score.regression"] as string[],
    secret: "",
  })
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "member" as "admin" | "member",
  })
  const [billingForm, setBillingForm] = useState<BillingFormState | null>(null)
  const [apiKeyLabel, setApiKeyLabel] = useState("")
  const [latestApiKey, setLatestApiKey] = useState<string | null>(null)
  const [supportForm, setSupportForm] = useState<SupportFormState>({
    subject: "",
    priority: "normal",
    category: "support",
    message: "",
  })

  const saveSettings = useMutation({
    mutationFn: async () =>
      client.updateNotificationSettings({
        emailAlerts: resolvedSettings.emailAlerts,
        weeklyDigest: resolvedSettings.weeklyDigest,
        productUpdates: resolvedSettings.productUpdates,
        billingEmails: resolvedSettings.billingEmails,
        notifyOnScanFailure: resolvedSettings.notifyOnScanFailure,
        notifyOnScoreDrop: resolvedSettings.notifyOnScoreDrop,
        scoreDropThreshold: Number(resolvedSettings.scoreDropThreshold),
        slackWebhookUrl: resolvedSettings.slackWebhookUrl,
      }),
    onSuccess: () => {
      invalidateAccountViews()
      toast.success(t("settingsCenter.settingsSaved"))
    },
    onError: () => toast.error(t("settingsCenter.saveSettingsFailed")),
  })

  const createWebhook = useMutation({
    mutationFn: async () =>
      client.createWebhookDestination({
        label: webhookForm.label,
        url: webhookForm.url,
        eventTypes: webhookForm.eventTypes as Array<
          "scan.failed" | "score.regression" | "report.ready"
        >,
        secret: webhookForm.secret,
      }),
    onSuccess: () => {
      setWebhookForm({
        label: "",
        url: "",
        eventTypes: ["scan.failed", "score.regression"],
        secret: "",
      })
      invalidateAccountViews()
      toast.success(t("settingsCenter.webhookAdded"))
    },
  })

  const toggleWebhook = useMutation({
    mutationFn: async (payload: {
      id: string
      label: string
      url: string
      eventTypes: string[]
      secret: string
      isEnabled: boolean
    }) =>
      client.updateWebhookDestination({
        ...payload,
        eventTypes: payload.eventTypes as Array<
          "scan.failed" | "score.regression" | "report.ready"
        >,
      }),
    onSuccess: () => invalidateAccountViews(),
  })

  const deleteWebhook = useMutation({
    mutationFn: async (id: string) => client.deleteWebhookDestination({ id }),
    onSuccess: () => {
      invalidateAccountViews()
      toast.success(t("settingsCenter.webhookDeleted"))
    },
  })

  const createInvite = useMutation({
    mutationFn: async () =>
      client.createWorkspaceInvite({
        email: inviteForm.email,
        role: inviteForm.role,
      }),
    onSuccess: () => {
      setInviteForm({ email: "", role: "member" })
      invalidateAccountViews()
      toast.success(t("settingsCenter.inviteCreated"))
    },
  })

  const revokeInvite = useMutation({
    mutationFn: async (inviteId: string) => client.revokeWorkspaceInvite({ inviteId }),
    onSuccess: () => {
      invalidateAccountViews()
      toast.success(t("settingsCenter.inviteRevoked"))
    },
  })

  const switchWorkspace = useMutation({
    mutationFn: async (workspaceId: string) => client.switchActiveWorkspace({ workspaceId }),
    onSuccess: () => {
      invalidateAccountViews()
      router.push("/dashboard")
      router.refresh()
      toast.success(t("settingsCenter.workspaceSwitched"))
    },
  })
  const acceptInvite = useMutation({
    mutationFn: async (inviteId: string) => client.acceptWorkspaceInvite({ inviteId }),
    onSuccess: () => {
      invalidateAccountViews()
      router.push("/dashboard")
      router.refresh()
      toast.success(t("settingsCenter.inviteAccepted"))
    },
  })
  const declineInvite = useMutation({
    mutationFn: async (inviteId: string) => client.declineWorkspaceInvite({ inviteId }),
    onSuccess: () => {
      invalidateAccountViews()
      toast.success(t("settingsCenter.inviteDeclined"))
    },
  })
  const updateMemberRole = useMutation({
    mutationFn: async (payload: { memberId: string; role: "admin" | "member" }) =>
      client.updateWorkspaceMemberRole(payload),
    onSuccess: () => {
      invalidateAccountViews()
      toast.success(t("settingsCenter.memberRoleUpdated"))
    },
  })
  const removeMember = useMutation({
    mutationFn: async (memberId: string) => client.removeWorkspaceMember({ memberId }),
    onSuccess: () => {
      invalidateAccountViews()
      toast.success(t("settingsCenter.memberRemoved"))
    },
  })

  const saveBilling = useMutation({
    mutationFn: async () =>
      client.updateBillingState({
        provider: resolvedBilling.provider,
        providerCustomerId: null,
        providerSubscriptionId: null,
        planSlug: resolvedBilling.planSlug as
          | "free_user"
          | "starter"
          | "pro"
          | "enterprise",
        status: resolvedBilling.status as
          | "trialing"
          | "active"
          | "past_due"
          | "canceled"
          | "incomplete",
        amountSek: Number(resolvedBilling.amountSek),
        dunningStatus: resolvedBilling.dunningStatus as
          | "clear"
          | "at_risk"
          | "in_dunning"
          | "write_off",
        currentPeriodEndsAt: null,
        trialEndsAt: null,
        cancelAtPeriodEnd: false,
        checkoutUrl: resolvedBilling.checkoutUrl,
        portalUrl: resolvedBilling.portalUrl,
        lastInvoiceUrl: resolvedBilling.lastInvoiceUrl,
      }),
    onSuccess: () => {
      invalidateAccountViews()
      toast.success(t("settingsCenter.billingUpdated"))
    },
  })

  const updateOnboarding = useMutation({
    mutationFn: async (step: {
      key:
        | "hasAddedWebsite"
        | "hasRunFirstScan"
        | "hasViewedReport"
        | "hasConfiguredAlerts"
        | "hasConnectedIntegration"
      completed: boolean
    }) => client.updateOnboardingStep({ step: step.key, completed: step.completed }),
    onSuccess: () => invalidateAccountViews(),
  })
  const createApiKey = useMutation({
    mutationFn: async () => client.createApiKey({ label: apiKeyLabel }),
    onSuccess: (data) => {
      setLatestApiKey(data.plainTextKey)
      setApiKeyLabel("")
      invalidateAccountViews()
      toast.success(t("settingsCenter.apiKeyCreated"))
    },
  })
  const revokeApiKey = useMutation({
    mutationFn: async (id: string) => client.revokeApiKey({ id }),
    onSuccess: () => {
      invalidateAccountViews()
      toast.success(t("settingsCenter.apiKeyRevoked"))
    },
  })
  const createSupportRequest = useMutation({
    mutationFn: async () =>
      client.createSupportRequest({
        subject: supportForm.subject,
        priority: supportForm.priority,
        category: supportForm.category,
        message: supportForm.message,
      }),
    onSuccess: () => {
      setSupportForm({
        subject: "",
        priority: "normal",
        category: "support",
        message: "",
      })
      invalidateAccountViews()
      toast.success(t("settingsCenter.supportRequestCreated"))
    },
  })

  const account = accountQuery.data
  if (!account || accountQuery.isLoading) {
    return <div className="text-sm text-muted-foreground">{t("settingsCenter.loading")}</div>
  }

  const workspace = workspaceQuery.data
  const auditLogs = auditQuery.data ?? []
  const deliveries = deliveriesQuery.data ?? []
  const onboarding = onboardingQuery.data
  const webhooks = webhooksQuery.data ?? []
  const apiKeys = apiKeysQuery.data ?? []
  const supportRequests = supportQuery.data ?? []
  const userWorkspaces = userWorkspacesQuery.data ?? []
  const pendingInvites = pendingInvitesQuery.data ?? []
  const isAdmin = account.workspace.role === "owner" || account.workspace.role === "admin"
  const isOwner = account.workspace.role === "owner"
  const showSection = (...sections: SettingsSection[]) =>
    section === "all" || sections.includes(section)

  const resolvedSettings = {
    emailAlerts: settingsForm.emailAlerts ?? account.settings.emailAlerts,
    weeklyDigest: settingsForm.weeklyDigest ?? account.settings.weeklyDigest,
    productUpdates: settingsForm.productUpdates ?? account.settings.productUpdates,
    billingEmails: settingsForm.billingEmails ?? account.settings.billingEmails,
    notifyOnScanFailure:
      settingsForm.notifyOnScanFailure ?? account.settings.notifyOnScanFailure,
    notifyOnScoreDrop:
      settingsForm.notifyOnScoreDrop ?? account.settings.notifyOnScoreDrop,
    scoreDropThreshold:
      settingsForm.scoreDropThreshold ?? account.settings.scoreDropThreshold,
    slackWebhookUrl:
      settingsForm.slackWebhookUrl ?? account.settings.slackWebhookUrl ?? "",
  }

  const resolvedBilling =
    billingForm ??
    ({
      provider: account.billing.provider ?? "manual",
      planSlug: account.rawPlan,
      status: account.billing.status,
      amountSek: account.billing.amountSek,
      dunningStatus: account.billing.dunningStatus,
      checkoutUrl:
        account.billing.checkout[
          account.billing.recommendedUpgrade as keyof typeof account.billing.checkout
        ] ?? "",
      portalUrl: account.billing.manageUrl ?? "",
      lastInvoiceUrl: account.billing.lastInvoiceUrl ?? "",
    } satisfies BillingFormState)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{t("settingsCenter.accountEyebrow")}</p>
          <h1 className="text-3xl font-bold tracking-tight">{t("settingsCenter.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("settingsCenter.subtitle")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{account.workspace.name}</Badge>
          <Badge variant="outline">{account.plan.label}</Badge>
        </div>
      </div>
      {showSection("all") ? (
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Workspace"
          value={account.workspace.memberCount.toString()}
          description={t("settingsCenter.activeMembers")}
        />
        <StatCard
          title="Onboarding"
          value={`${account.onboarding.completedSteps}/${account.onboarding.totalSteps}`}
          description={t("settingsCenter.stepsDone")}
        />
        <StatCard
          title={t("settingsCenter.notifications")}
          value={String(account.notifications.sent)}
          description={t("settingsCenter.failedCount", { count: account.notifications.failed })}
        />
        <StatCard
          title="Billing"
          value={account.billing.status}
          description={account.billing.dunningStatus}
        />
      </div>
      ) : null}

      {showSection("billing") ? (
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {t("settingsCenter.billingTitle")}
            </CardTitle>
            <CardDescription>
              {t("settingsCenter.billingDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Field>
                <FieldLabel>{t("settingsCenter.provider")}</FieldLabel>
                <Input
                  value={resolvedBilling.provider}
                  onChange={(e) =>
                    setBillingForm((prev) => ({
                      ...(prev ?? resolvedBilling),
                      provider: e.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel>{t("settingsCenter.monthlyAmount")}</FieldLabel>
                <Input
                  type="number"
                  value={resolvedBilling.amountSek}
                  onChange={(e) =>
                    setBillingForm((prev) => ({
                      ...(prev ?? resolvedBilling),
                      amountSek: Number(e.target.value),
                    }))
                  }
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>{t("settingsCenter.plan")}</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {(["free_user", "starter", "pro", "enterprise"] as const).map((plan) => (
                  <Button
                    key={plan}
                    type="button"
                    size="sm"
                    variant={resolvedBilling.planSlug === plan ? "default" : "outline"}
                    onClick={() =>
                      setBillingForm((prev) => ({
                        ...(prev ?? resolvedBilling),
                        planSlug: plan,
                      }))
                    }
                  >
                    {plan}
                  </Button>
                ))}
              </div>
            </Field>
            <Field>
              <FieldLabel>Status</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {billingStatuses.map((status) => (
                  <Button
                    key={status}
                    type="button"
                    size="sm"
                    variant={resolvedBilling.status === status ? "default" : "outline"}
                    onClick={() =>
                      setBillingForm((prev) => ({
                        ...(prev ?? resolvedBilling),
                        status,
                      }))
                    }
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </Field>
            <Field>
              <FieldLabel>Dunning</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {dunningStatuses.map((status) => (
                  <Button
                    key={status}
                    type="button"
                    size="sm"
                    variant={
                      resolvedBilling.dunningStatus === status ? "default" : "outline"
                    }
                    onClick={() =>
                      setBillingForm((prev) => ({
                        ...(prev ?? resolvedBilling),
                        dunningStatus: status,
                      }))
                    }
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </Field>
            <div className="grid gap-3 md:grid-cols-2">
              <Field>
                <FieldLabel>Portal-URL</FieldLabel>
                <Input
                  value={resolvedBilling.portalUrl}
                  onChange={(e) =>
                    setBillingForm((prev) => ({
                      ...(prev ?? resolvedBilling),
                      portalUrl: e.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Checkout-URL</FieldLabel>
                <Input
                  value={resolvedBilling.checkoutUrl}
                  onChange={(e) =>
                    setBillingForm((prev) => ({
                      ...(prev ?? resolvedBilling),
                      checkoutUrl: e.target.value,
                    }))
                  }
                />
              </Field>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground">
              {account.billing.manageUrl ? (
                <Link
                  href={account.billing.manageUrl}
                  target="_blank"
                  className="inline-flex items-center gap-1 underline underline-offset-4"
                >
                  Öppna billing-portal <ExternalLink className="h-3 w-3" />
                </Link>
              ) : (
                "Ingen billing-portal konfigurerad."
              )}
            </div>
            <Button disabled={!isAdmin || saveBilling.isPending} onClick={() => saveBilling.mutate()}>
              Spara billing
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Onboarding
            </CardTitle>
            <CardDescription>
              Håll koll på första värde-stegen för workspacet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <OnboardingRow
              label="Lagt till första webbplats"
              checked={onboarding?.hasAddedWebsite ?? account.onboarding.hasAddedWebsite}
              onToggle={(completed) =>
                updateOnboarding.mutate({ key: "hasAddedWebsite", completed })
              }
            />
            <OnboardingRow
              label="Första scan körd"
              checked={onboarding?.hasRunFirstScan ?? account.onboarding.hasRunFirstScan}
              onToggle={(completed) =>
                updateOnboarding.mutate({ key: "hasRunFirstScan", completed })
              }
            />
            <OnboardingRow
              label="Rapport öppnad"
              checked={onboarding?.hasViewedReport ?? account.onboarding.hasViewedReport}
              onToggle={(completed) =>
                updateOnboarding.mutate({ key: "hasViewedReport", completed })
              }
            />
            <OnboardingRow
              label="Alerts konfigurerade"
              checked={
                onboarding?.hasConfiguredAlerts ??
                account.onboarding.hasConfiguredAlerts
              }
              onToggle={(completed) =>
                updateOnboarding.mutate({ key: "hasConfiguredAlerts", completed })
              }
            />
            <OnboardingRow
              label="Integration ansluten"
              checked={
                onboarding?.hasConnectedIntegration ??
                account.onboarding.hasConnectedIntegration
              }
              onToggle={(completed) =>
                updateOnboarding.mutate({ key: "hasConnectedIntegration", completed })
              }
            />
            <div className="rounded-xl border p-4">
              <p className="text-sm font-medium">REST API</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Använd `Authorization: Bearer &lt;api_key&gt;` eller `x-api-key`.
              </p>
              <div className="mt-3 space-y-2 font-mono text-xs text-muted-foreground">
                <p>GET /api/v1/workspaces/current</p>
                <p>GET /api/v1/websites</p>
                <p>GET /api/v1/websites/:id/scans/latest</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      ) : null}

      {showSection("notifications", "team") ? (
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        {showSection("notifications") ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifieringar
            </CardTitle>
            <CardDescription>
              Styr vilka händelser som ska skickas och till vilka kanaler.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGroup>
              <ToggleRow
                label="E-postaviseringar"
                description="Skicka kritiska drift- och regressionsnotiser via e-post."
                checked={resolvedSettings.emailAlerts}
                onToggle={() =>
                  setSettingsForm((prev) => ({
                    ...prev,
                    emailAlerts: !resolvedSettings.emailAlerts,
                  }))
                }
              />
              <ToggleRow
                label="Scan failure alerts"
                description="Notis när en skanning misslyckas eller timeoutar."
                checked={resolvedSettings.notifyOnScanFailure}
                onToggle={() =>
                  setSettingsForm((prev) => ({
                    ...prev,
                    notifyOnScanFailure: !resolvedSettings.notifyOnScanFailure,
                  }))
                }
              />
              <ToggleRow
                label="Score drop alerts"
                description="Notis när resultatet faller under vald tröskel."
                checked={resolvedSettings.notifyOnScoreDrop}
                onToggle={() =>
                  setSettingsForm((prev) => ({
                    ...prev,
                    notifyOnScoreDrop: !resolvedSettings.notifyOnScoreDrop,
                  }))
                }
              />
              <Field>
                <FieldLabel>Tröskel för poängfall</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={resolvedSettings.scoreDropThreshold}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({
                      ...prev,
                      scoreDropThreshold: Number(e.target.value),
                    }))
                  }
                />
                <FieldDescription>
                  Antal poäng som måste tappas innan regression skickas.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Slack webhook URL</FieldLabel>
                <Input
                  placeholder="https://hooks.slack.com/services/..."
                  value={resolvedSettings.slackWebhookUrl}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({
                      ...prev,
                      slackWebhookUrl: e.target.value,
                    }))
                  }
                />
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={() => saveSettings.mutate()} disabled={saveSettings.isPending}>
              Spara inställningar
            </Button>
          </CardFooter>
        </Card>
        ) : null}

        {showSection("team") ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team och invites
            </CardTitle>
            <CardDescription>
              Lägg till admins och medlemmar i samma workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Dina workspaces</p>
              {userWorkspaces.map((entry) => (
                <div
                  key={entry.workspaceId}
                  className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.role} · {entry.plan.label}
                    </p>
                  </div>
                  {entry.isActive ? (
                    <Badge variant="success">Aktiv</Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={switchWorkspace.isPending}
                      onClick={() => switchWorkspace.mutate(entry.workspaceId)}
                    >
                      Byt workspace
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {pendingInvites.length > 0 ? (
              <div className="space-y-2 rounded-xl border border-chart-1/20 bg-chart-1/5 p-4">
                <p className="text-sm font-medium">Väntande inbjudningar</p>
                {pendingInvites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{invite.workspaceName}</p>
                      <p className="text-xs text-muted-foreground">
                        {invite.role} · giltig till {formatStamp(invite.expiresAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={acceptInvite.isPending}
                        onClick={() => acceptInvite.mutate(invite.id)}
                      >
                        Acceptera
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={declineInvite.isPending}
                        onClick={() => declineInvite.mutate(invite.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="space-y-2">
              {(workspace?.members ?? []).map((member) => (
                <div key={member.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">
                        {member.email || member.clerkUserId}
                      </p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.role !== "owner" && isOwner ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={updateMemberRole.isPending}
                          onClick={() =>
                            updateMemberRole.mutate({
                              memberId: member.id,
                              role: member.role === "admin" ? "member" : "admin",
                            })
                          }
                        >
                          {member.role === "admin" ? "Gör medlem" : "Gör admin"}
                        </Button>
                      ) : null}
                      {member.role !== "owner" && isAdmin ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          disabled={removeMember.isPending}
                          onClick={() => removeMember.mutate(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border p-4">
              <div className="grid gap-3">
                <Field>
                  <FieldLabel>E-post</FieldLabel>
                  <Input
                    placeholder="teammedlem@bolag.se"
                    value={inviteForm.email}
                    onChange={(e) =>
                      setInviteForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel>Roll</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {(["member", "admin"] as const).map((role) => (
                      <Button
                        key={role}
                        type="button"
                        size="sm"
                        variant={inviteForm.role === role ? "default" : "outline"}
                        onClick={() =>
                          setInviteForm((prev) => ({ ...prev, role }))
                        }
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                </Field>
                <Button
                  variant="outline"
                  disabled={!isAdmin || !inviteForm.email || createInvite.isPending}
                  onClick={() => createInvite.mutate()}
                >
                  <MailPlus className="h-4 w-4" />
                  Skicka inbjudan
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {(workspace?.invites ?? []).map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{invite.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {invite.role} · {invite.status}
                    </p>
                  </div>
                  {invite.status === "pending" ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={!isAdmin}
                      onClick={() => revokeInvite.mutate(invite.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Badge variant="outline">{invite.status}</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        ) : null}
      </div>
      ) : null}
      {showSection("integrations") ? (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Webhook-destinationer
          </CardTitle>
          <CardDescription>
            Skicka händelser till externa system med historik i driftloggen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3 md:grid-cols-2">
            <Field>
              <FieldLabel>Namn</FieldLabel>
              <Input
                placeholder="Ops webhook"
                value={webhookForm.label}
                onChange={(e) =>
                  setWebhookForm((prev) => ({ ...prev, label: e.target.value }))
                }
              />
            </Field>
            <Field>
              <FieldLabel>URL</FieldLabel>
              <Input
                placeholder="https://example.com/hooks/vidat"
                value={webhookForm.url}
                onChange={(e) =>
                  setWebhookForm((prev) => ({ ...prev, url: e.target.value }))
                }
              />
            </Field>
          </div>
          <Field>
            <FieldLabel>Händelser</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {webhookEvents.map((eventType) => {
                const checked = webhookForm.eventTypes.includes(eventType)
                return (
                  <Button
                    key={eventType}
                    type="button"
                    size="sm"
                    variant={checked ? "default" : "outline"}
                    onClick={() =>
                      setWebhookForm((prev) => ({
                        ...prev,
                        eventTypes: checked
                          ? prev.eventTypes.filter((item) => item !== eventType)
                          : [...prev.eventTypes, eventType],
                      }))
                    }
                  >
                    {eventType}
                  </Button>
                )
              })}
            </div>
          </Field>
          <div className="flex justify-start sm:justify-end">
            <Button
              onClick={() => createWebhook.mutate()}
              disabled={
                createWebhook.isPending ||
                !webhookForm.label ||
                !webhookForm.url ||
                webhookForm.eventTypes.length === 0
              }
            >
              Lägg till webhook
            </Button>
          </div>
          <div className="space-y-3">
            {webhooks.map((webhook) => {
              const eventTypes = webhook.eventTypes.split(",").filter(Boolean)
              return (
                <div
                  key={webhook.id}
                  className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-start md:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{webhook.label}</p>
                      <Badge variant={webhook.isEnabled ? "success" : "outline"}>
                        {webhook.isEnabled ? "Aktiv" : "Pausad"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{webhook.url}</p>
                    <div className="flex flex-wrap gap-2">
                      {eventTypes.map((eventType) => (
                        <Badge key={eventType} variant="outline">
                          {eventType}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toggleWebhook.mutate({
                          id: webhook.id,
                          label: webhook.label,
                          url: webhook.url,
                          eventTypes,
                          secret: webhook.secret ?? "",
                          isEnabled: !webhook.isEnabled,
                        })
                      }
                    >
                      {webhook.isEnabled ? "Pausa" : "Aktivera"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteWebhook.mutate(webhook.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      ) : null}

      {showSection("api", "support") ? (
      <div className="grid gap-4 xl:grid-cols-2">
        {showSection("api") ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              API-nycklar
            </CardTitle>
            <CardDescription>
              Skapa och återkalla nycklar för integrationer och framtida API-anrop.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestApiKey ? (
              <div className="rounded-lg border border-chart-1/30 bg-chart-1/5 p-3">
                <p className="text-sm font-medium">Nyckeln visas bara en gång</p>
                <p className="mt-1 break-all font-mono text-xs">{latestApiKey}</p>
              </div>
            ) : null}
            <div className="flex gap-3">
              <Input
                placeholder="Production integration"
                value={apiKeyLabel}
                onChange={(e) => setApiKeyLabel(e.target.value)}
              />
              <Button
                disabled={!isAdmin || !apiKeyLabel || createApiKey.isPending}
                onClick={() => createApiKey.mutate()}
              >
                Skapa nyckel
              </Button>
            </div>
            <div className="space-y-2">
              {apiKeys.length === 0 ? (
                <p className="text-sm text-muted-foreground">Inga API-nycklar ännu.</p>
              ) : (
                apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{key.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {key.keyPrefix}... · {key.revokedAt ? "återkallad" : "aktiv"}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={!isAdmin || Boolean(key.revokedAt)}
                      onClick={() => revokeApiKey.mutate(key.id)}
                    >
                      Återkalla
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        ) : null}

        {showSection("support") ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LifeBuoy className="h-4 w-4" />
              Supportärenden
            </CardTitle>
            <CardDescription>
              Skapa ärenden för support, billing, security eller success.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Input
                placeholder="Ämne"
                value={supportForm.subject}
                onChange={(e) =>
                  setSupportForm((prev) => ({ ...prev, subject: e.target.value }))
                }
              />
              <div className="flex flex-wrap gap-2">
                {(["support", "billing", "security", "success"] as const).map((category) => (
                  <Button
                    key={category}
                    type="button"
                    size="sm"
                    variant={supportForm.category === category ? "default" : "outline"}
                    onClick={() =>
                      setSupportForm((prev) => ({ ...prev, category }))
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {(["low", "normal", "high", "urgent"] as const).map((priority) => (
                  <Button
                    key={priority}
                    type="button"
                    size="sm"
                    variant={supportForm.priority === priority ? "default" : "outline"}
                    onClick={() =>
                      setSupportForm((prev) => ({ ...prev, priority }))
                    }
                  >
                    {priority}
                  </Button>
                ))}
              </div>
              <Textarea
                placeholder="Beskriv problemet eller önskemålet"
                value={supportForm.message}
                onChange={(e) =>
                  setSupportForm((prev) => ({ ...prev, message: e.target.value }))
                }
              />
              <Button
                disabled={
                  createSupportRequest.isPending ||
                  !supportForm.subject ||
                  supportForm.message.length < 10
                }
                onClick={() => createSupportRequest.mutate()}
              >
                Skapa supportärende
              </Button>
            </div>
            <div className="space-y-2">
              {supportRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">Inga supportärenden ännu.</p>
              ) : (
                supportRequests.map((request) => (
                  <div key={request.id} className="rounded-lg border p-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium">{request.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {request.category} · {request.priority} · {request.status}
                        </p>
                      </div>
                      <Badge variant="outline">{request.status}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        ) : null}
      </div>
      ) : null}

      {showSection("logs") ? (
      <div className="grid gap-4 xl:grid-cols-2">
        <LogCard
          icon={<History className="h-4 w-4" />}
          title="Audit log"
          description="Senaste administrativa och operativa händelserna."
          items={auditLogs.map((item) => ({
            id: item.id,
            title: item.summary,
            meta: `${item.action} · ${formatStamp(item.createdAt)}`,
            tone: "neutral" as const,
          }))}
        />
        <LogCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          title="Leveranslogg"
          description="Historik över notifieringar och integrationsleveranser."
          items={deliveries.map((item) => ({
            id: item.id,
            title: `${item.channel} → ${item.destination}`,
            meta: `${item.eventType} · ${item.status} · ${formatStamp(item.createdAt)}`,
            tone: item.status === "failed" ? ("danger" as const) : ("success" as const),
          }))}
        />
      </div>
      ) : null}
    </div>
  )
}

function invalidateAccountViews() {
  const qc = getQueryClient()
  qc.invalidateQueries({ queryKey: ["accountSummary"] })
  qc.invalidateQueries({ queryKey: ["dashboardOverview"] })
  qc.invalidateQueries({ queryKey: ["webhookDestinations"] })
  qc.invalidateQueries({ queryKey: ["workspaceMembers"] })
  qc.invalidateQueries({ queryKey: ["auditLogs"] })
  qc.invalidateQueries({ queryKey: ["notificationDeliveries"] })
  qc.invalidateQueries({ queryKey: ["onboardingState"] })
  qc.invalidateQueries({ queryKey: ["apiKeys"] })
  qc.invalidateQueries({ queryKey: ["supportRequests"] })
  qc.invalidateQueries({ queryKey: ["userWorkspaces"] })
  qc.invalidateQueries({ queryKey: ["pendingInvites"] })
}

function formatStamp(value: string | null | undefined) {
  if (!value) return "okänd tid"
  return new Date(value).toLocaleString("sv-SE", {
    dateStyle: "short",
    timeStyle: "short",
  })
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle>{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onToggle,
}: {
  label: string
  description: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button type="button" variant={checked ? "default" : "outline"} onClick={onToggle}>
        {checked ? "På" : "Av"}
      </Button>
    </div>
  )
}

function OnboardingRow({
  label,
  checked,
  onToggle,
}: {
  label: string
  checked: boolean
  onToggle: (next: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium">{label}</p>
      <Button
        type="button"
        size="sm"
        variant={checked ? "default" : "outline"}
        onClick={() => onToggle(!checked)}
      >
        {checked ? "Klar" : "Markera"}
      </Button>
    </div>
  )
}

function LogCard({
  icon,
  title,
  description,
  items,
}: {
  icon: ReactNode
  title: string
  description: string
  items: Array<{
    id: string
    title: string
    meta: string
    tone: "neutral" | "danger" | "success"
  }>
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Inga poster ännu.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-lg border p-3">
              <p className="text-sm font-medium">{item.title}</p>
              <p
                className={`text-xs ${
                  item.tone === "danger"
                    ? "text-destructive"
                    : item.tone === "success"
                      ? "text-chart-1"
                      : "text-muted-foreground"
                }`}
              >
                {item.meta}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}


