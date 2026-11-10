import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPortfolioSnapshot } from "@/lib/data/portfolio-repository";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AdminCommandCenterClient } from "@/components/AdminCommandCenterClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Command Center",
  description:
    "Private CMS Command Center for managing portfolio case studies, coursework sessions, attendance proofs, and Supabase PostgreSQL records.",
  alternates: {
    canonical: "/admin",
  },
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const hasLocalCookie =
    cookieStore.get("fadli_admin_auth")?.value === "authenticated";

  let hasSupabaseUser = false;
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      hasSupabaseUser = true;
    }
  }

  if (!hasLocalCookie && !hasSupabaseUser) {
    redirect("/admin/login");
  }

  const snapshot = await getPortfolioSnapshot();
  return <AdminCommandCenterClient dataSource={snapshot.dataSource} />;
}
