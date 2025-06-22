import { mysqlTable, mysqlSchema, AnyMySqlColumn, int, varchar, date, foreignKey, text, decimal, index, timestamp } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const acquisitionRequest = mysqlTable("acquisition_request", {
	requestId: int("request_id").autoincrement().notNull(),
	resourceIdentifier: varchar("resource_identifier", { length: 50 }).notNull(),
	title: varchar({ length: 200 }).notNull(),
	author: varchar({ length: 100 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	publicationDate: date("publication_date", { mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	requestedDate: date("requested_date", { mode: 'string' }).notNull(),
	requestedByUserId: int("requested_by_user_id").notNull(),
	isApproved: tinyint("is_approved").default(0).notNull(),
	approvedByUserId: int("approved_by_user_id"),
});

export const acquisitionRequests = mysqlTable("acquisition_requests", {
	requestId: int("request_id").autoincrement().notNull(),
	resourceIdentifier: varchar("resource_identifier", { length: 50 }).notNull(),
	title: varchar({ length: 200 }).notNull(),
	author: varchar({ length: 100 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	publicationDate: date("publication_date", { mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	requestedDate: date("requested_date", { mode: 'string' }).notNull(),
	requestedByUserId: int("requested_by_user_id").notNull().references(() => users.userId),
	isApproved: tinyint("is_approved").default(0).notNull(),
	approvedByUserId: int("approved_by_user_id").references(() => users.userId),
});

export const damageReport = mysqlTable("damage_report", {
	damageReportId: int("damage_report_id").autoincrement().notNull(),
	resourceId: int("resource_id").notNull().references(() => resources.resourceId),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	reportedDate: date("reported_date", { mode: 'string' }).notNull(),
	damageDescription: text("damage_description").notNull(),
	isReparable: tinyint("is_reparable").notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	repairDueDate: date("repair_due_date", { mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	repairCompletedDate: date("repair_completed_date", { mode: 'string' }),
	reportedByUserId: int("reported_by_user_id").notNull().references(() => users.userId),
});

export const electronicResourceBackup = mysqlTable("electronic_resource_backup", {
	backupId: int("backup_id").autoincrement().notNull(),
	resourceId: int("resource_id").notNull().references(() => resources.resourceId),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	backupDate: date("backup_date", { mode: 'string' }).notNull(),
	accessibilityStatus: varchar("accessibility_status", { length: 20 }),
	notes: text(),
});

export const fines = mysqlTable("fines", {
	fineId: int("fine_id").autoincrement().notNull(),
	loanId: int("loan_id").notNull().references(() => loans.loanId),
	amountPerDay: int("amount_per_day").default(100).notNull(),
	daysOverdue: int("days_overdue").notNull(),
	totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
	isPaid: tinyint("is_paid").notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	datePaid: date("date_paid", { mode: 'string' }),
});

export const inventoryAction = mysqlTable("inventory_action", {
	actionId: int("action_id").autoincrement().notNull(),
	resourceId: int("resource_id").notNull().references(() => resources.resourceId),
	actionType: varchar("action_type", { length: 20 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	actionDate: date("action_date", { mode: 'string' }).notNull(),
	notes: text(),
	performedByUserId: int("performed_by_user_id").references(() => users.userId),
	approvedByUserId: int("approved_by_user_id").references(() => users.userId),
});

export const loans = mysqlTable("loans", {
	loanId: int("loan_id").autoincrement().notNull(),
	resourceId: int("resource_id").notNull().references(() => resources.resourceId),
	userId: int("user_id").notNull().references(() => users.userId),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateBorrowed: date("date_borrowed", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dueDate: date("due_date", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateReturned: date("date_returned", { mode: 'string' }),
	status: varchar({ length: 20 }),
});

export const notifications = mysqlTable("notifications", {
	notificationId: int("notification_id").autoincrement().notNull(),
	loanId: int("loan_id").notNull().references(() => loans.loanId),
	notificationType: varchar("notification_type", { length: 50 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dateSent: date("date_sent", { mode: 'string' }).notNull(),
	isResolved: tinyint("is_resolved").notNull(),
	sentToUserId: int("sent_to_user_id").references(() => users.userId),
});

export const resources = mysqlTable("resources", {
	resourceId: int("resource_id").autoincrement().notNull(),
	uniqueIdentifier: varchar("unique_identifier", { length: 50 }).notNull(),
	title: varchar({ length: 200 }).notNull(),
	resourceImage: varchar("resource_image", { length: 255 }),
	description: text(),
	author: varchar({ length: 100 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	publicationDate: date("publication_date", { mode: 'string' }),
	category: varchar({ length: 50 }),
	format: varchar({ length: 50 }),
	location: varchar({ length: 100 }),
	status: varchar({ length: 20 }),
},
(table) => [
	index("resources_unique_identifier_unique").on(table.uniqueIdentifier),
]);

export const users = mysqlTable("users", {
	userId: int("user_id").autoincrement().notNull(),
	firstName: varchar("first_name", { length: 50 }).notNull(),
	middleName: varchar("middle_name", { length: 50 }),
	lastName: varchar("last_name", { length: 50 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	userType: varchar("user_type", { length: 20 }).notNull(),
	universityIdCard: varchar("university_id_card", { length: 20 }),
	email: varchar({ length: 100 }).notNull(),
	registrationDate: timestamp("registration_date", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
	isActive: tinyint("is_active").notNull(),
},
(table) => [
	index("users_university_id_card_unique").on(table.universityIdCard),
	index("users_email_unique").on(table.email),
]);
