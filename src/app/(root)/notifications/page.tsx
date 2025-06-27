import React from "react";
import { auth } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { db } from "@/database";
import { notification, loan, resources } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import dayjs from "dayjs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, BookOpen, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NotificationsPage = async () => {
  const session = await auth();
  
  // Redirect to login if user is not authenticated
  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/notifications");
  }
  
  const userId = parseInt(session.user.id);
  
  // Get all notifications for this user
  const userNotifications = await db
    .select({
      notificationId: notification.notificationId,
      notificationType: notification.notificationType,
      dateSent: notification.dateSent,
      isResolved: notification.isResolved,
      loanId: loan.loanId,
      resourceId: loan.resourceId,
      dueDate: loan.dueDate,
      title: resources.title,
      author: resources.author,
    })
    .from(notification)
    .innerJoin(loan, eq(notification.loanId, loan.loanId))
    .innerJoin(resources, eq(loan.resourceId, resources.resourceId))
    .where(eq(notification.sentToUserId, userId))
    .orderBy(desc(notification.dateSent));

  const activeNotifications = userNotifications.filter(n => !n.isResolved);
  const archivedNotifications = userNotifications.filter(n => n.isResolved);

  // Helper to get notification details
  const getNotificationDetails = (type: string, dueDate: Date) => {
    switch (type) {
      case "due_date_reminder":
        return {
          title: "Due Date Reminder",
          icon: <Bell className="h-5 w-5 text-amber-500" />,
          description: `This resource is due on ${dayjs(dueDate).format("MMMM D, YYYY")}.`,
          variant: "warning" as const,
        };
      case "overdue_notice":
        return {
          title: "Overdue Notice",
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          description: `This resource was due on ${dayjs(dueDate).format("MMMM D, YYYY")} and is now overdue.`,
          variant: "destructive" as const,
        };
      case "return_confirmation":
        return {
          title: "Return Confirmation",
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          description: "This resource has been successfully returned.",
          variant: "success" as const,
        };
      default:
        return {
          title: "Notification",
          icon: <Bell className="h-5 w-5 text-blue-500" />,
          description: "You have a notification from the library.",
          variant: "default" as const,
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-light-200">Notifications</h1>
        <p className="text-gray-500 mt-2">
          Stay updated with important information about your library resources
        </p>
      </div>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-6 bg-dark-300 text-white backdrop-blur-lg">
          <TabsTrigger className="text-white data-[state=active]:bg-dark-100" value="active">
            Active ({activeNotifications.length})
          </TabsTrigger>
          <TabsTrigger className="text-white data-[state=active]:bg-dark-100" value="archived">
            Archived ({archivedNotifications.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {activeNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white/5 backdrop-blur-lg rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg text-gray-600">
                You have no active notifications
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeNotifications.map((notification) => {
                const { title: notifTitle, icon, description, variant } = getNotificationDetails(
                  notification.notificationType || "",
                  notification.dueDate
                );
                
                return (
                  <Card key={notification.notificationId} className="overflow-hidden border-l-4" style={{
                    borderLeftColor: variant === "destructive" ? "rgb(239, 68, 68)" : 
                                    variant === "warning" ? "rgb(245, 158, 11)" :
                                    variant === "success" ? "rgb(34, 197, 94)" : 
                                    "rgb(59, 130, 246)"
                  }}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {icon}
                          <CardTitle className="text-lg">{notifTitle}</CardTitle>
                        </div>
                        <Badge>{dayjs(notification.dateSent).format("MMM D")}</Badge>
                      </div>
                      <CardDescription>
                        {notification.title} {notification.author ? `by ${notification.author}` : ""}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm">{description}</p>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between pt-1 bg-gray-50 border-t">
                      <Link href={`/resources/${notification.resourceId}`}>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          View Resource
                        </Button>
                      </Link>
                      
                      <form action={`/api/notifications/resolve?id=${notification.notificationId}`} method="POST">
                        <Button type="submit" variant="outline" size="sm">
                          Mark as Read
                        </Button>
                      </form>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="archived">
          {archivedNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white/5 backdrop-blur-lg rounded-lg">
              <p className="text-gray-500">No archived notifications</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resource
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Sent
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {archivedNotifications.map((notification) => {
                    const { title: notifTitle } = getNotificationDetails(
                      notification.notificationType || "",
                      notification.dueDate
                    );
                    
                    return (
                      <tr key={notification.notificationId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {notifTitle}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{notification.title}</div>
                          <div className="text-xs text-gray-500">{notification.author || "No author"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dayjs(notification.dateSent).format("MMM D, YYYY")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/resources/${notification.resourceId}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
