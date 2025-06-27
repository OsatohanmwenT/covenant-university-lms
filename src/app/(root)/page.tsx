import FeaturesSection from "@/components/landing-page/FeatureSection";
import { db } from "@/database";
import { resources } from "@/database/schema";
import { desc } from "drizzle-orm";
import { Resource } from "@/types";
import React from "react";
import LatestArrivals from "@/components/landing-page/LatestArrivals";

const Page = async () => {
  const latestResources = (await db
    .select()
    .from(resources)
    .orderBy(desc(resources.resourceId))
    .limit(13)) as Resource[];

    console.log(latestResources)

  return (
    <main>
      <div className="h-[60vh] px-5 md:px-16">
        <h1 className="text-4xl text-center font-semibold text-white">
          Welcome to Covenant University LMS
        </h1>
        <p className="text-2xl text-light-100/80 mt-8 text-center max-w-4xl mx-auto">
          Streamline your library operations with our comprehensive management
          system. Search millions of resources, manage collections, and provide
          exceptional service to your community.
        </p>
      </div>
      <LatestArrivals latestResources={latestResources} />

      <FeaturesSection />
    </main>
  );
};

export default Page;
