import React from "react";
import { getPortfolioSnapshot } from "@/lib/data/portfolio-repository";
import { HomeClientSections } from "@/components/HomeClientSections";

export const revalidate = 3600;

export default async function HomePage() {
  const snapshot = await getPortfolioSnapshot();

  return (
    <HomeClientSections
      profile={snapshot.profile}
      projects={snapshot.projects}
      experiences={snapshot.experiences}
      educations={snapshot.educations}
      certificates={snapshot.certificates}
      courseworkSessions={snapshot.courseworkSessions}
      technologies={snapshot.technologies}
    />
  );
}

