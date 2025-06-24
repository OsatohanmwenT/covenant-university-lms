"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { changeUserRole } from "@/lib/admin/actions/user";
import { toast } from "sonner";
import { ROLE, STATUS } from "@/types";
import { changeLoanStatus } from "@/lib/admin/actions/loan";

interface Mode {
  id: ROLE | STATUS;
  name: string;
  color: string;
  bgColor: string;
}

const roles: Mode[] = [
  {
    id: "student",
    name: "STUDENT",
    color: "text-blue-700",
    bgColor: "bg-blue-50 hover:bg-blue-200",
  },
  {
    id: "staff",
    name: "STAFF",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 hover:bg-emerald-200",
  },
  {
    id: "faculty",
    name: "FACULTY",
    color: "text-violet-700",
    bgColor: "bg-violet-50 hover:bg-violet-200",
  },
  {
    id: "admin",
    name: "ADMIN",
    color: "text-red-700",
    bgColor: "!bg-red-50 !hover:bg-red-200",
  },
];

const statuses: Mode[] = [
  {
    id: "borrowed",
    name: "BORROWED",
    color: "text-violet-700",
    bgColor: "bg-violet-50 hover:!bg-violet-200",
  },
  {
    id: "returned",
    name: "RETURNED",
    color: "text-blue-700",
    bgColor: "bg-blue-50 hover:!bg-blue-200",
  },
  {
    id: "late-return",
    name: "LATE RETURN",
    color: "text-red-700",
    bgColor: "bg-red-50 hover:!bg-red-200",
  },
];

interface ModeButtonProps {
  initialMode: ROLE | STATUS;
  userId: number;
  type: "ROLE" | "STATUS";
  currentUserRole?: ROLE | STATUS | string | null; // Add this prop
}

const ModeButton: React.FC<ModeButtonProps> = ({ initialMode, userId, type, currentUserRole }) => {
  // Admin-only guard for role changes
  if (type === "ROLE" && currentUserRole !== "admin") {
    return null;
  }

  const [selectedMode, setSelectedMode] = useState<ROLE | STATUS>(initialMode);
  const availableModes = type === "ROLE" ? roles : statuses;

  const handleChangeMode = async (newMode: ROLE | STATUS) => {
    setSelectedMode(newMode);

    try {
      if (type === "ROLE") {
        const result = await changeUserRole(userId, newMode as ROLE);
        console.log(result)

        if (result.success) {
          toast.success("User role updated successfully");
          setSelectedMode(result.data.role);
        } else {
          toast.error(result.error);
        }
      } else if (type === "STATUS") {
        const result = await changeLoanStatus(userId, newMode as STATUS);
        console.log(result)

        setSelectedMode(result?.data.status);
        toast.success("Status changed successfully");
      } 
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Mode change error:", error);
    }
  };

  const activeMode = availableModes.find((m) => m.id === selectedMode);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-0" asChild>
        <Button
          className={cn(
            "role-btn rounded-full",
            activeMode?.color,
            activeMode?.bgColor,
          )}
        >
          {selectedMode}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{type === "ROLE" ? "Change role" : "Change status"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableModes.map((mode) => (
          <DropdownMenuItem
            key={mode.id}
            className="flex items-center justify-between py-2 cursor-pointer"
            onClick={() => handleChangeMode(mode.id)}
          >
            <span
              className={cn(
                "font-medium py-1 px-3 rounded-2xl",
                mode.color,
                mode.bgColor,
              )}
            >
              {mode.name}
            </span>
            {selectedMode === mode.name && (
              <Check className="h-4 w-4 text-blue-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModeButton;
