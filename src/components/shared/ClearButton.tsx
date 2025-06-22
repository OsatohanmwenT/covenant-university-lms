"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const ClearSearchButton = () => {
  const router = useRouter();

  const handleClearSearch = () => {
    router.push("/search"); // or any base path you want to reset to
  };

  return (
    <Button
      onClick={handleClearSearch}
      className="book-overview_btn !w-full font-semibold"
    >
      CLEAR SEARCH
    </Button>
  );
};

export default ClearSearchButton;
