// src/lib/services/notifications.ts
import { db } from "@/database";
import { loan, users, notification } from "@/database/schema";
import { eq, and, lt, gt, isNull } from "drizzle-orm";
import dayjs from "dayjs";
import { queueEmail } from "../workflow";

/**
 * Sends due date reminders for resources due in 2 days
 */
export const sendDueDateReminders = async () => {
  try {
    // Find all active loans with due dates 2 days from now
    const upcomingDueLoans = await db
      .select({
        loanId: loan.loanId,
        userId: loan.userId,
        resourceId: loan.resourceId,
        dueDate: loan.dueDate,
        email: users.email,
        fullName: users.fullName,
      })
      .from(loan)
      .innerJoin(users, eq(loan.userId, users.userId))
      .where(
        and(
          isNull(loan.dateReturned),          eq(
            loan.dueDate,
            dayjs().add(2, "day").toDate()
          )
        )
      );

    console.log(`Found ${upcomingDueLoans.length} loans due in 2 days`);

    for (const loanInfo of upcomingDueLoans) {
      // Send email notification
      await queueEmail({
        email: loanInfo.email,
        subject: "📚 Resource Due Reminder - Action Required",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
            <h2 style="color: #FF9800;">Resource Due Reminder</h2>
            <p>Dear ${loanInfo.fullName},</p>
            
            <p>This is a friendly reminder that your borrowed resource is due in <strong>2 days</strong> on ${dayjs(loanInfo.dueDate).format("MMMM D, YYYY")}.</p>
            
            <p>Please make arrangements to return it on or before the due date to avoid any penalty charges (₦100 per day).</p>
            
            <p>You can check your borrowing details in your account profile.</p>
            
            <p>Thank you for using the Covenant University Center for Learning Resources.</p>
            
            <hr style="margin: 24px 0;" />
            <p style="font-size: 12px; color: #888;">
              This is an automated message from CU Library Management System.<br />
              If you have any questions, please contact the library admin.
            </p>
          </div>
        `,
      });

      // Record notification in database
      await db.insert(notification).values({
        loanId: loanInfo.loanId,
        notificationType: "due_date_reminder",
        dateSent: new Date(),
        isResolved: false,
        sentToUserId: loanInfo.userId,
      });
    }

    return { success: true, count: upcomingDueLoans.length };
  } catch (error) {
    console.error("Error sending due date reminders:", error);
    return { success: false, error: "Failed to send due date reminders" };
  }
};

/**
 * Sends overdue notifications for resources that are past their due date
 */
export const sendOverdueReminders = async () => {
  try {
    // Find all overdue loans
    const overdueLoans = await db
      .select({
        loanId: loan.loanId,
        userId: loan.userId,
        resourceId: loan.resourceId,
        dueDate: loan.dueDate,
        email: users.email,
        fullName: users.fullName,
      })
      .from(loan)
      .innerJoin(users, eq(loan.userId, users.userId))
      .where(
        and(
          isNull(loan.dateReturned),
          lt(loan.dueDate, dayjs().toDate())
        )
      );

    console.log(`Found ${overdueLoans.length} overdue loans`);

    for (const loanInfo of overdueLoans) {
      const daysOverdue = dayjs().diff(dayjs(loanInfo.dueDate), "day");
      const fineAmount = daysOverdue * 100; // ₦100 per day

      // Send email notification
      await queueEmail({
        email: loanInfo.email,
        subject: "🚨 Overdue Resource - Action Required",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
            <h2 style="color: #F44336;">Overdue Resource Notice</h2>
            <p>Dear ${loanInfo.fullName},</p>
            
            <p>Your borrowed resource was due on <strong>${dayjs(loanInfo.dueDate).format("MMMM D, YYYY")}</strong> and is now <strong>${daysOverdue} ${daysOverdue === 1 ? 'day' : 'days'} overdue</strong>.</p>
            
            <p>Current penalties: <strong>₦${fineAmount}</strong> (₦100 per day)</p>
            
            <p>Please return the resource as soon as possible to avoid additional charges. You will not be able to borrow additional resources until this item is returned and any fines are paid.</p>
            
            <hr style="margin: 24px 0;" />
            <p style="font-size: 12px; color: #888;">
              This is an automated message from CU Library Management System.<br />
              If you have any questions, please contact the library admin.
            </p>
          </div>
        `,
      });

      // Record notification in database
      await db.insert(notification).values({
        loanId: loanInfo.loanId,
        notificationType: "overdue_notice",
        dateSent: new Date(),
        isResolved: false,
        sentToUserId: loanInfo.userId,
      });
    }

    return { success: true, count: overdueLoans.length };
  } catch (error) {
    console.error("Error sending overdue reminders:", error);
    return { success: false, error: "Failed to send overdue reminders" };
  }
};

/**
 * Gets all notifications for a specific user
 */
export const getUserNotifications = async (userId: number) => {
  try {
    const userNotifications = await db
      .select({
        notificationId: notification.notificationId,
        notificationType: notification.notificationType,
        dateSent: notification.dateSent,
        isResolved: notification.isResolved,
        loanId: loan.loanId,
        resourceId: loan.resourceId,
      })
      .from(notification)
      .innerJoin(loan, eq(notification.loanId, loan.loanId))
      .where(eq(notification.sentToUserId, userId))
      .orderBy(notification.dateSent);

    return { success: true, notifications: userNotifications };
  } catch (error) {
    console.error("Error getting user notifications:", error);
    return { success: false, error: "Failed to get notifications" };
  }
};

/**
 * Marks a notification as resolved
 */
export const markNotificationAsResolved = async (notificationId: number) => {
  try {
    await db
      .update(notification)
      .set({ isResolved: true })
      .where(eq(notification.notificationId, notificationId));

    return { success: true };
  } catch (error) {
    console.error("Error marking notification as resolved:", error);
    return { success: false, error: "Failed to mark notification as resolved" };
  }
};
