import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/actions/auth";
import { signOut } from "next-auth/react";

const Header = async () => {
 const session = await auth();
  const user = session?.user;

  return (
    <header className="my-10 flex px-5 md:px-16 justify-between gap-5">
      <Link className="flex items-center gap-2" href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
        <span className="text-white text-3xl font-bold">CU LMS</span>
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link
            href="/"
            className="text-base hover:text-light-200 cursor-pointer capitalize text-white"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/search"
            className="text-base hover:text-light-200 cursor-pointer capitalize text-white"
          >
            Search
          </Link>
        </li>

        {user ? (
          <>
            <li>
              <Link href="/my-profile">
                <Avatar>
                  <AvatarFallback className="bg-amber-100">
                    {getInitials(user.name || user.email || "U")}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </li>
            <li>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button className="max-sm:bg-transparent max-sm:p-0 max-sm:rounded-none max-sm:hover:bg-transparent">
                  <Image
                    className="sm:hidden object-cover"
                    src="/icons/logout.svg"
                    alt="logout"
                    width={25}
                    height={25}
                  />
                  <span className="max-sm:hidden">Logout</span>
                </Button>
              </form>
            </li>
          </>
        ) : (
          <li>
            <Link href="/sign-in">
              <Button className="text-white bg-primary hover:bg-primary/90">
                Sign In
              </Button>
            </Link>
          </li>
        )}
      </ul>
    </header>
  );
};

export default Header;
