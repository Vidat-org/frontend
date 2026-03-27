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
	userSettings,
	users,
	webhookDestinations,
	supportRequests,
	workspaceInvites,
	workspaceMembers,
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
	userSettings: many(userSettings),
	workspaceMembers: many(workspaceMembers),
	workspaceInvites: many(workspaceInvites),
	auditLogs: many(auditLogs),
	apiKeys: many(apiKeys),
	supportRequests: many(supportRequests),
}));

export const userSettingsRelations = relations(userSettings, ({one}) => ({
	user: one(users, {
		fields: [userSettings.userId],
		references: [users.id]
	}),
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
	members: many(workspaceMembers),
	invites: many(workspaceInvites),
	billingSubscriptions: many(billingSubscriptions),
	onboardingStates: many(onboardingStates),
	auditLogs: many(auditLogs),
	notificationDeliveries: many(notificationDeliveries),
	webhookDestinations: many(webhookDestinations),
	apiKeys: many(apiKeys),
	supportRequests: many(supportRequests),
}));

export const workspaceMembersRelations = relations(workspaceMembers, ({one}) => ({
	workspace: one(workspaces, {
		fields: [workspaceMembers.workspaceId],
		references: [workspaces.id]
	}),
	user: one(users, {
		fields: [workspaceMembers.userId],
		references: [users.id]
	}),
}));

export const workspaceInvitesRelations = relations(workspaceInvites, ({one}) => ({
	workspace: one(workspaces, {
		fields: [workspaceInvites.workspaceId],
		references: [workspaces.id]
	}),
	invitedByUser: one(users, {
		fields: [workspaceInvites.invitedByUserId],
		references: [users.id]
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
