import { relations } from "drizzle-orm/relations";
import {
	apiKeys,
	auditLogs,
	billingSubscriptions,
	notificationDeliveries,
	onboardingStates,
	reports,
	scanIssues,
	scans,
	users,
	webhookDestinations,
	supportRequests,
	workspaceSettings,
	workspaces,
	websites,
} from "./schema";

export const reportsRelations = relations(reports, ({one}) => ({
	website: one(websites, {
		fields: [reports.websiteId],
		references: [websites.id]
	}),
}));

export const websitesRelations = relations(websites, ({one, many}) => ({
	reports: many(reports),
	user: one(users, {
		fields: [websites.userId],
		references: [users.id]
	}),
	workspace: one(workspaces, {
		fields: [websites.workspaceId],
		references: [workspaces.id]
	}),
	scans: many(scans),
	notificationDeliveries: many(notificationDeliveries),
}));

export const usersRelations = relations(users, ({many}) => ({
	websites: many(websites),
	webhookDestinations: many(webhookDestinations),
	auditLogs: many(auditLogs),
	apiKeys: many(apiKeys),
	supportRequests: many(supportRequests),
}));

export const webhookDestinationsRelations = relations(webhookDestinations, ({one}) => ({
	user: one(users, {
		fields: [webhookDestinations.userId],
		references: [users.id]
	}),
	workspace: one(workspaces, {
		fields: [webhookDestinations.workspaceId],
		references: [workspaces.id]
	}),
}));

export const scanIssuesRelations = relations(scanIssues, ({one}) => ({
	scan: one(scans, {
		fields: [scanIssues.scanId],
		references: [scans.id]
	}),
}));

export const scansRelations = relations(scans, ({one, many}) => ({
	scanIssues: many(scanIssues),
	website: one(websites, {
		fields: [scans.websiteId],
		references: [websites.id]
	}),
}));

export const workspacesRelations = relations(workspaces, ({many}) => ({
	websites: many(websites),
	billingSubscriptions: many(billingSubscriptions),
	onboardingStates: many(onboardingStates),
	workspaceSettings: many(workspaceSettings),
	auditLogs: many(auditLogs),
	notificationDeliveries: many(notificationDeliveries),
	webhookDestinations: many(webhookDestinations),
	apiKeys: many(apiKeys),
	supportRequests: many(supportRequests),
}));

export const workspaceSettingsRelations = relations(workspaceSettings, ({one}) => ({
	workspace: one(workspaces, {
		fields: [workspaceSettings.workspaceId],
		references: [workspaces.id]
	}),
}));

export const billingSubscriptionsRelations = relations(billingSubscriptions, ({one}) => ({
	workspace: one(workspaces, {
		fields: [billingSubscriptions.workspaceId],
		references: [workspaces.id]
	}),
}));

export const onboardingStatesRelations = relations(onboardingStates, ({one}) => ({
	workspace: one(workspaces, {
		fields: [onboardingStates.workspaceId],
		references: [workspaces.id]
	}),
}));

export const auditLogsRelations = relations(auditLogs, ({one}) => ({
	workspace: one(workspaces, {
		fields: [auditLogs.workspaceId],
		references: [workspaces.id]
	}),
	actorUser: one(users, {
		fields: [auditLogs.actorUserId],
		references: [users.id]
	}),
}));

export const notificationDeliveriesRelations = relations(notificationDeliveries, ({one}) => ({
	workspace: one(workspaces, {
		fields: [notificationDeliveries.workspaceId],
		references: [workspaces.id]
	}),
	website: one(websites, {
		fields: [notificationDeliveries.websiteId],
		references: [websites.id]
	}),
}));

export const apiKeysRelations = relations(apiKeys, ({one}) => ({
	workspace: one(workspaces, {
		fields: [apiKeys.workspaceId],
		references: [workspaces.id]
	}),
	createdByUser: one(users, {
		fields: [apiKeys.createdByUserId],
		references: [users.id]
	}),
}));

export const supportRequestsRelations = relations(supportRequests, ({one}) => ({
	workspace: one(workspaces, {
		fields: [supportRequests.workspaceId],
		references: [workspaces.id]
	}),
	createdByUser: one(users, {
		fields: [supportRequests.createdByUserId],
		references: [users.id]
	}),
}));
