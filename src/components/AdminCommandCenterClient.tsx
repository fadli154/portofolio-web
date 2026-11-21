"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AdminHeader,
  type AdminTab,
} from "./admin/AdminHeader";
import { AdminToastProvider, useAdminToast } from "./admin/AdminToastProvider";
import { AdminConfirmDialog } from "./admin/AdminConfirmDialog";
import { AdminMagicBento } from "./admin/AdminMagicBento";
import { AdminCourseworkManager } from "./admin/AdminCourseworkManager";
import { AdminProjectsManager } from "./admin/AdminProjectsManager";
import { AdminCertificatesManager } from "./admin/AdminCertificatesManager";
import { AdminEducationManager } from "./admin/AdminEducationManager";
import { AdminExperiencesManager } from "./admin/AdminExperiencesManager";
import { AdminInquiriesManager } from "./admin/AdminInquiriesManager";

import {
  loadCmsStoreClient,
  upsertCourseworkSession,
  deleteCourseworkSession,
  upsertProjectItem,
  deleteProjectItem,
  upsertCertificateItem,
  deleteCertificateItem,
  upsertExperienceItem,
  deleteExperienceItem,
  type CmsDynamicStore,
} from "@/lib/data/cms-persistence";
import {
  loadEducationsClient,
  upsertEducationItem,
  deleteEducationItem,
} from "@/lib/data/cms-education";
import {
  loadInquiriesClient,
  upsertInquiryItem,
  deleteInquiryItem,
  type AdminInquiry,
} from "@/lib/data/cms-inquiries";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type {
  CertificateItem,
  EducationItem,
  ExperienceItem,
  KwuSessionItem,
  ProjectCaseStudy,
} from "@/data/site";

function AdminContent({
  dataSource,
}: {
  dataSource: "supabase-live" | "local-seed-fallback";
}) {
  const router = useRouter();
  const { showToast } = useAdminToast();

  const [activeTab, setActiveTab] = useState<AdminTab>("bento");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Dynamic Stores
  const [store, setStore] = useState<CmsDynamicStore>(() => loadCmsStoreClient());
  const [educations, setEducations] = useState<EducationItem[]>(() => loadEducationsClient());
  const [inquiries, setInquiries] = useState<AdminInquiry[]>(() => loadInquiriesClient());

  // Check login toast trigger
  useEffect(() => {
    if (typeof window !== "undefined") {
      const justLoggedIn = window.sessionStorage.getItem("admin_login_toast");
      if (justLoggedIn === "true") {
        window.sessionStorage.removeItem("admin_login_toast");
        showToast({
          title: "Berhasil Login ke Admin",
          description: "Sesi otentikasi aktif. Selamat datang di Command Center.",
          variant: "success",
        });
      }
    }
  }, [showToast]);

  // Synchronize on external updates
  useEffect(() => {
    const handleCmsUpdate = () => {
      setStore(loadCmsStoreClient());
      setEducations(loadEducationsClient());
      setInquiries(loadInquiriesClient());
    };
    window.addEventListener("fadli-cms-updated", handleCmsUpdate);
    return () => window.removeEventListener("fadli-cms-updated", handleCmsUpdate);
  }, []);

  // Logout Execution
  const handleLogoutExecute = async () => {
    setIsLogoutConfirmOpen(false);
    document.cookie =
      "fadli_admin_auth=; path=/; max-age=0; SameSite=Lax";

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        if (supabase) await supabase.auth.signOut();
      } catch {
        // Ignore
      }
    }

    showToast({
      title: "Berhasil Keluar",
      description: "Sesi admin Anda telah diakhiri dengan aman.",
      variant: "info",
    });

    setTimeout(() => {
      router.push("/admin/login");
      router.refresh();
    }, 400);
  };

  // Coursework handlers
  const handleSaveCoursework = async (s: KwuSessionItem) => {
    const res = await upsertCourseworkSession(s);
    setStore(res.store);
    return res.syncedToSupabase;
  };

  const handleDeleteCoursework = async (num: number) => {
    const res = await deleteCourseworkSession(num);
    setStore(res.store);
    return res.syncedToSupabase;
  };

  // Projects handlers
  const handleSaveProject = async (p: ProjectCaseStudy) => {
    const res = await upsertProjectItem(p);
    setStore(res.store);
    return res.syncedToSupabase;
  };

  const handleDeleteProject = async (id: string) => {
    const res = await deleteProjectItem(id);
    setStore(res.store);
    return res.syncedToSupabase;
  };

  // Certificates handlers
  const handleSaveCertificate = async (c: CertificateItem) => {
    const res = await upsertCertificateItem(c);
    setStore(res.store);
    return res.syncedToSupabase;
  };

  const handleDeleteCertificate = async (id: string) => {
    const res = await deleteCertificateItem(id);
    setStore(res.store);
    return res.syncedToSupabase;
  };

  // Experiences handlers
  const handleSaveExperience = async (e: ExperienceItem) => {
    const res = await upsertExperienceItem(e);
    setStore(res.store);
    return res.syncedToSupabase;
  };

  const handleDeleteExperience = async (id: string) => {
    const res = await deleteExperienceItem(id);
    setStore(res.store);
    return res.syncedToSupabase;
  };

  // Educations handlers
  const handleSaveEducation = async (e: EducationItem) => {
    const res = await upsertEducationItem(e);
    setEducations(res.items);
    return res.syncedToSupabase;
  };

  const handleDeleteEducation = async (id: string) => {
    const res = await deleteEducationItem(id);
    setEducations(res.items);
    return res.syncedToSupabase;
  };

  // Inquiries handlers
  const handleUpdateInquiryStatus = (id: string, status: "unread" | "read" | "replied") => {
    const target = inquiries.find((i) => i.id === id);
    if (!target) return;
    const updated = upsertInquiryItem({ ...target, status });
    setInquiries(updated);
  };

  const handleDeleteInquiry = (id: string) => {
    const updated = deleteInquiryItem(id);
    setInquiries(updated);
  };

  const counts = {
    coursework: store.courseworkSessions.length,
    projects: store.projects.length,
    experiences: store.experiences.length,
    certificates: store.certificates.length,
    educations: educations.length,
    inquiries: inquiries.length,
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#090a0d] text-white">
      {/* Sticky Desktop Sidebar & Mobile Topbar/Drawer */}
      <AdminHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        dataSource={dataSource}
        isMobileDrawerOpen={isMobileDrawerOpen}
        onToggleMobileDrawer={() => setIsMobileDrawerOpen((prev) => !prev)}
        onLogoutClick={() => setIsLogoutConfirmOpen(true)}
        counts={counts}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 lg:py-4 max-w-7xl mx-auto w-full">
        {activeTab === "bento" && (
          <AdminMagicBento
            onNavigateTab={setActiveTab}
            counts={counts}
            dataSource={dataSource}
            onQuickAdd={(type) => {
              if (type === "coursework") setActiveTab("coursework");
              if (type === "project") setActiveTab("projects");
              if (type === "certificate") setActiveTab("certificates");
              if (type === "education") setActiveTab("educations");
            }}
          />
        )}

        {activeTab === "coursework" && (
          <AdminCourseworkManager
            sessions={store.courseworkSessions}
            onSaveSession={handleSaveCoursework}
            onDeleteSession={handleDeleteCoursework}
          />
        )}

        {activeTab === "projects" && (
          <AdminProjectsManager
            projects={store.projects}
            onSaveProject={handleSaveProject}
            onDeleteProject={handleDeleteProject}
          />
        )}

        {activeTab === "experiences" && (
          <AdminExperiencesManager
            experiences={store.experiences}
            onSaveExperience={handleSaveExperience}
            onDeleteExperience={handleDeleteExperience}
          />
        )}

        {activeTab === "certificates" && (
          <AdminCertificatesManager
            certificates={store.certificates}
            onSaveCertificate={handleSaveCertificate}
            onDeleteCertificate={handleDeleteCertificate}
          />
        )}

        {activeTab === "educations" && (
          <AdminEducationManager
            educations={educations}
            onSaveEducation={handleSaveEducation}
            onDeleteEducation={handleDeleteEducation}
          />
        )}

        {activeTab === "inbox" && (
          <AdminInquiriesManager
            inquiries={inquiries}
            onUpdateStatus={handleUpdateInquiryStatus}
            onDeleteInquiry={handleDeleteInquiry}
          />
        )}
      </main>

      {/* Logout Confirmation SweetAlert */}
      <AdminConfirmDialog
        open={isLogoutConfirmOpen}
        type="logout"
        title="Konfirmasi Keluar Admin"
        description="Apakah Anda yakin ingin keluar dari sesi Command Center? Anda harus memasukkan kredensial admin kembali untuk mengakses portal ini."
        confirmLabel="Ya, Logout Sekarang"
        onConfirm={handleLogoutExecute}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />
    </div>
  );
}

export function AdminCommandCenterClient({
  dataSource,
}: {
  dataSource: "supabase-live" | "local-seed-fallback";
}) {
  return (
    <AdminToastProvider>
      <AdminContent dataSource={dataSource} />
    </AdminToastProvider>
  );
}
