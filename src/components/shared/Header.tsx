import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/actions/auth";
import { signOut } from "next-auth/react";
import SignOutButton from "./SignOutBtn";

const Header = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="my-10 flex px-5 md:px-16 justify-between gap-5">
      <Link className="flex items-center gap-2" href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
        <span className="text-white text-3xl font-bold">CU LMS</span>
      </Link>

      <ul className="flex flex-wrap items-center gap-6 text-sm font-medium text-white">
        <li>
          <Link href="/" className="hover:text-light-200">
            Home
          </Link>
        </li>
        <li>
          <Link href="/search" className="hover:text-light-200">
            Search
          </Link>
        </li>

        {user && (
          <>
            <li>
              <Link href="/my-profile/loans" className="hover:text-light-200">
                Loans
              </Link>
            </li>
            <li>
              <Link href="/my-profile/fines" className="hover:text-light-200">
                Fines
              </Link>
            </li>
            <li>
              <Link href="/my-profile/damage-reports" className="hover:text-light-200">
                Damages
              </Link>
            </li>
            <li>
              <Link href="/my-profile/notifications" className="hover:text-light-200">
                Notifications
              </Link>
            </li>
            <li>
              <Link href="/my-profile/request" className="hover:text-light-200">
                Request
              </Link>
            </li>
          </>
        )}

        {user ? (
          <>
            <li>
              <Link href="/my-profile">
                <Avatar>
                  <AvatarFallback className="bg-amber-100 text-black">
                    {getInitials(user.name || user.email || "U")}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </li>
            <SignOutButton />
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
