import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import React, { ReactNode } from "react";


const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="root-container">
      <div className="mx-auto w-full max-w-[1440px]">
        <Header />
        <div className="mt-20">{children}</div>
        <Footer />
      </div>
    </main>
  );
};
export default Layout;
