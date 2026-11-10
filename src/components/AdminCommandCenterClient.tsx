"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Database,
  ExternalLink,
  FileCode2,
  Image as ImageIcon,
  Inbox,
  Lock,
  LogOut,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import {
  CERTIFICATES,
  EXPERIENCES,
  KWU_SESSIONS,
  PROJECTS,
  type CertificateItem,
  type ExperienceItem,
  type KwuSessionItem,
  type ProjectCaseStudy,
} from "@/data/site";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import {
  deleteCertificateItem,
  deleteCourseworkSession,
  deleteExperienceItem,
  deleteProjectItem,
  loadCmsStoreClient,
  upsertCertificateItem,
  upsertCourseworkSession,
  upsertExperienceItem,
  upsertProjectItem,
} from "@/lib/data/cms-persistence";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type AdminTab =
  | "coursework"
  | "certificates"
  | "experiences"
  | "projects"
  | "inbox";

interface MockInquiry {
  id: string;
  senderName: string;
  senderEmail: string;
  company: string;
  scope: string;
  receivedAt: string;
  status: "unread" | "read" | "replied";
  message: string;
}

const INITIAL_INQUIRIES: MockInquiry[] = [
  {
    id: "inq-01",
    senderName: "Budi Santoso",
    senderEmail: "budi.santoso@kominfo-daerah.example",
    company: "Dinas Komunikasi dan Informatika",
    scope: "contract",
    receivedAt: "2026-11-10 08:42 UTC",
    status: "unread",
    message:
      "Halo Fadli, kami meninjau dokumentasi aplikasi pendataan kependudukan SIMDUK (Laravel & MySQL) serta portal pelaporan GovTech Anda. Apakah tersedia waktu untuk diskusi pengembangan modul integrasi data berikutnya?",
  },
  {
    id: "inq-02",
    senderName: "Dr. Ahmad Fauzi",
    senderEmail: "ahmad.fauzi@riset-ai-haji.example",
    company: "Tim Inovasi Aksesibilitas Jemaah Haji",
    scope: "advisory",
    receivedAt: "2026-11-09 15:18 UTC",
    status: "replied",
    message:
      "Kami sangat tertarik dengan prototipe Smart Hajj AI untuk deteksi mata uang Riyal (SAR) dan penerjemah bahasa isyarat berbasis MediaPipe Hand Landmarks.",
  },
];

export function AdminCommandCenterClient({
  dataSource,
}: {
  dataSource: "supabase-live" | "local-seed-fallback";
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("coursework");
  const [toast, setToast] = useState<string | null>(null);

  // Dynamic CMS state
  const [sessions, setSessions] = useState<KwuSessionItem[]>(KWU_SESSIONS);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(EXPERIENCES);
  const [projects, setProjects] = useState<ProjectCaseStudy[]>(PROJECTS);
  const [inquiries, setInquiries] = useState<MockInquiry[]>(INITIAL_INQUIRIES);

  // Coursework Editor Form State
  const [selectedSessionNumber, setSelectedSessionNumber] = useState<number>(1);
  const [sessionNumInput, setSessionNumInput] = useState<number>(1);
  const [sessionTitle, setSessionTitle] = useState<string>("");
  const [sessionDesc, setSessionDesc] = useState<string>("");
  const [sessionDate, setSessionDate] = useState<string>("Minggu 1 · 2026");
  const [attendanceStatus, setAttendanceStatus] = useState<
    "Hadir" | "Izin" | "Sakit" | "Belum Dimulai"
  >("Hadir");
  const [attendanceProofUrl, setAttendanceProofUrl] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [taskUrl, setTaskUrl] = useState<string>("");
  const [taskStatus, setTaskStatus] = useState<
    "Selesai" | "Proses" | "Belum Ada Tugas"
  >("Selesai");

  // Experience Editor Form State
  const [expCompany, setExpCompany] = useState("");
  const [expRole, setExpRole] = useState("");
  const [expType, setExpType] = useState("MAGANG RESMI");
  const [expPeriod, setExpPeriod] = useState("2025 - 2026");
  const [expBadge, setExpBadge] = useState("");
  const [expSummary, setExpSummary] = useState("");
  const [expHighlight1, setExpHighlight1] = useState("");
  const [expHighlight2, setExpHighlight2] = useState("");
  const [expStack, setExpStack] = useState("Laravel, MySQL, Next.js");

  // Project Case Study Editor Form State
  const [projTitle, setProjTitle] = useState("");
  const [projSlug, setProjSlug] = useState("");
  const [projCategory, setProjCategory] = useState(
    "AI & Computer Vision · Full-Stack"
  );
  const [projYear, setProjYear] = useState("2026");
  const [projClient, setProjClient] = useState("Riset & Pengembangan");
  const [projRole, setProjRole] = useState("Full-Stack & AI Developer");
  const [projSummary, setProjSummary] = useState("");
  const [projStack, setProjStack] = useState(
    "Next.js, TypeScript, Python, OpenCV"
  );
  const [projUrl, setProjUrl] = useState("https://github.com/fadli154");

  // Certificate Editor Form State
  const [certificates, setCertificates] =
    useState<CertificateItem[]>(CERTIFICATES);
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null);
  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certIssueDate, setCertIssueDate] = useState("2026");
  const [certCategory, setCertCategory] = useState("Kompetisi");
  const [certCredentialId, setCertCredentialId] = useState("");
  const [certImageUrl, setCertImageUrl] = useState("");
  const [certFileUrl, setCertFileUrl] = useState("");
  const [certVerifyUrl, setCertVerifyUrl] = useState("");
  const [certSummaryId, setCertSummaryId] = useState("");
  const [certSummaryEn, setCertSummaryEn] = useState("");
  const [certSortOrder, setCertSortOrder] = useState(1);
  const [certIsVisible, setCertIsVisible] = useState(true);
  const [certUploading, setCertUploading] = useState(false);

  const notify = (msg: string) => {
    playMechanicalClick(740);
    setToast(msg);
    window.setTimeout(() => setToast(null), 3500);
  };

  // Load initial store on mount
  useEffect(() => {
    const store = loadCmsStoreClient();
    setSessions(store.courseworkSessions);
    setExperiences(store.experiences);
    setProjects(store.projects);
    if (store.certificates && store.certificates.length > 0) {
      setCertificates(store.certificates);
      populateCertForm(store.certificates[0]);
    }

    const first = store.courseworkSessions[0];
    if (first) {
      populateSessionForm(first);
    }
  }, []);

  const populateCertForm = (c: CertificateItem) => {
    setSelectedCertId(c.id);
    setCertTitle(c.title);
    setCertIssuer(c.issuer);
    setCertIssueDate(c.issueDate);
    setCertCategory(c.category || "Kompetisi");
    setCertCredentialId(c.credentialId || "");
    setCertImageUrl(c.imageUrl || "");
    setCertFileUrl(c.fileUrl || "");
    setCertVerifyUrl(c.verifyUrl || "");
    setCertSummaryId(c.summaryId || "");
    setCertSummaryEn(c.summaryEn || "");
    setCertSortOrder(c.sortOrder || 1);
    setCertIsVisible(c.isVisible !== false);
  };

  const handlePrepareNewCert = () => {
    setSelectedCertId(null);
    setCertTitle("");
    setCertIssuer("");
    setCertIssueDate(new Date().getFullYear().toString());
    setCertCategory("Kompetisi");
    setCertCredentialId("");
    setCertImageUrl("");
    setCertFileUrl("");
    setCertVerifyUrl("");
    setCertSummaryId("");
    setCertSummaryEn("");
    setCertSortOrder(certificates.length + 1);
    setCertIsVisible(true);
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim() || !certImageUrl.trim()) {
      notify("Judul, Penerbit, dan URL Foto/Thumbnail Sertifikat wajib diisi!");
      return;
    }

    const item: CertificateItem = {
      id: selectedCertId || `cert-${Date.now()}`,
      title: certTitle.trim(),
      issuer: certIssuer.trim(),
      issueDate: certIssueDate.trim(),
      credentialId: certCredentialId.trim(),
      category: certCategory.trim() || "Kompetisi",
      imageUrl: certImageUrl.trim(),
      fileUrl: certFileUrl.trim() || null,
      verifyUrl: certVerifyUrl.trim() || null,
      summaryId: certSummaryId.trim(),
      summaryEn: certSummaryEn.trim() || certSummaryId.trim(),
      sortOrder: Number(certSortOrder) || 1,
      isVisible: certIsVisible,
    };

    const res = await upsertCertificateItem(item);
    setCertificates(res.store.certificates);
    setSelectedCertId(item.id);
    notify(
      res.syncedToSupabase
        ? `Sertifikat "${item.title}" tersimpan & disinkronkan ke Supabase!`
        : `Sertifikat "${item.title}" tersimpan di CMS lokal!`
    );
  };

  const handleDeleteCert = async (id: string, title: string) => {
    if (!confirm(`Hapus sertifikat "${title}"?`)) return;
    const res = await deleteCertificateItem(id);
    setCertificates(res.store.certificates);
    if (selectedCertId === id) {
      handlePrepareNewCert();
    }
    notify(`Sertifikat "${title}" berhasil dihapus.`);
  };

  const handleUploadCertFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      notify("Ukuran file maksimal 8MB.");
      return;
    }

    setCertUploading(true);
    try {
      const isPdf = file.type === "application/pdf";
      const cleanName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, "-");
      const path = `certs/${Date.now()}-${cleanName}`;

      if (isSupabaseConfigured()) {
        const supabase = createClient();
        if (supabase) {
          const { error: upErr } = await supabase.storage
            .from("certificates")
            .upload(path, file, { upsert: true, contentType: file.type });

          if (!upErr) {
            const { data } = supabase.storage
              .from("certificates")
              .getPublicUrl(path);
            if (data?.publicUrl) {
              if (isPdf) {
                setCertFileUrl(data.publicUrl);
                notify(
                  "Berkas PDF sertifikat berhasil diunggah ke Supabase Storage!"
                );
              } else {
                setCertImageUrl(data.publicUrl);
                notify(
                  "Foto sertifikat berhasil diunggah ke Supabase Storage!"
                );
              }
              setCertUploading(false);
              return;
            }
          }
        }
      }

      // Offline / Local File preview fallback
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const url = loadEvt.target?.result as string;
        if (isPdf) {
          setCertFileUrl(url);
          notify("PDF dimuat secara lokal.");
        } else {
          setCertImageUrl(url);
          notify("Foto sertifikat dimuat secara lokal.");
        }
        setCertUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      notify("Gagal mengunggah file sertifikat.");
      setCertUploading(false);
    }
  };

  const populateSessionForm = (s: KwuSessionItem) => {
    setSelectedSessionNumber(s.number);
    setSessionNumInput(s.number);
    setSessionTitle(s.titleId);
    setSessionDesc(s.descId);
    setSessionDate(s.sessionDate || `Minggu ${s.number} · 2026`);
    setAttendanceStatus(s.attendanceStatus || "Hadir");
    setAttendanceProofUrl(s.attendanceProofUrl || "");
    setTaskTitle(s.taskTitle || "");
    setTaskDescription(s.taskDescription || "");
    setTaskUrl(s.taskUrl || "");
    setTaskStatus(s.taskStatus || "Selesai");
  };

  const handlePrepareNewSession = () => {
    const nextNum =
      sessions.length > 0
        ? Math.max(...sessions.map((s) => s.number)) + 1
        : 1;
    setSelectedSessionNumber(nextNum);
    setSessionNumInput(nextNum);
    setSessionTitle(`Materi Perkuliahan Pertemuan ${nextNum}`);
    setSessionDesc(
      `Dokumentasi kehadiran dan rincian tugas pertemuan ke-${nextNum} mata kuliah Kewirausahaan.`
    );
    setSessionDate(`Minggu ${nextNum} · 2026`);
    setAttendanceStatus("Hadir");
    setAttendanceProofUrl("");
    setTaskTitle(`Tugas Mingguan Pertemuan ${nextNum}`);
    setTaskDescription("");
    setTaskUrl("https://sites.google.com/view/pdhlii/halaman-muka");
    setTaskStatus("Selesai");
    notify(`Form disiapkan untuk Pertemuan ${nextNum} baru.`);
  };

  const handleProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      notify("Ukuran gambar maksimal 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAttendanceProofUrl(reader.result);
        notify(`Bukti foto "${file.name}" siap disimpan.`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(sessionNumInput) || 1;
    const code = `PERTEMUAN ${String(num).padStart(2, "0")}`;
    const item: KwuSessionItem = {
      id: `kwu-${String(num).padStart(2, "0")}`,
      number: num,
      code,
      titleId: sessionTitle.trim() || `Pertemuan ${num}`,
      titleEn: sessionTitle.trim() || `Session ${num}`,
      descId: sessionDesc.trim(),
      descEn: sessionDesc.trim(),
      sessionDate: sessionDate.trim(),
      attendanceStatus,
      attendanceProofUrl: attendanceProofUrl.trim() || null,
      taskTitle: taskTitle.trim(),
      taskDescription: taskDescription.trim(),
      taskUrl: taskUrl.trim(),
      taskStatus,
    };

    const { syncedToSupabase, store } = await upsertCourseworkSession(item);
    setSessions(store.courseworkSessions);
    setSelectedSessionNumber(num);
    notify(
      syncedToSupabase
        ? `${code} berhasil disimpan ke Supabase PostgreSQL & Website!`
        : `${code} (Absen, Bukti & Tugas) berhasil disimpan dan diperbarui di Website!`
    );
  };

  const handleDeleteSession = async (num: number) => {
    const { store } = await deleteCourseworkSession(num);
    setSessions(store.courseworkSessions);
    if (store.courseworkSessions[0]) {
      populateSessionForm(store.courseworkSessions[0]);
    }
    notify(`Pertemuan ${num} telah dihapus.`);
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expCompany.trim() || !expRole.trim()) return;

    const highlights = [expHighlight1.trim(), expHighlight2.trim()].filter(
      Boolean
    );

    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      indexCode: String(experiences.length + 1).padStart(2, "0"),
      company: expCompany.trim(),
      roleId: expRole.trim(),
      roleEn: expRole.trim(),
      employmentType: expType.trim() || "PENGALAMAN KERJA",
      location: "Indonesia",
      period: expPeriod.trim() || "2026",
      isCurrent: true,
      metricsBadge: expBadge.trim() || "Full-Stack Engineering",
      summaryId:
        expSummary.trim() ||
        "Berkontribusi dalam pengembangan aplikasi dan sistem teknologi.",
      summaryEn:
        expSummary.trim() ||
        "Contributed to software application and system engineering.",
      highlightsId:
        highlights.length > 0
          ? highlights
          : ["Pengembangan arsitektur aplikasi dan integrasi database."],
      highlightsEn:
        highlights.length > 0
          ? highlights
          : ["Application architecture development and database integration."],
      stack: expStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const { store } = await upsertExperienceItem(newExp);
    setExperiences(store.experiences);
    setExpCompany("");
    setExpRole("");
    setExpBadge("");
    setExpSummary("");
    setExpHighlight1("");
    setExpHighlight2("");
    notify(`Pengalaman "${newExp.roleId} · ${newExp.company}" ditambahkan!`);
  };

  const handleDeleteExperience = async (id: string) => {
    if (experiences.length <= 1) {
      notify("Minimal 1 pengalaman utama harus tetap ditampilkan.");
      return;
    }
    const { store } = await deleteExperienceItem(id);
    setExperiences(store.experiences);
    notify("Item pengalaman dihapus.");
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;
    const slug =
      projSlug.trim() ||
      projTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newProj: ProjectCaseStudy = {
      id: `proj-${Date.now()}`,
      indexCode: String(projects.length + 1).padStart(2, "0"),
      slug,
      title: projTitle.trim(),
      category: projCategory.trim(),
      year: projYear.trim() || "2026",
      clientOrContext: projClient.trim() || "Proyek Mandiri / Instansi",
      roleId: projRole.trim() || "Full-Stack Developer",
      roleEn: projRole.trim() || "Full-Stack Developer",
      featured: true,
      status: "published",
      summaryId:
        projSummary.trim() ||
        "Dokumentasi studi kasus proyek perangkat lunak yang ditambahkan melalui CMS Admin.",
      summaryEn:
        projSummary.trim() ||
        "Software engineering project case study documented via Admin CMS.",
      recruiterExecSummaryId: projSummary.trim(),
      recruiterExecSummaryEn: projSummary.trim(),
      problemId: projSummary.trim(),
      problemEn: projSummary.trim(),
      architectureId: "Arsitektur modern terintegrasi.",
      architectureEn: "Integrated modern software architecture.",
      tradeoffs: [],
      metrics: [
        {
          labelId: "Status Rilis",
          labelEn: "Release Status",
          value: "Production",
          delta: "Verified",
        },
      ],
      stack: projStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      liveUrl: projUrl.trim() || "https://github.com/fadli154",
      repoUrl: projUrl.trim() || "https://github.com/fadli154",
      accentColor: "#5b31c8",
      diagramSpec: {
        inputNode: "Client Input",
        edgeNode: "API & Logic",
        coreNode: "Database & AI",
        outputNode: "Verified Output",
        throughputLabel: "Production Ready",
      },
    };

    const { store } = await upsertProjectItem(newProj);
    setProjects(store.projects);
    setProjTitle("");
    setProjSlug("");
    setProjSummary("");
    notify(`Studi Kasus Proyek "${newProj.title}" berhasil dipublikasikan!`);
  };

  const handleDeleteProject = async (id: string) => {
    if (projects.length <= 1) {
      notify("Minimal 1 studi kasus proyek utama harus tetap ditampilkan.");
      return;
    }
    const { store } = await deleteProjectItem(id);
    setProjects(store.projects);
    notify("Studi kasus proyek dihapus.");
  };

  const handleLogout = async () => {
    document.cookie = "fadli_admin_auth=; path=/; max-age=0; SameSite=Lax";
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase?.auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f2] text-[#111213]">
      {/* Top Private Command Bar */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#111213] text-[#f5f5f2]">
        <div className="mx-auto flex max-w-[1540px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 font-mono text-xs text-white/85 transition hover:border-[#c4e22e] hover:text-[#c4e22e]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Lihat Website Publik</span>
            </Link>
            <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider">
              <Lock className="h-3.5 w-3.5 text-[#c4e22e]" />
              <span>FADLI CMS · DASHBOARD ADMIN KHUSUS</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-white/80">
              <Database className="h-3.5 w-3.5 text-[#c4e22e]" />
              <span>
                {dataSource === "supabase-live"
                  ? "SUPABASE POSTGRESQL (CONNECTED)"
                  : "HYBRID SUPABASE + LOCAL CMS STORE"}
              </span>
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-4 py-1.5 font-semibold text-rose-300 transition hover:bg-rose-500 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 rounded-full border border-[#c4e22e] bg-[#111213] px-5 py-3 font-mono text-xs text-[#f5f5f2] shadow-2xl"
          role="status"
        >
          <span className="text-[#c4e22e]">● CMS SYNC:</span> {toast}
        </div>
      )}

      <div className="mx-auto grid max-w-[1540px] grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-12">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3">
          <nav
            className="space-y-1.5 rounded-[24px] border border-black/10 bg-white p-3 shadow-sm"
            aria-label="CMS navigation"
          >
            {[
              {
                id: "coursework" as const,
                label: `01 · Kuliah, Absen & Tugas (${sessions.length})`,
                icon: BookOpen,
              },
              {
                id: "certificates" as const,
                label: `02 · Sertifikat & Drift Wall (${certificates.length})`,
                icon: Award,
              },
              {
                id: "experiences" as const,
                label: `03 · Pengalaman Nyata (${experiences.length})`,
                icon: Briefcase,
              },
              {
                id: "projects" as const,
                label: `04 · Studi Kasus Proyek (${projects.length})`,
                icon: FileCode2,
              },
              {
                id: "inbox" as const,
                label: `05 · Pesan Masuk & RLS (${inquiries.filter((i) => i.status === "unread").length})`,
                icon: Inbox,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playMechanicalClick(660);
                    setActiveTab(tab.id);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-mono text-xs transition ${
                    active
                      ? "bg-[#111213] font-semibold text-[#c4e22e]"
                      : "text-black/70 hover:bg-black/5 hover:text-black"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-4 rounded-[24px] bg-[#111213] p-5 font-mono text-xs text-white/80">
            <div className="flex items-center gap-2 font-bold uppercase text-[#c4e22e]">
              <ShieldCheck className="h-4 w-4" />
              <span>SUPABASE SYNC READY</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-white/60">
              Setiap penambahan pertemuan kuliah, status absensi, bukti kehadiran, tugas mingguan, pengalaman, dan proyek langsung tersinkronisasi ke halaman utama.
            </p>
          </div>
        </aside>

        {/* Main Content Panel */}
        <div className="lg:col-span-9">
          {/* =================================================================
              TAB 01: MATA KULIAH KEWIRAUSAHAAN (PERTEMUAN, ABSEN, BUKTI, TUGAS)
             ================================================================= */}
          {activeTab === "coursework" && (
            <div className="space-y-6">
              <div className="rounded-[28px] border border-black/10 bg-white p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-5">
                  <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#5b31c8]">
                      CMS MATA KULIAH KEWIRAUSAHAAN · KELOMPOK K-1
                    </span>
                    <h1 className="mt-1 text-2xl font-medium tracking-tight">
                      Kelola Pertemuan, Absensi, Bukti Hadir &amp; Tugas
                    </h1>
                  </div>
                  <button
                    type="button"
                    onClick={handlePrepareNewSession}
                    className="inline-flex items-center gap-2 rounded-full bg-[#c4e22e] px-5 py-2.5 text-xs font-bold text-[#111213] transition hover:bg-[#d5f240]"
                  >
                    <Plus className="h-4 w-4" />
                    <span>+ Tambah Pertemuan Baru</span>
                  </button>
                </div>

                {/* Pertemuan Selector Pills */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {sessions.map((s) => {
                    const isSelected = s.number === selectedSessionNumber;
                    return (
                      <button
                        key={s.number}
                        type="button"
                        onClick={() => populateSessionForm(s)}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs transition ${
                          isSelected
                            ? "bg-[#111213] font-bold text-[#c4e22e]"
                            : "border border-black/15 bg-[#f5f5f2] text-black/80 hover:bg-black/10"
                        }`}
                      >
                        <span>P{s.number}</span>
                        <span className="text-[10px] opacity-75">
                          ({s.attendanceStatus || "Hadir"})
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Form Edit / Create Pertemuan */}
                <form onSubmit={handleSaveSession} className="mt-7 space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                        Nomor Pertemuan *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={32}
                        required
                        value={sessionNumInput}
                        onChange={(e) =>
                          setSessionNumInput(Number(e.target.value) || 1)
                        }
                        className="mt-1.5 w-full rounded-2xl border border-black/15 bg-[#f5f5f2] px-4 py-2.5 font-mono text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                        Minggu / Tanggal Pertemuan
                      </label>
                      <input
                        type="text"
                        value={sessionDate}
                        onChange={(e) => setSessionDate(e.target.value)}
                        placeholder="Minggu 7 · 2026"
                        className="mt-1.5 w-full rounded-2xl border border-black/15 bg-[#f5f5f2] px-4 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                        Status Absensi Kehadiran *
                      </label>
                      <select
                        value={attendanceStatus}
                        onChange={(e) =>
                          setAttendanceStatus(
                            e.target.value as
                              | "Hadir"
                              | "Izin"
                              | "Sakit"
                              | "Belum Dimulai"
                          )
                        }
                        className="mt-1.5 w-full rounded-2xl border border-black/15 bg-[#f5f5f2] px-4 py-2.5 text-sm font-semibold"
                      >
                        <option value="Hadir">Hadir ✓</option>
                        <option value="Izin">Izin</option>
                        <option value="Sakit">Sakit</option>
                        <option value="Belum Dimulai">Belum Dimulai</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                      Judul Materi Pertemuan *
                    </label>
                    <input
                      type="text"
                      required
                      value={sessionTitle}
                      onChange={(e) => setSessionTitle(e.target.value)}
                      placeholder="Contoh: Validasi MVP & Strategi Go-To-Market"
                      className="mt-1.5 w-full rounded-2xl border border-black/15 bg-[#f5f5f2] px-4 py-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                      Ringkasan Materi / Catatan Kehadiran
                    </label>
                    <textarea
                      rows={2}
                      value={sessionDesc}
                      onChange={(e) => setSessionDesc(e.target.value)}
                      placeholder="Deskripsi singkat materi perkuliahan pada pertemuan ini..."
                      className="mt-1.5 w-full rounded-2xl border border-black/15 bg-[#f5f5f2] px-4 py-2.5 text-sm"
                    />
                  </div>

                  {/* Bukti Kehadiran Upload & URL */}
                  <div className="rounded-2xl border border-black/12 bg-[#f5f5f2] p-5">
                    <div className="font-mono text-xs font-bold uppercase text-[#5b31c8]">
                      BUKTI KEHADIRAN (UPLOAD FOTO / SCREENSHOT ATAU TEMPEL URL)
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/20 bg-white p-4 text-center transition hover:border-[#5b31c8]">
                          <Upload className="h-5 w-5 text-[#5b31c8]" />
                          <span className="mt-1.5 text-xs font-semibold">
                            Pilih File Foto / Screenshot Bukti Hadir
                          </span>
                          <span className="text-[11px] text-black/50">
                            PNG, JPG, WebP (Maks 5MB)
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProofFileChange}
                            className="sr-only"
                          />
                        </label>
                        <input
                          type="text"
                          value={attendanceProofUrl}
                          onChange={(e) =>
                            setAttendanceProofUrl(e.target.value)
                          }
                          placeholder="Atau tempel URL gambar bukti hadir..."
                          className="mt-2.5 w-full rounded-xl border border-black/15 bg-white px-3 py-2 font-mono text-xs"
                        />
                      </div>

                      <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-white p-2">
                        {attendanceProofUrl ? (
                          <div className="relative h-36 w-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={attendanceProofUrl}
                              alt="Preview Bukti Hadir"
                              className="h-full w-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => setAttendanceProofUrl("")}
                              className="absolute right-2 top-2 rounded-full bg-rose-600 px-2.5 py-1 font-mono text-[10px] font-bold text-white"
                            >
                              Hapus Foto
                            </button>
                          </div>
                        ) : (
                          <span className="font-mono text-xs text-black/45">
                            Belum ada foto bukti hadir untuk Pertemuan {sessionNumInput}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tugas-Tugas Setiap Pertemuan */}
                  <div className="rounded-2xl border border-black/12 bg-[#f5f5f2] p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase text-[#111213]">
                        RINCIAN TUGAS PERTEMUAN {sessionNumInput}
                      </span>
                      <ClipboardCheck className="h-4 w-4 text-[#5b31c8]" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                          Judul Tugas Pertemuan
                        </label>
                        <input
                          type="text"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          placeholder="Contoh: Analisis Kompetitor & BMC Kelompok K-1"
                          className="mt-1 w-full rounded-xl border border-black/15 bg-white px-3.5 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                          Status Pengerjaan Tugas
                        </label>
                        <select
                          value={taskStatus}
                          onChange={(e) =>
                            setTaskStatus(
                              e.target.value as
                                | "Selesai"
                                | "Proses"
                                | "Belum Ada Tugas"
                            )
                          }
                          className="mt-1 w-full rounded-xl border border-black/15 bg-white px-3.5 py-2 text-sm font-semibold"
                        >
                          <option value="Selesai">Selesai ✓</option>
                          <option value="Proses">Sedang Dikerjakan</option>
                          <option value="Belum Ada Tugas">Belum Ada Tugas</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                        Deskripsi / Isi Tugas
                      </label>
                      <textarea
                        rows={2}
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        placeholder="Penjelasan tugas yang dikerjakan pada pertemuan ini..."
                        className="mt-1 w-full rounded-xl border border-black/15 bg-white px-3.5 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                        Link Tugas / Dokumen / Google Sites / GitHub
                      </label>
                      <input
                        type="url"
                        value={taskUrl}
                        onChange={(e) => setTaskUrl(e.target.value)}
                        placeholder="https://sites.google.com/view/pdhlii/halaman-muka"
                        className="mt-1 w-full rounded-xl border border-black/15 bg-white px-3.5 py-2 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-[#111213] px-6 py-3 text-xs font-semibold text-[#c4e22e] transition hover:bg-[#5b31c8] hover:text-white"
                    >
                      <Save className="h-4 w-4" />
                      <span>
                        Simpan Pertemuan {sessionNumInput} (Absen, Bukti &amp; Tugas) ke Supabase
                      </span>
                    </button>

                    {sessions.some((s) => s.number === sessionNumInput) &&
                      sessions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSession(sessionNumInput)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 px-4 py-2.5 font-mono text-xs font-semibold text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Hapus Pertemuan {sessionNumInput}</span>
                        </button>
                      )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 02: SERTIFIKAT & LISENSI DINAMIS (DRIFT WALL & /CERTIFICATES)
             ================================================================= */}
          {activeTab === "certificates" && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="rounded-[28px] border border-black/10 bg-white p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-5">
                  <div>
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#5b31c8]">
                      MANAJEMEN SERTIFIKAT · 3D DRIFT WALL &amp; SUPABASE POSTGRESQL
                    </span>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight">
                      Katalog Sertifikasi &amp; Penghargaan ({certificates.length})
                    </h2>
                    <p className="mt-1 text-xs text-black/60">
                      Sertifikat yang Anda simpan di sini otomatis dirender secara real-time pada 3D Drift Wall di Beranda publik dan halaman /certificates.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        playMechanicalClick(620);
                        handlePrepareNewCert();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#111213] px-4 py-2 font-mono text-xs font-bold text-[#c4e22e] hover:bg-[#5b31c8]"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Tambah Sertifikat Baru</span>
                    </button>
                  </div>
                </div>

                {/* List of Existing Certificates */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {certificates.map((cert) => {
                    const isSelected = selectedCertId === cert.id;
                    return (
                      <div
                        key={cert.id}
                        onClick={() => {
                          playMechanicalClick(680);
                          populateCertForm(cert);
                        }}
                        className={`cursor-pointer rounded-2xl border p-4 transition ${
                          isSelected
                            ? "border-[#5b31c8] bg-[#5b31c8]/5 ring-2 ring-[#5b31c8]/20"
                            : "border-black/10 bg-[#f5f5f2] hover:border-black/30"
                        }`}
                      >
                        {/* Thumbnail image */}
                        <div className="relative h-32 w-full overflow-hidden rounded-xl border border-black/10 bg-black/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cert.imageUrl}
                            alt={cert.title}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute bottom-2 left-2 rounded-full bg-black/75 px-2 py-0.5 font-mono text-[9px] font-bold text-[#c4e22e]">
                            {cert.category}
                          </span>
                          <span className="absolute top-2 right-2 rounded-full bg-black/75 px-2 py-0.5 font-mono text-[9px] text-white">
                            Urutan #{cert.sortOrder}
                          </span>
                        </div>

                        <div className="mt-3">
                          <div className="font-mono text-[10px] text-black/50">
                            {cert.issuer} · {cert.issueDate}
                          </div>
                          <h4 className="mt-1 line-clamp-2 text-sm font-bold text-black">
                            {cert.title}
                          </h4>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-2 font-mono text-[11px]">
                          <span
                            className={
                              cert.isVisible !== false
                                ? "text-emerald-700 font-semibold"
                                : "text-zinc-500"
                            }
                          >
                            {cert.isVisible !== false ? "● Publik Aktif" : "○ Disembunyikan"}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCert(cert.id, cert.title);
                            }}
                            className="text-rose-600 hover:underline"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Certificate Form Editor */}
              <form
                onSubmit={handleSaveCert}
                className="rounded-[28px] border border-black/10 bg-white p-6 md:p-8 space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
                  <div>
                    <span className="font-mono text-xs font-bold uppercase text-[#5b31c8]">
                      {selectedCertId
                        ? `EDIT SERTIFIKAT: ${certTitle || "Tanpa Judul"}`
                        : "FORMULIR PENAMBAHAN SERTIFIKAT BARU"}
                    </span>
                    <p className="text-xs text-black/60">
                      Isi data sertifikat, upload foto/PDF, dan simpan untuk langsung diperbarui di database Supabase.
                    </p>
                  </div>
                  {selectedCertId && (
                    <button
                      type="button"
                      onClick={handlePrepareNewCert}
                      className="font-mono text-xs text-[#5b31c8] hover:underline"
                    >
                      Batal Edit / Buat Baru
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-black/70">
                      Judul Sertifikat / Penghargaan *
                    </label>
                    <input
                      type="text"
                      required
                      value={certTitle}
                      onChange={(e) => setCertTitle(e.target.value)}
                      placeholder="Contoh: Juara II Literasi Inovasi Teknologi · OASE III PTKIN 2026"
                      className="mt-1 w-full rounded-2xl border border-black/15 bg-[#f5f5f2] px-4 py-2.5 text-sm focus:border-[#5b31c8] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-black/70">
                      Penerbit / Penyelenggara *
                    </label>
                    <input
                      type="text"
                      required
                      value={certIssuer}
                      onChange={(e) => setCertIssuer(e.target.value)}
                      placeholder="Contoh: Kementerian Agama Republik Indonesia"
                      className="mt-1 w-full rounded-2xl border border-black/15 bg-[#f5f5f2] px-4 py-2.5 text-sm focus:border-[#5b31c8] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-black/70">
                      Tanggal / Waktu Perolehan *
                    </label>
                    <input
                      type="text"
                      required
                      value={certIssueDate}
                      onChange={(e) => setCertIssueDate(e.target.value)}
                      placeholder="Contoh: 7 November 2026"
                      className="mt-1 w-full rounded-2xl border border-black/15 bg-[#f5f5f2] px-4 py-2.5 text-sm focus:border-[#5b31c8] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-black/70">
                      Kategori Bidang
                    </label>
                    <input
                      type="text"
                      value={certCategory}
                      onChange={(e) => setCertCategory(e.target.value)}
                      placeholder="Contoh: Kompetisi / Frontend & Web / AI & Data"
                      className="mt-1 w-full rounded-2xl border border-black/15 bg-[#f5f5f2] px-4 py-2.5 text-sm focus:border-[#5b31c8] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-black/70">
                      Nomor Kredensial / SK (Opsional)
                    </label>
                    <input
                      type="text"
                      value={certCredentialId}
                      onChange={(e) => setCertCredentialId(e.target.value)}
                      placeholder="Contoh: 712/Dt.I.III/PP.01/11/2026"
                      className="mt-1 w-full rounded-2xl border border-black/15 bg-[#f5f5f2] px-4 py-2.5 text-sm focus:border-[#5b31c8] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Upload Section */}
                <div className="rounded-2xl border border-dashed border-black/20 bg-[#f5f5f2] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-mono text-xs font-bold uppercase text-[#5b31c8]">
                        UNGAH BERKAS SERTIFIKAT (FOTO ATAU PDF)
                      </div>
                      <p className="mt-0.5 text-xs text-black/60">
                        Otomatis disimpan ke bucket Storage Supabase `certificates`. Mendukung file JPG, PNG, WebP, dan PDF hingga 8MB.
                      </p>
                    </div>

                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#111213] px-4 py-2 font-mono text-xs font-semibold text-[#c4e22e] hover:bg-[#5b31c8]">
                      <Upload className="h-4 w-4" />
                      <span>{certUploading ? "Mengunggah..." : "Pilih Berkas..."}</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        disabled={certUploading}
                        onChange={handleUploadCertFile}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Preview uploaded image if available */}
                  {certImageUrl && (
                    <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-black/10 pt-4">
                      <div className="relative h-28 w-44 overflow-hidden rounded-xl border border-black/10 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={certImageUrl}
                          alt="Preview Sertifikat"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="text-xs">
                        <div className="font-mono font-semibold text-emerald-700">
                          ✓ Foto Thumbnail Aktif
                        </div>
                        <div className="mt-1 max-w-md truncate font-mono text-[11px] text-black/50">
                          {certImageUrl}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-black/70">
                      URL Foto / Thumbnail Tile Drift Wall *
                    </label>
                    <input
                      type="text"
                      required
                      value={certImageUrl}
                      onChange={(e) => setCertImageUrl(e.target.value)}
                      placeholder="https://... atau /sertif/nama-file.webp"
                      className="mt-1 w-full rounded-2xl border border-black/15 bg-[#f5f5f2] px-4 py-2.5 font-mono text-xs focus:border-[#5b31c8] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-black/70">
                      URL Berkas Asli / PDF (Opsional)
                    </label>
                    <input
                      type="text"
                      value={certFileUrl}
                      onChange={(e) => setCertFileUrl(e.target.value)}
                      placeholder="https://... atau /sertif/nama-file.pdf"
                      className="mt-1 w-full rounded-2xl border border-black/15 bg-[#f5f5f2] px-4 py-2.5 font-mono text-xs focus:border-[#5b31c8] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-black/70">
                      URL Verifikasi Online (Opsional)
                    </label>
                    <input
                      type="url"
                      value={certVerifyUrl}
                      onChange={(e) => setCertVerifyUrl(e.target.value)}
                      placeholder="https://verifikasi-sertifikat.example.com"
                      className="mt-1 w-full rounded-2xl border border-black/15 bg-[#f5f5f2] px-4 py-2.5 font-mono text-xs focus:border-[#5b31c8] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-black/70">
                        Urutan Tampil (Sort)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={certSortOrder}
                        onChange={(e) => setCertSortOrder(Number(e.target.value))}
                        className="mt-1 w-full rounded-2xl border border-black/15 bg-[#f5f5f2] px-4 py-2.5 text-sm focus:border-[#5b31c8] focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-black/15 bg-[#f5f5f2] px-4 py-3 text-xs font-semibold text-black/80">
                        <input
                          type="checkbox"
                          checked={certIsVisible}
                          onChange={(e) => setCertIsVisible(e.target.checked)}
                          className="h-4 w-4 rounded accent-[#5b31c8]"
                        />
                        <span>Tampilkan di Publik</span>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-black/70">
                      Deskripsi / Catatan Capaian
                    </label>
                    <textarea
                      rows={3}
                      value={certSummaryId}
                      onChange={(e) => setCertSummaryId(e.target.value)}
                      placeholder="Rincian mengenai perlombaan, cabang yang dijuarai, instansi, atau keahlian yang diakui..."
                      className="mt-1 w-full rounded-2xl border border-black/15 bg-[#f5f5f2] px-4 py-2.5 text-sm focus:border-[#5b31c8] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-5">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-[#111213] px-6 py-3 font-mono text-xs font-bold text-[#c4e22e] shadow-md transition hover:bg-[#5b31c8]"
                  >
                    <Save className="h-4 w-4" />
                    <span>
                      {selectedCertId
                        ? "Perbarui Sertifikat di Supabase"
                        : "Simpan Sertifikat Baru ke Supabase"}
                    </span>
                  </button>

                  {selectedCertId && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCert(selectedCertId, certTitle)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 px-4 py-2.5 font-mono text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus Sertifikat</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* =================================================================
              TAB 03: PENGALAMAN NYATA (EXPERIENCES DYNAMIC CRUD)
             ================================================================= */}
          {activeTab === "experiences" && (
            <div className="space-y-6">
              <form
                onSubmit={handleAddExperience}
                className="rounded-[28px] border border-black/10 bg-white p-6 md:p-8 space-y-4"
              >
                <div className="font-mono text-xs font-bold uppercase text-[#5b31c8]">
                  + TAMBAH PENGALAMAN NYATA BARU KE WEBSITE &amp; SUPABASE
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                      Nama Instansi / Perusahaan *
                    </label>
                    <input
                      type="text"
                      required
                      value={expCompany}
                      onChange={(e) => setExpCompany(e.target.value)}
                      placeholder="Contoh: Dinas Komunikasi dan Informatika"
                      className="mt-1 w-full rounded-xl border border-black/15 bg-[#f5f5f2] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                      Peran / Jabatan *
                    </label>
                    <input
                      type="text"
                      required
                      value={expRole}
                      onChange={(e) => setExpRole(e.target.value)}
                      placeholder="Contoh: Web Developer Intern"
                      className="mt-1 w-full rounded-xl border border-black/15 bg-[#f5f5f2] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                      Tipe Pengalaman
                    </label>
                    <input
                      type="text"
                      value={expType}
                      onChange={(e) => setExpType(e.target.value)}
                      placeholder="MAGANG RESMI / FREELANCE"
                      className="mt-1 w-full rounded-xl border border-black/15 bg-[#f5f5f2] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                      Periode Tahun
                    </label>
                    <input
                      type="text"
                      value={expPeriod}
                      onChange={(e) => setExpPeriod(e.target.value)}
                      placeholder="2025 - Present"
                      className="mt-1 w-full rounded-xl border border-black/15 bg-[#f5f5f2] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                      Badge Proyek / Fokus
                    </label>
                    <input
                      type="text"
                      value={expBadge}
                      onChange={(e) => setExpBadge(e.target.value)}
                      placeholder="GovTech · Sistem Pelaporan"
                      className="mt-1 w-full rounded-xl border border-black/15 bg-[#f5f5f2] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                    Ringkasan Pengalaman
                  </label>
                  <textarea
                    rows={2}
                    value={expSummary}
                    onChange={(e) => setExpSummary(e.target.value)}
                    placeholder="Deskripsi kontribusi utama pada instansi/perusahaan ini..."
                    className="mt-1 w-full rounded-xl border border-black/15 bg-[#f5f5f2] px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                      Poin Pencapaian 1
                    </label>
                    <input
                      type="text"
                      value={expHighlight1}
                      onChange={(e) => setExpHighlight1(e.target.value)}
                      placeholder="Membangun modul CRUD dan validasi data..."
                      className="mt-1 w-full rounded-xl border border-black/15 bg-[#f5f5f2] px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                      Poin Pencapaian 2
                    </label>
                    <input
                      type="text"
                      value={expHighlight2}
                      onChange={(e) => setExpHighlight2(e.target.value)}
                      placeholder="Mengoptimasi relasi database dan hak akses..."
                      className="mt-1 w-full rounded-xl border border-black/15 bg-[#f5f5f2] px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                    Tech Stack (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={expStack}
                    onChange={(e) => setExpStack(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-black/15 bg-[#f5f5f2] px-3.5 py-2 font-mono text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#111213] px-6 py-3 text-xs font-semibold text-[#c4e22e] hover:bg-[#5b31c8] hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                  <span>Simpan &amp; Tampilkan Pengalaman</span>
                </button>
              </form>

              {/* Daftar Pengalaman Aktif */}
              <div className="rounded-[28px] border border-black/10 bg-white p-6 md:p-8">
                <h2 className="text-lg font-semibold">
                  Daftar Pengalaman Nyata Aktif ({experiences.length})
                </h2>
                <div className="mt-4 divide-y divide-black/10">
                  {experiences.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className="flex flex-wrap items-center justify-between gap-4 py-4"
                    >
                      <div>
                        <div className="font-mono text-xs text-[#5b31c8]">
                          (0{idx + 1}) · {exp.employmentType} · {exp.period}
                        </div>
                        <div className="mt-0.5 text-lg font-semibold">
                          {exp.roleId} — {exp.company}
                        </div>
                        <p className="mt-1 max-w-2xl text-xs text-black/60">
                          {exp.summaryId}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 px-3.5 py-1.5 font-mono text-xs text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 03: DOKUMENTASI STUDI KASUS PROYEK (PROJECTS DYNAMIC CRUD)
             ================================================================= */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <form
                onSubmit={handleAddProject}
                className="rounded-[28px] border border-black/10 bg-white p-6 md:p-8 space-y-4"
              >
                <div className="font-mono text-xs font-bold uppercase text-[#5b31c8]">
                  + TAMBAH DOKUMENTASI STUDI KASUS PROYEK BARU
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                      Judul Studi Kasus Proyek *
                    </label>
                    <input
                      type="text"
                      required
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="Contoh: SIMDUK Aplikasi Web Pendataan Kependudukan"
                      className="mt-1 w-full rounded-xl border border-black/15 bg-[#f5f5f2] px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                      Slug URL (Opsional)
                    </label>
                    <input
                      type="text"
                      value={projSlug}
                      onChange={(e) => setProjSlug(e.target.value)}
                      placeholder="simduk-kominfo-laravel"
                      className="mt-1 w-full rounded-xl border border-black/15 bg-[#f5f5f2] px-3.5 py-2.5 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                      Kategori Proyek
                    </label>
                    <input
                      type="text"
                      value={projCategory}
                      onChange={(e) => setProjCategory(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-black/15 bg-[#f5f5f2] px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                      Tahun
                    </label>
                    <input
                      type="text"
                      value={projYear}
                      onChange={(e) => setProjYear(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-black/15 bg-[#f5f5f2] px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                      Klien / Konteks
                    </label>
                    <input
                      type="text"
                      value={projClient}
                      onChange={(e) => setProjClient(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-black/15 bg-[#f5f5f2] px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                    Ringkasan Studi Kasus &amp; Solusi Arsitektur *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={projSummary}
                    onChange={(e) => setProjSummary(e.target.value)}
                    placeholder="Jelaskan masalah yang diselesaikan dan arsitektur teknis proyek ini..."
                    className="mt-1 w-full rounded-xl border border-black/15 bg-[#f5f5f2] px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                      Tech Stack (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      value={projStack}
                      onChange={(e) => setProjStack(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-black/15 bg-[#f5f5f2] px-3.5 py-2 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-black/60">
                      Link Repo / Demo
                    </label>
                    <input
                      type="url"
                      value={projUrl}
                      onChange={(e) => setProjUrl(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-black/15 bg-[#f5f5f2] px-3.5 py-2 font-mono text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#111213] px-6 py-3 text-xs font-semibold text-[#c4e22e] hover:bg-[#5b31c8] hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                  <span>Publikasikan Studi Kasus Proyek</span>
                </button>
              </form>

              <div className="rounded-[28px] border border-black/10 bg-white p-6 md:p-8">
                <h2 className="text-lg font-semibold">
                  Studi Kasus Proyek Terdaftar ({projects.length})
                </h2>
                <div className="mt-4 divide-y divide-black/10">
                  {projects.map((p, idx) => (
                    <div
                      key={p.id}
                      className="flex flex-wrap items-center justify-between gap-4 py-4"
                    >
                      <div>
                        <div className="font-mono text-xs text-[#5b31c8]">
                          (0{idx + 1}) · {p.category} · {p.year}
                        </div>
                        <div className="mt-0.5 text-lg font-semibold">
                          {p.title}
                        </div>
                        <p className="mt-1 max-w-2xl text-xs text-black/60">
                          {p.summaryId}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-500/15 px-3 py-1 font-mono text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="mr-1 inline h-3 w-3" />
                          PUBLISHED
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(p.id)}
                          className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 px-3.5 py-1.5 font-mono text-xs text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 04: INBOX & SUPABASE RLS STATUS
             ================================================================= */}
          {activeTab === "inbox" && (
            <div className="rounded-[28px] border border-black/10 bg-white p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-semibold">
                Kotak Masuk Pesan Diskusi ({inquiries.length})
              </h2>
              <div className="space-y-4">
                {inquiries.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-black/10 bg-[#f5f5f2] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-3 font-mono text-xs">
                      <span className="font-bold text-[#5b31c8]">
                        [{item.scope.toUpperCase()}] {item.senderName} ({item.senderEmail})
                      </span>
                      <span className="text-black/50">{item.receivedAt}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed">
                      {item.message}
                    </p>
                    <div className="mt-4 flex items-center justify-between pt-2 font-mono text-xs">
                      <span className="text-black/60">Instansi: {item.company}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setInquiries((prev) =>
                            prev.map((q) =>
                              q.id === item.id ? { ...q, status: "replied" } : q
                            )
                          );
                          notify(`Pesan dari ${item.senderName} ditandai selesai.`);
                        }}
                        className="rounded-full bg-[#111213] px-4 py-1.5 text-white hover:bg-[#5b31c8]"
                      >
                        {item.status === "replied" ? "SUDAH DIBALAS ✓" : "TANDAI DIBALAS"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
