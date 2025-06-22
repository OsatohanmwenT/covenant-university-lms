import React from "react";
import AdminCard from "./AdminCard";
import LoanList from "./LoanList";
import AccountRequest from "./AccountRequest";
import RecentlyAdded from "./RecentlyAdded";

const AdminGrid = () => {
  return (
    <section className="grid xl:grid-cols-2 gap-5 mt-5">
      <div className="flex gap-5 flex-col">
        <AdminCard title="Borrow Requests" link="/admin/borrow-records">
          <LoanList />
        </AdminCard>
        <AdminCard title="Account Requests" link="/admin/account-requests">
          <AccountRequest />
        </AdminCard>
      </div>
      <AdminCard title="Recently Added Books" link="/admin/books">
        <RecentlyAdded />
      </AdminCard>
    </section>
  );
};
export default AdminGrid;
