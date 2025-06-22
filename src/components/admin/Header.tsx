import React from "react";
import { Session } from "next-auth";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import Form from "next/form";

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="admin-header">
      <div>
        <h2 className="text-dark-400 font-semibold text-2xl">
          {session.user?.name}
        </h2>
        <p className="text-slate-500 text-base">
          Monitor all of your users and books
        </p>
      </div>
      <Form className="admin-search" action="/">
        <Search className="size-7" />
        <Input
          placeholder="Search users, books by title, author, or genre."
          className="admin-search_input"
        />
      </Form>
    </header>
  );
};
export default Header;
