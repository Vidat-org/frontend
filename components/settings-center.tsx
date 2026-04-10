"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { useChangeLanguage } from "next-i18next/client"
import type { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { client } from "@/lib/orpc"
import { getQueryClient } from "@/lib/query-client"
import { type Locale } from "@/lib/i18n"
import { formatDate } from "@/lib/utils"
import {
  getBillingStatusLabel,
  getDeliveryChannelLabel,
  getDeliveryStatusLabel,
  getDunningStatusLabel,
  getEventTypeLabel,
  getInviteStatusLabel,
  getPlanLabel,
  getRequestStatusLabel,
  getRoleLabel,
  getSupportCategoryLabel,
  getSupportPriorityLabel,
} from "@/lib/messages"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  History,
  KeyRound,
  LifeBuoy,
  MailPlus,
  Rocket,
  Trash2,
  Webhook,
  X,
} from "lucide-react"

const webhookEvents = [
  "scan.failed",
  "score.regression",
  "report.ready",
] as const

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
  const changeLanguage = useChangeLanguage()
  const { t, i18n } = useTranslation("common")
  const locale = (i18n.resolvedLanguage === "en" ? "en" : "sv") as Locale

  const accountQuery = useQuery({
    queryKey: ["accountSummary"],
    queryFn: async () => client.getAccountSummary(),
  })
  const webhooksQuery = useQuery({
    queryKey: ["webhookDestinations"],
    queryFn: async () => client.listWebhookDestinations(),
  })
  const auditLogsPageSize = 10
  const auditQuery = useInfiniteQuery({
    queryKey: ["auditLogs", auditLogsPageSize],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) =>
      client.listAuditLogs({ limit: auditLogsPageSize, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === auditLogsPageSize
        ? allPages.reduce((total, page) => total + page.length, 0)
        : undefined,
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
    enabled: accountQuery.data?.capabilities.apiAccess ?? false,
  })
  const supportQuery = useQuery({
    queryKey: ["supportRequests"],
    queryFn: async () => client.listSupportRequests(),
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
  const [workspaceLocale, setWorkspaceLocale] = useState<Locale | undefined>()
  const [apiKeyLabel, setApiKeyLabel] = useState("")
  const [latestApiKey, setLatestApiKey] = useState<string | null>(null)
  const [supportForm, setSupportForm] = useState<SupportFormState>({
    subject: "",
    priority: "normal",
    category: "support",
    message: "",
  })

  const account = accountQuery.data
  const isAdmin =
    account?.workspace.role === "owner" || account?.workspace.role === "admin"

  const saveSettings = useMutation({
    mutationFn: async () => {
      await client.updateNotificationSettings({
        emailAlerts: resolvedSettings.emailAlerts,
        weeklyDigest: resolvedSettings.weeklyDigest,
        productUpdates: resolvedSettings.productUpdates,
        billingEmails: resolvedSettings.billingEmails,
        notifyOnScanFailure: resolvedSettings.notifyOnScanFailure,
        notifyOnScoreDrop: resolvedSettings.notifyOnScoreDrop,
        scoreDropThreshold: Number(resolvedSettings.scoreDropThreshold),
        slackWebhookUrl: resolvedSettings.slackWebhookUrl,
      })
    },
    onSuccess: () => {
      invalidateAccountViews()
      toast.success(t("settingsCenter.settingsSaved"))
    },
    onError: () => toast.error(t("settingsCenter.saveSettingsFailed")),
  })

  const resolvedWorkspaceLocale =
    workspaceLocale ?? account?.workspace.preferredLocale ?? "sv"

  const saveWorkspaceLanguage = useMutation({
    mutationFn: async () =>
      client.updateWorkspaceLocale({
        preferredLocale: resolvedWorkspaceLocale,
      }),
    onSuccess: () => {
      void changeLanguage(resolvedWorkspaceLocale)
      invalidateAccountViews()
      router.refresh()
      toast.success(t("settingsCenter.team.languageSaved"))
    },
    onError: () => toast.error(t("common.somethingWentWrongTryAgain")),
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

  const updateOnboarding = useMutation({
    mutationFn: async (step: {
      key:
        | "hasAddedWebsite"
        | "hasRunFirstScan"
        | "hasViewedReport"
        | "hasConfiguredAlerts"
        | "hasConnectedIntegration"
      completed: boolean
    }) =>
      client.updateOnboardingStep({
        step: step.key,
        completed: step.completed,
      }),
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

  if (!account || accountQuery.isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        {t("settingsCenter.loading")}
      </div>
    )
  }

  const auditLogs = auditQuery.data?.pages.flatMap((page) => page) ?? []
  const deliveries = deliveriesQuery.data ?? []
  const onboarding = onboardingQuery.data
  const webhooks = webhooksQuery.data ?? []
  const apiKeys = apiKeysQuery.data ?? []
  const supportRequests = supportQuery.data ?? []
  const userWorkspaces: Array<{
    workspaceId: string
    name: string
    role: "owner" | "admin" | "member"
    plan: { slug: string }
    isActive: boolean
  }> = []
  const pendingInvites: Array<{
    id: string
    workspaceName: string
    role: "owner" | "admin" | "member"
    expiresAt: string | null
  }> = []
  const workspace: {
    members: Array<{
      id: string
      email: string | null
      clerkUserId: string
      role: "owner" | "admin" | "member"
    }>
    invites: Array<{
      id: string
      email: string
      role: "owner" | "admin" | "member"
      status: "pending" | "accepted" | "revoked" | "expired"
    }>
  } = { members: [], invites: [] }
  const isOwner = false
  const switchWorkspace = {
    isPending: false,
    mutate: (workspaceId: string) => {
      void workspaceId
    },
  }
  const acceptInvite = {
    isPending: false,
    mutate: (inviteId: string) => {
      void inviteId
    },
  }
  const declineInvite = {
    isPending: false,
    mutate: (inviteId: string) => {
      void inviteId
    },
  }
  const updateMemberRole = {
    isPending: false,
    mutate: (payload: { memberId: string; role: "admin" | "member" }) => {
      void payload
    },
  }
  const removeMember = {
    isPending: false,
    mutate: (memberId: string) => {
      void memberId
    },
  }
  const setInviteForm = (
    value:
      | { email: string; role: "admin" | "member" }
      | ((prev: { email: string; role: "admin" | "member" }) => {
          email: string
          role: "admin" | "member"
        })
  ) => {
    void value
  }
  const inviteForm = { email: "", role: "member" as const }
  const createInvite = { isPending: false, mutate: () => {} }
  const revokeInvite = {
    mutate: (inviteId: string) => {
      void inviteId
    },
  }
  const showSection = (...sections: SettingsSection[]) =>
    !sections.includes("team") &&
    (section === "all" || sections.includes(section))

  const resolvedSettings = {
    emailAlerts: settingsForm.emailAlerts ?? account.settings.emailAlerts,
    weeklyDigest: settingsForm.weeklyDigest ?? account.settings.weeklyDigest,
    productUpdates:
      settingsForm.productUpdates ?? account.settings.productUpdates,
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

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {t("settingsCenter.accountEyebrow")}
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("settingsCenter.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("settingsCenter.subtitle")}
          </p>
        </div>
        {/* <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{account.workspace.name}</Badge>
          <Badge variant="outline">{getPlanLabel(account.plan.slug, t)}</Badge>
        </div> */}
      </div>
      {showSection("all") ? (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title={t("settingsCenter.stats.workspace")}
            value={account.workspace.memberCount.toString()}
            description={t("settingsCenter.activeMembers")}
          />
          <StatCard
            title={t("settingsCenter.stats.onboarding")}
            value={`${account.onboarding.completedSteps}/${account.onboarding.totalSteps}`}
            description={t("settingsCenter.stepsDone")}
          />
          <StatCard
            title={t("settingsCenter.notifications")}
            value={String(account.notifications.sent)}
            description={t("settingsCenter.failedCount", {
              count: account.notifications.failed,
            })}
          />
          <StatCard
            title={t("settingsCenter.stats.billing")}
            value={getBillingStatusLabel(account.billing.status, t)}
            description={getDunningStatusLabel(
              account.billing.dunningStatus,
              t
            )}
          />
        </div>
      ) : null}

      {showSection("all", "billing") ? (
        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          {showSection("all") ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-4 w-4" />
                  {t("settingsCenter.onboardingTitle")}
                </CardTitle>
                <CardDescription>
                  {t("settingsCenter.onboardingDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <OnboardingRow
                  label={t("settingsCenter.onboarding.firstWebsiteAdded")}
                  checked={
                    onboarding?.hasAddedWebsite ??
                    account.onboarding.hasAddedWebsite
                  }
                  onToggle={(completed) =>
                    updateOnboarding.mutate({
                      key: "hasAddedWebsite",
                      completed,
                    })
                  }
                />
                <OnboardingRow
                  label={t("settingsCenter.onboarding.firstScanRun")}
                  checked={
                    onboarding?.hasRunFirstScan ??
                    account.onboarding.hasRunFirstScan
                  }
                  onToggle={(completed) =>
                    updateOnboarding.mutate({
                      key: "hasRunFirstScan",
                      completed,
                    })
                  }
                />
                <OnboardingRow
                  label={t("settingsCenter.onboarding.reportOpened")}
                  checked={
                    onboarding?.hasViewedReport ??
                    account.onboarding.hasViewedReport
                  }
                  onToggle={(completed) =>
                    updateOnboarding.mutate({
                      key: "hasViewedReport",
                      completed,
                    })
                  }
                />
                <OnboardingRow
                  label={t("settingsCenter.onboarding.alertsConfigured")}
                  checked={
                    onboarding?.hasConfiguredAlerts ??
                    account.onboarding.hasConfiguredAlerts
                  }
                  onToggle={(completed) =>
                    updateOnboarding.mutate({
                      key: "hasConfiguredAlerts",
                      completed,
                    })
                  }
                />
                <OnboardingRow
                  label={t("settingsCenter.onboarding.integrationConnected")}
                  checked={
                    onboarding?.hasConnectedIntegration ??
                    account.onboarding.hasConnectedIntegration
                  }
                  onToggle={(completed) =>
                    updateOnboarding.mutate({
                      key: "hasConnectedIntegration",
                      completed,
                    })
                  }
                />
                <div className="rounded-xl border p-4">
                  <p className="text-sm font-medium">
                    {t("settingsApi.restApiTitle")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("settingsCenter.restApiHint")}
                  </p>
                  <div className="mt-3 space-y-2 font-mono text-xs text-muted-foreground">
                    <p>GET /api/v1/workspaces/current</p>
                    <p>GET /api/v1/websites</p>
                    <p>GET /api/v1/websites/:id/scans/latest</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {t("settingsCenter.billingTitle")}
              </CardTitle>
              <CardDescription>
                {t("settingsCenter.billingOverviewDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <BillingStat
                  label={t("settingsCenter.plan")}
                  value={getPlanLabel(account.plan.slug, t)}
                />
                <BillingStat
                  label={t("settingsCenter.billingStatus")}
                  value={getBillingStatusLabel(account.billing.status, t)}
                />
                <BillingStat
                  label={t("settingsCenter.dunningStatus")}
                  value={getDunningStatusLabel(
                    account.billing.dunningStatus,
                    t
                  )}
                />
                <BillingStat
                  label={t("settingsCenter.billingCycle")}
                  value={getBillingCycleLabel(account.billing.amountSek, t)}
                />
                <BillingStat
                  label={t("settingsCenter.monthlyAmount")}
                  value={formatAmount(account.billing.amountSek, locale)}
                />
                <BillingStat
                  label={getBillingDateLabel(account.billing, t)}
                  value={getBillingDateValue(account.billing, t, locale)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {account.billing.manageUrl ? (
                  <Button asChild>
                    <Link
                      href={account.billing.manageUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("settingsCenter.billingPrimaryCta")}
                    </Link>
                  </Button>
                ) : null}
                {getUpgradeHref(account.billing) ? (
                  <Button asChild variant="outline">
                    <Link
                      href={getUpgradeHref(account.billing)!}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("settingsCenter.billingSecondaryCta")}
                    </Link>
                  </Button>
                ) : null}
              </div>
              {!account.billing.manageUrl &&
              !getUpgradeHref(account.billing) ? (
                <p className="text-sm text-muted-foreground">
                  {t("settingsCenter.billingNoAction")}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {showSection("notifications") ? (
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          {showSection("notifications") ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  {t("settingsPage.notificationsTitle")}
                </CardTitle>
                <CardDescription>
                  {t("settingsCenter.notificationsDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldGroup>
                  <ToggleRow
                    label={t("settingsCenter.notifications.emailLabel")}
                    description={t(
                      "settingsCenter.notifications.emailDescription"
                    )}
                    checked={resolvedSettings.emailAlerts}
                    onToggle={() =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        emailAlerts: !resolvedSettings.emailAlerts,
                      }))
                    }
                  />
                  <ToggleRow
                    label={t("settingsCenter.notifications.scanFailureLabel")}
                    description={t(
                      "settingsCenter.notifications.scanFailureDescription"
                    )}
                    checked={resolvedSettings.notifyOnScanFailure}
                    onToggle={() =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        notifyOnScanFailure:
                          !resolvedSettings.notifyOnScanFailure,
                      }))
                    }
                  />
                  <ToggleRow
                    label={t("settingsCenter.notifications.scoreDropLabel")}
                    description={t(
                      "settingsCenter.notifications.scoreDropDescription"
                    )}
                    checked={resolvedSettings.notifyOnScoreDrop}
                    onToggle={() =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        notifyOnScoreDrop: !resolvedSettings.notifyOnScoreDrop,
                      }))
                    }
                  />
                  <Field>
                    <FieldLabel>
                      {t("settingsCenter.notifications.scoreDropThreshold")}
                    </FieldLabel>
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
                      {t(
                        "settingsCenter.notifications.scoreDropThresholdDescription"
                      )}
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel>
                      {t("settingsCenter.notifications.slackWebhookLabel")}
                    </FieldLabel>
                    <Input
                      placeholder={t(
                        "settingsCenter.notifications.slackWebhookPlaceholder"
                      )}
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
                <div className="flex w-full items-center justify-between gap-3">
                  {!isAdmin ? (
                    <p className="text-sm text-muted-foreground">
                      {t("settingsCenter.notifications.workspaceAdminHint")}
                    </p>
                  ) : (
                    <div />
                  )}
                  <Button
                    onClick={() => saveSettings.mutate()}
                    disabled={!isAdmin || saveSettings.isPending}
                  >
                    {t("settingsCenter.saveSettings")}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ) : null}

          {showSection("team") ? (
            <Card>
              <CardHeader>
                <CardTitle>{t("settingsCenter.team.title")}</CardTitle>
                <CardDescription>
                  Medlemskap, roller och inbjudningar hanteras via Clerk
                  Organizations. Språket för den aktiva organizationen styrs
                  fortfarande här.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {t("settingsCenter.team.yourWorkspaces")}
                  </p>
                  {userWorkspaces.map((entry) => (
                    <div
                      key={entry.workspaceId}
                      className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {getRoleLabel(entry.role, t)} ·{" "}
                          {getPlanLabel(entry.plan.slug, t)}
                        </p>
                      </div>
                      {entry.isActive ? (
                        <Badge variant="success">
                          {t("settingsCenter.team.active")}
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={switchWorkspace.isPending}
                          onClick={() =>
                            switchWorkspace.mutate(entry.workspaceId)
                          }
                        >
                          {t("settingsCenter.team.switchWorkspace")}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border p-4">
                  <Field>
                    <FieldLabel>
                      {t("settingsCenter.team.workspaceLanguageLabel")}
                    </FieldLabel>
                    <Select
                      value={resolvedWorkspaceLocale}
                      onValueChange={(value) =>
                        setWorkspaceLocale(value as Locale)
                      }
                      disabled={!isAdmin}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t(
                            "settingsCenter.team.workspaceLanguagePlaceholder"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sv">
                          {t("common.language.sv")}
                        </SelectItem>
                        <SelectItem value="en">
                          {t("common.language.en")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      {t("settingsCenter.team.workspaceLanguageDescription")}
                    </FieldDescription>
                  </Field>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      disabled={
                        !isAdmin ||
                        saveWorkspaceLanguage.isPending ||
                        resolvedWorkspaceLocale ===
                          account.workspace.preferredLocale
                      }
                      onClick={() => saveWorkspaceLanguage.mutate()}
                    >
                      {t("settingsCenter.team.saveWorkspaceLanguage")}
                    </Button>
                  </div>
                </div>
                {pendingInvites.length > 0 ? (
                  <div className="space-y-2 rounded-xl border border-chart-1/20 bg-chart-1/5 p-4">
                    <p className="text-sm font-medium">
                      {t("settingsCenter.team.pendingInvites")}
                    </p>
                    {pendingInvites.map((invite) => (
                      <div
                        key={invite.id}
                        className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {invite.workspaceName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getRoleLabel(invite.role, t)} ·{" "}
                            {t("settingsCenter.team.validUntil")}{" "}
                            {formatStamp(invite.expiresAt, t, locale)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            disabled={acceptInvite.isPending}
                            onClick={() => acceptInvite.mutate(invite.id)}
                          >
                            {t("settingsCenter.team.accept")}
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
                          <p className="text-xs text-muted-foreground">
                            {getRoleLabel(member.role, t)}
                          </p>
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
                                  role:
                                    member.role === "admin"
                                      ? "member"
                                      : "admin",
                                })
                              }
                            >
                              {member.role === "admin"
                                ? t("settingsCenter.team.makeMember")
                                : t("settingsCenter.team.makeAdmin")}
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
                          <Badge variant="outline">
                            {getRoleLabel(member.role, t)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border p-4">
                  <div className="grid gap-3">
                    <Field>
                      <FieldLabel>{t("settingsCenter.team.email")}</FieldLabel>
                      <Input
                        placeholder={t("settingsCenter.team.emailPlaceholder")}
                        value={inviteForm.email}
                        onChange={(e) =>
                          setInviteForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel>{t("settingsCenter.team.role")}</FieldLabel>
                      <div className="flex flex-wrap gap-2">
                        {(["member", "admin"] as const).map((role) => (
                          <Button
                            key={role}
                            type="button"
                            size="sm"
                            variant={
                              inviteForm.role === role ? "default" : "outline"
                            }
                            onClick={() =>
                              setInviteForm((prev) => ({ ...prev, role }))
                            }
                          >
                            {getRoleLabel(role, t)}
                          </Button>
                        ))}
                      </div>
                    </Field>
                    <Button
                      variant="outline"
                      disabled={
                        !isAdmin || !inviteForm.email || createInvite.isPending
                      }
                      onClick={() => createInvite.mutate()}
                    >
                      <MailPlus className="h-4 w-4" />
                      {t("settingsCenter.team.sendInvite")}
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
                          {getRoleLabel(invite.role, t)} ·{" "}
                          {getInviteStatusLabel(invite.status, t)}
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
                        <Badge variant="outline">
                          {getInviteStatusLabel(invite.status, t)}
                        </Badge>
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
              {t("settingsCenter.integrations.title")}
            </CardTitle>
            <CardDescription>
              {t("settingsCenter.integrations.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 md:grid-cols-2">
              <Field>
                <FieldLabel>{t("settingsCenter.integrations.name")}</FieldLabel>
                <Input
                  placeholder={t("settingsCenter.integrations.namePlaceholder")}
                  value={webhookForm.label}
                  onChange={(e) =>
                    setWebhookForm((prev) => ({
                      ...prev,
                      label: e.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel>{t("settingsCenter.integrations.url")}</FieldLabel>
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
              <FieldLabel>{t("settingsCenter.integrations.events")}</FieldLabel>
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
                            ? prev.eventTypes.filter(
                                (item) => item !== eventType
                              )
                            : [...prev.eventTypes, eventType],
                        }))
                      }
                    >
                      {getEventTypeLabel(eventType, t)}
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
                {t("settingsCenter.integrations.addWebhook")}
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
                        <Badge
                          variant={webhook.isEnabled ? "success" : "outline"}
                        >
                          {webhook.isEnabled
                            ? t("settingsCenter.integrations.active")
                            : t("settingsCenter.integrations.paused")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {webhook.url}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {eventTypes.map((eventType) => (
                          <Badge key={eventType} variant="outline">
                            {getEventTypeLabel(eventType, t)}
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
                        {webhook.isEnabled
                          ? t("settingsCenter.integrations.pause")
                          : t("settingsCenter.integrations.activate")}
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
                  {t("settingsCenter.apiKeys.title")}
                </CardTitle>
                <CardDescription>
                  {t("settingsCenter.apiKeys.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!account.capabilities.apiAccess ? (
                  <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    {t("settingsCenter.apiKeys.agencyOnly")}
                  </div>
                ) : null}
                {latestApiKey ? (
                  <div className="rounded-lg border border-chart-1/30 bg-chart-1/5 p-3">
                    <p className="text-sm font-medium">
                      {t("settingsCenter.apiKeys.shownOnce")}
                    </p>
                    <p className="mt-1 font-mono text-xs break-all">
                      {latestApiKey}
                    </p>
                  </div>
                ) : null}
                <div className="flex gap-3">
                  <Input
                    placeholder={t("settingsCenter.apiKeys.labelPlaceholder")}
                    value={apiKeyLabel}
                    onChange={(e) => setApiKeyLabel(e.target.value)}
                    disabled={!account.capabilities.apiAccess}
                  />
                  <Button
                    disabled={
                      !account.capabilities.apiAccess ||
                      !isAdmin ||
                      !apiKeyLabel ||
                      createApiKey.isPending
                    }
                    onClick={() => createApiKey.mutate()}
                  >
                    {t("settingsCenter.apiKeys.create")}
                  </Button>
                </div>
                <div className="space-y-2">
                  {apiKeys.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t("settingsCenter.apiKeys.empty")}
                    </p>
                  ) : (
                    apiKeys.map((key) => (
                      <div
                        key={key.id}
                        className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium">{key.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {key.keyPrefix}... ·{" "}
                            {key.revokedAt
                              ? t("settingsCenter.apiKeys.revoked")
                              : t("settingsCenter.apiKeys.active")}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={!isAdmin || Boolean(key.revokedAt)}
                          onClick={() => revokeApiKey.mutate(key.id)}
                        >
                          {t("settingsCenter.apiKeys.revoke")}
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
                  {t("settingsCenter.support.title")}
                </CardTitle>
                <CardDescription>
                  {t("settingsCenter.support.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <Input
                    placeholder={t("settingsCenter.support.subjectPlaceholder")}
                    value={supportForm.subject}
                    onChange={(e) =>
                      setSupportForm((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                  />
                  <div className="flex flex-wrap gap-2">
                    {(
                      ["support", "billing", "security", "success"] as const
                    ).map((category) => (
                      <Button
                        key={category}
                        type="button"
                        size="sm"
                        variant={
                          supportForm.category === category
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setSupportForm((prev) => ({ ...prev, category }))
                        }
                      >
                        {getSupportCategoryLabel(category, t)}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(["low", "normal", "high", "urgent"] as const).map(
                      (priority) => (
                        <Button
                          key={priority}
                          type="button"
                          size="sm"
                          variant={
                            supportForm.priority === priority
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            setSupportForm((prev) => ({ ...prev, priority }))
                          }
                        >
                          {getSupportPriorityLabel(priority, t)}
                        </Button>
                      )
                    )}
                  </div>
                  <Textarea
                    placeholder={t("settingsCenter.support.messagePlaceholder")}
                    value={supportForm.message}
                    onChange={(e) =>
                      setSupportForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
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
                    {t("settingsCenter.support.create")}
                  </Button>
                </div>
                <div className="space-y-2">
                  {supportRequests.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t("settingsCenter.support.empty")}
                    </p>
                  ) : (
                    supportRequests.map((request) => (
                      <div key={request.id} className="rounded-lg border p-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-medium">
                              {request.subject}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getSupportCategoryLabel(request.category, t)} ·{" "}
                              {getSupportPriorityLabel(request.priority, t)} ·{" "}
                              {getRequestStatusLabel(request.status, t)}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {getRequestStatusLabel(request.status, t)}
                          </Badge>
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
          <div className="space-y-3">
            <LogCard
              icon={<History className="h-4 w-4" />}
              title={t("settingsCenter.logs.auditTitle")}
              description={t("settingsCenter.logs.auditDescription")}
              items={auditLogs.map((item) => ({
                id: item.id,
                title: item.summary,
                meta: formatStamp(item.createdAt, t, locale),
                tone: "neutral" as const,
              }))}
            />
            {auditQuery.hasNextPage ? (
              <Button
                variant="secondary"
                className="w-full"
                disabled={auditQuery.isFetchingNextPage}
                onClick={() => auditQuery.fetchNextPage()}
              >
                {auditQuery.isFetchingNextPage
                  ? t("settingsCenter.logs.loadingMore")
                  : t("settingsCenter.logs.loadMore")}
              </Button>
            ) : null}
          </div>
          <LogCard
            icon={<CheckCircle2 className="h-4 w-4" />}
            title={t("settingsCenter.logs.deliveryTitle")}
            description={t("settingsCenter.logs.deliveryDescription")}
            items={deliveries.map((item) => ({
              id: item.id,
              title: `${getDeliveryChannelLabel(item.channel, t)} → ${item.destination}`,
              meta: `${getEventTypeLabel(item.eventType, t)} · ${getDeliveryStatusLabel(item.status, t)} · ${formatStamp(item.createdAt, t, locale)}`,
              tone:
                item.status === "failed"
                  ? ("danger" as const)
                  : ("success" as const),
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
  qc.invalidateQueries({ queryKey: ["auditLogs"] })
  qc.invalidateQueries({ queryKey: ["notificationDeliveries"] })
  qc.invalidateQueries({ queryKey: ["onboardingState"] })
  qc.invalidateQueries({ queryKey: ["apiKeys"] })
  qc.invalidateQueries({ queryKey: ["supportRequests"] })
}

function formatStamp(
  value: string | null | undefined,
  t: TFunction,
  locale: Locale
) {
  if (!value) return t("dashboard.unknownTime")
  return formatDate(value, locale)
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
  const { t } = useTranslation("common")
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button
        type="button"
        variant={checked ? "default" : "outline"}
        onClick={onToggle}
      >
        {checked ? t("common.state.on") : t("common.state.off")}
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
  const { t } = useTranslation("common")
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium">{label}</p>
      <Button
        type="button"
        size="sm"
        variant={checked ? "default" : "outline"}
        onClick={() => onToggle(!checked)}
      >
        {checked ? t("common.action.done") : t("common.action.mark")}
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
  const { t } = useTranslation("common")
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
          <p className="text-sm text-muted-foreground">
            {t("settingsCenter.logs.empty")}
          </p>
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

function BillingStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  )
}

function getUpgradeHref(
  billing: SettingsCenterAccount["billing"]
): string | null | undefined {
  const recommendedUpgrade = billing.recommendedUpgrade as
    | "starter"
    | "pro"
    | "agency"
    | undefined

  return recommendedUpgrade ? billing.checkout[recommendedUpgrade] : null
}

function getBillingDateLabel(
  billing: SettingsCenterAccount["billing"],
  t: TFunction
) {
  if (billing.cancelAtPeriodEnd || billing.status === "canceled") {
    return t("settingsCenter.billingCancelScheduled")
  }

  if (billing.trialEndsAt) {
    return t("settingsCenter.billingTrialEnds")
  }

  return t("settingsCenter.billingRenewal")
}

function getBillingDateValue(
  billing: SettingsCenterAccount["billing"],
  t: TFunction,
  locale: Locale
) {
  const value =
    billing.cancelAtPeriodEnd || billing.status === "canceled"
      ? billing.currentPeriodEndsAt
      : (billing.trialEndsAt ?? billing.currentPeriodEndsAt)

  return value ? formatDate(value, locale) : t("settingsCenter.billingNone")
}

function getBillingCycleLabel(amountSek: number, t: TFunction) {
  if (amountSek > 0) {
    return t("settingsCenter.billingCycleMonthly")
  }

  return t("settingsCenter.billingCycleUnknown")
}

function formatAmount(amountCents: number, locale: Locale) {
  if (amountCents <= 0) return "Free"

  return new Intl.NumberFormat(locale === "sv" ? "sv-SE" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amountCents / 100)
}

type SettingsCenterAccount = NonNullable<
  Awaited<ReturnType<typeof client.getAccountSummary>>
>
