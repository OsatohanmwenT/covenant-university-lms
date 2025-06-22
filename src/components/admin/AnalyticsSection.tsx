import React from "react";
import AnalyticsCard from "./AnalyticsCard";

const AnalyticsSection = async () => {
  return (
    <div className="grid xl:grid-cols-3 w-full gap-5">
      <AnalyticsCard
        title="Total Overdue"
        count={1000}
        difference={50} />
      <AnalyticsCard
        title="Total Books Borrowed"
        count={1000}
        difference={-30} />
      <AnalyticsCard
        title="Total Users"
        count={1000}
        difference={50} />
    </div>
  );
};
export default AnalyticsSection;
