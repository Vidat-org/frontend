import { relations } from "drizzle-orm/relations";
import { websites, scans, scanIssues } from "./schema";

export const scansRelations = relations(scans, ({one, many}) => ({
	website: one(websites, {
		fields: [scans.websiteId],
		references: [websites.id]
	}),
	scanIssues: many(scanIssues),
}));

export const websitesRelations = relations(websites, ({many}) => ({
	scans: many(scans),
}));

export const scanIssuesRelations = relations(scanIssues, ({one}) => ({
	scan: one(scans, {
		fields: [scanIssues.scanId],
		references: [scans.id]
	}),
}));