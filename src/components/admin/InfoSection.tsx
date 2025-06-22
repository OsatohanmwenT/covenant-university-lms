import React, { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  sortButton: ReactNode;
  createButton?: ReactNode;
}

const InfoSection = ({ title, children, sortButton, createButton }: Props) => {
  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl text-dark-600 font-semibold">{title}</h2>
        <div className="flex gap-2">
          {sortButton}
          {createButton}
        </div>
      </div>
      <div className="mt-7 w-full overflow-hidden">{children}</div>
    </section>
  );
};
export default InfoSection;
