"use server";

import { db } from "@/database";
import { users } from "@/database/schema";
import { ROLE } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const changeUserRole = async (id: number, role: ROLE) => {
  try {
    const user = await db.select().from(users).where(eq(users.userId, id)).limit(1);

    if (!user.length && !user[0].userId)
      return {
        success: false,
        error: "User not found",
      };

    await db
      .update(users)
      .set({ role: role })
      .where(eq(users.userId, id));

    revalidatePath("/admin/users");

    // Optionally, fetch the updated user if you need to return it
    const updatedUser = await db.select().from(users).where(eq(users.userId, id)).limit(1);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedUser[0])),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "An error occurred while updating user",
    };
  }
};

export const deleteUser = async (id: number) => {
  try {
    const user = await db.select().from(users).where(eq(users.userId, id)).limit(1);
    if (!user)
      return {
        success: false,
        error: "User not found",
      };

    await db.delete(users).where(eq(users.userId, id));

    revalidatePath("/admin/users");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "An error occurred while deleting user",
    };
  }
};

// export const denyUser = async (id: string) => {
//   try {
//     const user = await db.select().from(users).where(eq(users.id, id)).limit(1);

//     if (!user) return null;

//     await db.update(users).set({ status: "REJECTED" });

//     revalidatePath("/admin/account-requests");

//     return {
//       success: true,
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       success: false,
//       error: "An error occurred while denying user access",
//     };
//   }
// };

export const approveUser = async (id: number) => {
  try {
    const user = await db.select().from(users).where(eq(users.userId, id)).limit(1);

    if (!user) return null;

    await db.update(users).set({ isActive: true });

    revalidatePath("/admin/account-requests");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "An error occurred while approving user access",
    };
  }
};
