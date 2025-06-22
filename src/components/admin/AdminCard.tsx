import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AdminCard = ({
  children,
  title,
  link,
}: {
  children: ReactNode;
  title: string;
  link: string;
}) => {
  return (
    <div className="bg-white relative overflow-hidden rounded-xl pt-4 px-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-xl text-dark-500">{title}</p>
        <Button className="!text-blue-700 !bg-blue-50" asChild>
          <Link href={link}>View All</Link>
        </Button>
      </div>
      {children}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
};
export default AdminCard;
