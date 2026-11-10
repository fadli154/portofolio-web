import type { Metadata } from "next";
import { getPortfolioSnapshot } from "@/lib/data/portfolio-repository";
import { CertificatesVaultClient } from "@/components/CertificatesVaultClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Verified Credentials Vault",
  description:
    "Engineering certifications in Next.js App Router, Supabase PostgreSQL Row-Level Security, AI Agent Orchestration, and OWASP Web Security.",
  alternates: {
    canonical: "/certificates",
  },
};

export default async function CertificatesPage() {
  const snapshot = await getPortfolioSnapshot();
  return <CertificatesVaultClient certificates={snapshot.certificates} />;
}
