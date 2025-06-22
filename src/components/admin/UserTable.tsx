"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ROLE, User } from "@/types";
import { deleteUser } from "@/lib/admin/actions/user";
import StatusDialog from "./StatusDialog";
import ModeButton from "@/components/admin/ModeButton"; // Re-enabled

const UserTable = ({ users }: { users: User[] }) => {
  const [showDeny, setShowDeny] = useState(false);

  const handleDeleteUser = async (id: number) => {
    try {
      const result = await deleteUser(id);

      if (result.success) {
        toast.success("User deleted successfully");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    } finally {
      setShowDeny(false);
    }
  };

  return (
    <div className="table">
      <Table>
        <TableHeader className="table-head">
          <TableRow>
            <TableHead className="w-[250px]">Name</TableHead>
            <TableHead>Date Joined</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-center">Books Borrowed</TableHead>
            <TableHead>University Email</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="table-body">
          {!users.length && (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="rounded-lg py-10 bg-gray-100 border border-gray-300 flex items-center justify-center">
                  <p className="text-gray-700 text-lg">
                    No Users Found
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {users.map((user) => (
            <TableRow key={user.userId} className="border-b border-light-100">
              <TableCell className="flex items-center gap-2">
                <div className="flex flex-col">
                  <p className="font-medium">{user.fullName}</p>
                  <p className="text-xs text-light-100">{user.email}</p>
                </div>
              </TableCell>
              <TableCell>
                {dayjs(user.registrationDate).format("MMM DD, YYYY")}
              </TableCell>
              <TableCell>
                <ModeButton
                  userId={user.userId}
                  initialMode={user.role as ROLE}
                  type="ROLE"
                />
              </TableCell>
              <TableCell className="text-center">
                {user.borrowedBookCount}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-right">
                <StatusDialog
                  type="error"
                  title="Delete Account"
                  description="This action cannot be undone. This will permanently delete the user and remove their data from our servers."
                  buttonText="Delete user account"
                  onAction={() => handleDeleteUser(user.userId)}
                  trigger={
                    <button>
                      <Trash2 className="text-red-600 size-5" />
                    </button>
                  }
                  open={showDeny}
                  onOpenChange={setShowDeny}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
