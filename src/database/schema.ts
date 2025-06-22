import {
  mysqlTable,
  int,
  varchar,
  boolean,
  date,
  decimal,
  text,
  timestamp,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

// 1. USER
export const users = mysqlTable('users', {
  userId: int('user_id').autoincrement().primaryKey(),
  fullName: varchar('full_name', { length: 150 }).notNull(),
  role: mysqlEnum('role', ['student', 'staff', 'faculty', 'admin']).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  registrationDate: timestamp("registration_date").defaultNow(),
  isActive: boolean('is_active').notNull()
});

// Resource Table
export const resources = mysqlTable('resources', {
  resourceId: int('resource_id').autoincrement().primaryKey(),
  uniqueIdentifier: varchar('unique_identifier', { length: 50 }).unique().notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  author: varchar('author', { length: 100 }),
  publicationDate: date('publication_date'),
  category: varchar('category', { length: 50 }),
  format: varchar('format', { length: 50 }),
  location: varchar('location', { length: 100 }),
  status: varchar('status', { length: 20 }),
  resourceImage: varchar('resource_image', { length: 255 })
});

// Loan Table
export const loan = mysqlTable('loans', {
  loanId: int('loan_id').autoincrement().primaryKey(),
  resourceId: int('resource_id').notNull().references(() => resources.resourceId),
  userId: int('user_id').notNull().references(() => users.userId),
  dateBorrowed: date('date_borrowed').notNull(),
  dueDate: date('due_date').notNull(),
  dateReturned: date('date_returned'),
  status: varchar('status', { length: 20 })
});

// Fine Table
export const fine = mysqlTable('fines', {
  fineId: int('fine_id').autoincrement().primaryKey(),
  loanId: int('loan_id').notNull().references(() => loan.loanId),
  amountPerDay: int('amount_per_day').notNull().default(100),
  daysOverdue: int('days_overdue').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  isPaid: boolean('is_paid').notNull(),
  datePaid: date('date_paid')
});

// Notification Table
export const notification = mysqlTable('notifications', {
  notificationId: int('notification_id').autoincrement().primaryKey(),
  loanId: int('loan_id').notNull().references(() => loan.loanId),
  notificationType: varchar('notification_type', { length: 50 }),
  dateSent: date('date_sent').notNull(),
  isResolved: boolean('is_resolved').notNull(),
  sentToUserId: int('sent_to_user_id').references(() => users.userId)
});

// AcquisitionRequest Table
export const acquisitionRequest = mysqlTable('acquisition_requests', {
  requestId: int('request_id').primaryKey().autoincrement(),
  resourceIdentifier: varchar('resource_identifier', { length: 50 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  author: varchar('author', { length: 100 }),
  publicationDate: date('publication_date'),
  requestedDate: date('requested_date').notNull(),
  requestedByUserId: int('requested_by_user_id').notNull().references(() => users.userId),
  isApproved: boolean('is_approved').notNull().default(false),
  approvedByUserId: int('approved_by_user_id').references(() => users.userId)
});

// InventoryAction Table
export const inventoryAction = mysqlTable('inventory_action', {
  actionId: int('action_id').autoincrement().primaryKey(),
  resourceId: int('resource_id').notNull().references(() => resources.resourceId),
  actionType: varchar('action_type', { length: 20 }).notNull(),
  actionDate: date('action_date').notNull(),
  notes: text('notes'),
  performedByUserId: int('performed_by_user_id').references(() => users.userId),
  approvedByUserId: int('approved_by_user_id').references(() => users.userId)
});

// ElectronicResourceBackup Table
export const electronicResourceBackup = mysqlTable('electronic_resource_backup', {
  backupId: int('backup_id').autoincrement().primaryKey(),
  resourceId: int('resource_id').notNull().references(() => resources.resourceId),
  backupDate: date('backup_date').notNull(),
  accessibilityStatus: varchar('accessibility_status', { length: 20 }),
  notes: text('notes')
});

// DamageReport Table
export const damageReport = mysqlTable('damage_report', {
  damageReportId: int('damage_report_id').autoincrement().primaryKey(),
  resourceId: int('resource_id').notNull().references(() => resources.resourceId),
  reportedDate: date('reported_date').notNull(),
  damageDescription: text('damage_description').notNull(),
  isReparable: boolean('is_reparable').notNull(),
  repairDueDate: date('repair_due_date'),
  repairCompletedDate: date('repair_completed_date'),
  reportedByUserId: int('reported_by_user_id').notNull().references(() => users.userId)
});