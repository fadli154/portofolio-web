"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";

export default function AdminLoginPage() {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const [email, setEmail] = useState("fadli.hifziansyah@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || password.trim().length < 4) {
      setErrorMsg("Masukkan email admin dan password minimal 4 karakter.");
      return;
    }

    setLoading(true);
    try {
      if (configured) {
        const supabase = createClient();
        if (supabase) {
          const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (error) {
            setErrorMsg(error.message);
            setLoading(false);
            return;
          }
        }
      }

      // Set authenticated session cookie for middleware gate
      document.cookie =
        "fadli_admin_auth=authenticated; path=/; max-age=86400; SameSite=Lax";
      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMsg("Gagal memverifikasi sesi login admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#111213] px-4 py-12 text-[#f5f5f2]">
      <div className="w-full max-w-md">
        <SpotlightCard
          spotlightColor="rgba(196, 226, 46, 0.16)"
          className="rounded-[28px] border border-white/15 bg-[#181a1f] p-7 shadow-2xl md:p-9"
        >
          <div className="flex items-center justify-between border-b border-white/12 pb-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#c4e22e] px-3 py-1 font-mono text-[11px] font-bold uppercase text-[#111213]">
              <Lock className="h-3 w-3" />
              <span>PRIVATE ADMIN LOGIN</span>
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-white/60 hover:text-[#c4e22e]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Beranda Publik</span>
            </Link>
          </div>

          <h1 className="mt-6 text-2xl font-medium tracking-tight text-white md:text-3xl">
            Login CMS Portofolio
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-white/60">
            Halaman khusus untuk Fadli Hifziansyah mengelola Pertemuan Mata Kuliah Kewirausahaan, Absensi, Bukti Kehadiran, Tugas, Pengalaman Nyata, serta Studi Kasus Proyek ke Supabase.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block font-mono text-[11px] uppercase tracking-wider text-white/65"
              >
                Email Admin
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="fadli.hifziansyah@gmail.com"
                className="mt-1.5 w-full rounded-2xl border border-white/15 bg-[#111213] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#c4e22e] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block font-mono text-[11px] uppercase tracking-wider text-white/65"
              >
                Password / Kunci Akses
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin..."
                className="mt-1.5 w-full rounded-2xl border border-white/15 bg-[#111213] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#c4e22e] focus:outline-none"
              />
            </div>

            {errorMsg && (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3.5 font-mono text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c4e22e] px-6 py-3.5 text-sm font-semibold text-[#111213] transition hover:bg-[#d5f240] disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" />
              <span>
                {loading
                  ? "Memverifikasi Sesi..."
                  : "Masuk ke Dashboard Admin CMS"}
              </span>
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between border-t border-white/12 pt-4 font-mono text-[11px] text-white/45">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#c4e22e]" />
              <span>PROTECTED ROUTE (/ADMIN)</span>
            </span>
            <span>SUPABASE + RLS</span>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
