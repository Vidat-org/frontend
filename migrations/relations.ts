import { relations } from "drizzle-orm/relations";
import { websites, reports, users, scans, scanIssues } from "./schema";

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
	scans: many(scans),
}));

export const usersRelations = relations(users, ({many}) => ({
	websites: many(websites),
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