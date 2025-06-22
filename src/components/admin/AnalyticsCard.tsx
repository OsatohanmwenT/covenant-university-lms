import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

const AnalyticsCard = ({
  title,
  count,
  difference,
}: {
  title: string;
  count: number;
  difference: number;
}) => {
  const isNegative = difference < 0;
  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <p className="font-semibold text-dark-700 text-sm">{title}</p>
          <p className="flex">
            {isNegative ? (
              <ArrowDown className="text-red-600 size-6" />
            ) : (
              <ArrowUp className="text-green-300 size-6" />
            )}
            <span className="font-semibold">{Math.abs(difference)}</span>
          </p>
        </div>
        <p className="font-bold text-2xl">{count}</p>
      </div>
    </div>
  );
};
export default AnalyticsCard;
