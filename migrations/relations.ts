import { relations } from "drizzle-orm/relations";
import { users, websites, scans, scanIssues } from "./schema";

export const websitesRelations = relations(websites, ({one, many}) => ({
	user: one(users, {
		fields: [websites.userId],
		references: [users.id]
	}),
	scans: many(scans),
}));

export const usersRelations = relations(users, ({many}) => ({
	websites: many(websites),
}));

export const scansRelations = relations(scans, ({one, many}) => ({
	website: one(websites, {
		fields: [scans.websiteId],
		references: [websites.id]
	}),
	scanIssues: many(scanIssues),
}));

export const scanIssuesRelations = relations(scanIssues, ({one}) => ({
	scan: one(scans, {
		fields: [scanIssues.scanId],
		references: [scans.id]
	}),
}));