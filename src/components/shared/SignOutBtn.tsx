"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const SignOutButton = () => {
  return (
    <Button
      onClick={() => signOut()}
      className="text-white max-sm:bg-transparent max-sm:p-0 max-sm:rounded-none max-sm:hover:bg-transparent"
    >
      <Image
        className="sm:hidden object-cover"
        src="/icons/logout.svg"
        alt="logout"
        width={25}
        height={25}
      />
      <span className="max-sm:hidden">Logout</span>
    </Button>
  );
};

export default SignOutButton;
