import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import { db } from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import Sidebar from "@/components/admin/Sidebar";
import { auth } from "@/lib/actions/auth";
import Header from "@/components/admin/Header";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.userId, Number(session.user.id)))
    .limit(1);

  if (user?.role !== "admin") redirect("/");



  return (
    <main className="flex min-h-screen w-full flex-row">
      <Sidebar session={session} />
      <div className="admin-container">
        <Header session={session} />
        {children}
      </div>
    </main>
  );
};
export default Layout;