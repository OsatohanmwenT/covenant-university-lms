import React from "react";
import AnalyticsCard from "./AnalyticsCard";

const AnalyticsSection = async () => {
  return (
    <div className="grid xl:grid-cols-3 w-full gap-5">
      <AnalyticsCard
        title="Total Books"
        count={32345}
        difference={50} />
      <AnalyticsCard
        title="Overdue Books"
        count={100}
        difference={-30} />
      <AnalyticsCard
        title="Total Users"
        count={1570}
        difference={50} />
    </div>
  );
};
export default AnalyticsSection;
