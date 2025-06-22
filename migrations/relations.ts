import { relations } from "drizzle-orm/relations";
import { users, acquisitionRequests, resources, damageReport, electronicResourceBackup, loans, fines, inventoryAction, notifications } from "./schema";

export const acquisitionRequestsRelations = relations(acquisitionRequests, ({one}) => ({
	user_requestedByUserId: one(users, {
		fields: [acquisitionRequests.requestedByUserId],
		references: [users.userId],
		relationName: "acquisitionRequests_requestedByUserId_users_userId"
	}),
	user_approvedByUserId: one(users, {
		fields: [acquisitionRequests.approvedByUserId],
		references: [users.userId],
		relationName: "acquisitionRequests_approvedByUserId_users_userId"
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	acquisitionRequests_requestedByUserId: many(acquisitionRequests, {
		relationName: "acquisitionRequests_requestedByUserId_users_userId"
	}),
	acquisitionRequests_approvedByUserId: many(acquisitionRequests, {
		relationName: "acquisitionRequests_approvedByUserId_users_userId"
	}),
	damageReports: many(damageReport),
	inventoryActions_performedByUserId: many(inventoryAction, {
		relationName: "inventoryAction_performedByUserId_users_userId"
	}),
	inventoryActions_approvedByUserId: many(inventoryAction, {
		relationName: "inventoryAction_approvedByUserId_users_userId"
	}),
	loans: many(loans),
	notifications: many(notifications),
}));

export const damageReportRelations = relations(damageReport, ({one}) => ({
	resource: one(resources, {
		fields: [damageReport.resourceId],
		references: [resources.resourceId]
	}),
	user: one(users, {
		fields: [damageReport.reportedByUserId],
		references: [users.userId]
	}),
}));

export const resourcesRelations = relations(resources, ({many}) => ({
	damageReports: many(damageReport),
	electronicResourceBackups: many(electronicResourceBackup),
	inventoryActions: many(inventoryAction),
	loans: many(loans),
}));

export const electronicResourceBackupRelations = relations(electronicResourceBackup, ({one}) => ({
	resource: one(resources, {
		fields: [electronicResourceBackup.resourceId],
		references: [resources.resourceId]
	}),
}));

export const finesRelations = relations(fines, ({one}) => ({
	loan: one(loans, {
		fields: [fines.loanId],
		references: [loans.loanId]
	}),
}));

export const loansRelations = relations(loans, ({one, many}) => ({
	fines: many(fines),
	resource: one(resources, {
		fields: [loans.resourceId],
		references: [resources.resourceId]
	}),
	user: one(users, {
		fields: [loans.userId],
		references: [users.userId]
	}),
	notifications: many(notifications),
}));

export const inventoryActionRelations = relations(inventoryAction, ({one}) => ({
	resource: one(resources, {
		fields: [inventoryAction.resourceId],
		references: [resources.resourceId]
	}),
	user_performedByUserId: one(users, {
		fields: [inventoryAction.performedByUserId],
		references: [users.userId],
		relationName: "inventoryAction_performedByUserId_users_userId"
	}),
	user_approvedByUserId: one(users, {
		fields: [inventoryAction.approvedByUserId],
		references: [users.userId],
		relationName: "inventoryAction_approvedByUserId_users_userId"
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	loan: one(loans, {
		fields: [notifications.loanId],
		references: [loans.loanId]
	}),
	user: one(users, {
		fields: [notifications.sentToUserId],
		references: [users.userId]
	}),
}));