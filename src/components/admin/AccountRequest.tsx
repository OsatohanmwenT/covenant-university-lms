import React from "react";
import { db } from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { generateBgColor, generateTextColor, getInitials } from "@/lib/utils";

const AccountRequest = async () => {
  const accountList = await db
    .select()
    .from(users)
    .where(eq(users.isActive, false));

  if (!accountList.length) {
    return (
      <div className="flex py-5 items-center flex-col gap-2 justify-center">
        <Image
          src="/icons/no-account-illustration.svg"
          alt="no accounts"
          height={100}
          width={200}
        />
        <p className="text-dark-600 font-semibold text-center">
          No Pending Account Requests
        </p>
        <p className="text-light-500 text-sm text-center">
          There are currently no account requests awaiting approval.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 mt-6">
      {accountList.map((accountRequest, i) => (
        <div
          className="flex flex-col rounded-xl bg-light-300 p-3 py-4 items-center justify-center"
          key={accountRequest.userId}
        >
          <Avatar className="!h-fit !w-fit">
            <AvatarFallback
              style={{
                borderRadius: "50%",
                borderWidth: "1px",
                borderColor: generateTextColor(i),
                background: generateBgColor(i),
                color: generateTextColor(i),
              }}
              className="font-semibold size-14"
            >
              {getInitials(`${accountRequest.firstName} ${accountRequest.lastName}` || "IN")}
            </AvatarFallback>
          </Avatar>
          <p className="font-medium text-wrap text-dark-500 text-center">
            {accountRequest.firstName} {accountRequest.lastName}
          </p>
          <p className="text-sm text-light-500 w-[130px] line-clamp-1">
            {accountRequest.email}
          </p>
        </div>
      ))}
    </div>
  );
};
export default AccountRequest;
