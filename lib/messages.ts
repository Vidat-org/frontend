import type { TFunction } from "i18next"
import { normalizePlanSlug } from "./plans"

const auditLabelKeys: Record<string, string> = {
  "largest-contentful-paint": "issues.audit.largest-contentful-paint",
  "first-contentful-paint": "issues.audit.first-contentful-paint",
  "total-blocking-time": "issues.audit.total-blocking-time",
  "cumulative-layout-shift": "issues.audit.cumulative-layout-shift",
  "server-response-time": "issues.audit.server-response-time",
  "uses-https": "issues.audit.uses-https",
  "meta-description": "issues.audit.meta-description",
  "document-title": "issues.audit.document-title",
  "image-alt": "issues.audit.image-alt",
  "color-contrast": "issues.audit.color-contrast",
}

const issueCategoryKeys: Record<string, string> = {
  seo: "issues.category.seo",
  performance: "issues.category.performance",
  security: "issues.category.security",
  accessibility: "issues.category.accessibility",
}

const roleKeys: Record<string, string> = {
  owner: "common.role.owner",
  admin: "common.role.admin",
  member: "common.role.member",
}

const inviteStatusKeys: Record<string, string> = {
  pending: "common.inviteStatus.pending",
  accepted: "common.inviteStatus.accepted",
  revoked: "common.inviteStatus.revoked",
  expired: "common.inviteStatus.expired",
}

const supportCategoryKeys: Record<string, string> = {
  support: "common.supportCategory.support",
  billing: "common.supportCategory.billing",
  security: "common.supportCategory.security",
  success: "common.supportCategory.success",
}

const supportPriorityKeys: Record<string, string> = {
  low: "common.supportPriority.low",
  normal: "common.supportPriority.normal",
  high: "common.supportPriority.high",
  urgent: "common.supportPriority.urgent",
}

const requestStatusKeys: Record<string, string> = {
  open: "common.requestStatus.open",
  in_progress: "common.requestStatus.inProgress",
  resolved: "common.requestStatus.resolved",
  closed: "common.requestStatus.closed",
}

const billingStatusKeys: Record<string, string> = {
  trialing: "common.billingStatus.trialing",
  active: "common.billingStatus.active",
  past_due: "common.billingStatus.pastDue",
  canceled: "common.billingStatus.canceled",
  incomplete: "common.billingStatus.incomplete",
}

const dunningStatusKeys: Record<string, string> = {
  clear: "common.dunningStatus.clear",
  at_risk: "common.dunningStatus.atRisk",
  in_dunning: "common.dunningStatus.inDunning",
  write_off: "common.dunningStatus.writeOff",
}

const deliveryStatusKeys: Record<string, string> = {
  pending: "common.deliveryStatus.pending",
  sent: "common.deliveryStatus.sent",
  failed: "common.deliveryStatus.failed",
  retrying: "common.deliveryStatus.retrying",
}

const scanStatusKeys: Record<string, string> = {
  success: "common.scanStatus.success",
  failed: "common.scanStatus.failed",
}

const deliveryChannelKeys: Record<string, string> = {
  email: "common.deliveryChannel.email",
  slack: "common.deliveryChannel.slack",
  webhook: "common.deliveryChannel.webhook",
}

const eventTypeKeys: Record<string, string> = {
  "scan.failed": "common.eventType.scanFailed",
  "score.regression": "common.eventType.scoreRegression",
  "report.ready": "common.eventType.reportReady",
}

const planNameKeys: Record<string, string> = {
  free_org: "home.pricing.free.name",
  starter_org: "home.pricing.starter.name",
  pro_org: "home.pricing.pro.name",
  enterprise_org: "home.pricing.enterprise.name",
}

function translateMappedValue(
  value: string | null | undefined,
  keys: Record<string, string>,
  t: TFunction,
  fallback = "-"
) {
  if (!value) {
    return fallback
  }

  const key = keys[value]
  return key ? t(key) : value
}

export function getAuditLabel(
  auditKey: string,
  t: TFunction,
  fallback?: string | null
) {
  const key = auditLabelKeys[auditKey]
  return key ? t(key) : fallback || auditKey
}

export function getIssueCategoryLabel(
  category: string | null | undefined,
  t: TFunction
) {
  return translateMappedValue(category, issueCategoryKeys, t, "")
}

export function getPlanLabel(plan: string | null | undefined, t: TFunction) {
  return t(planNameKeys[normalizePlanSlug(plan)])
}

export function getRoleLabel(role: string | null | undefined, t: TFunction) {
  return translateMappedValue(role, roleKeys, t)
}

export function getInviteStatusLabel(
  status: string | null | undefined,
  t: TFunction
) {
  return translateMappedValue(status, inviteStatusKeys, t)
}

export function getSupportCategoryLabel(
  category: string | null | undefined,
  t: TFunction
) {
  return translateMappedValue(category, supportCategoryKeys, t)
}

export function getSupportPriorityLabel(
  priority: string | null | undefined,
  t: TFunction
) {
  return translateMappedValue(priority, supportPriorityKeys, t)
}

export function getRequestStatusLabel(
  status: string | null | undefined,
  t: TFunction
) {
  return translateMappedValue(status, requestStatusKeys, t)
}

export function getBillingStatusLabel(
  status: string | null | undefined,
  t: TFunction
) {
  return translateMappedValue(status, billingStatusKeys, t)
}

export function getDunningStatusLabel(
  status: string | null | undefined,
  t: TFunction
) {
  return translateMappedValue(status, dunningStatusKeys, t)
}

export function getDeliveryStatusLabel(
  status: string | null | undefined,
  t: TFunction
) {
  return translateMappedValue(status, deliveryStatusKeys, t)
}

export function getScanStatusLabel(
  status: string | null | undefined,
  t: TFunction
) {
  return translateMappedValue(status, scanStatusKeys, t)
}

export function getDeliveryChannelLabel(
  channel: string | null | undefined,
  t: TFunction
) {
  return translateMappedValue(channel, deliveryChannelKeys, t)
}

export function getEventTypeLabel(
  eventType: string | null | undefined,
  t: TFunction
) {
  return translateMappedValue(eventType, eventTypeKeys, t)
}
