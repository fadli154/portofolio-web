import type { Metadata } from "next";
import { display, sans, mono } from "./fonts";
import "./globals.css";
import { PortfolioStateProvider } from "@/lib/i18n/context";
import { MotionSetup } from "@/motion/setup";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CommandPalette } from "@/components/CommandPalette";
import { SmartInquiryModal } from "@/components/SmartInquiryModal";
import { SITE_PROFILE } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: `${SITE_PROFILE.fullName} · Portofolio Web, Mobile & AI`,
    template: `%s · ${SITE_PROFILE.shortName}`,
  },
  description:
    "Portofolio rekayasa perangkat lunak Fadli Hifziansyah (@fadli154): Mahasiswa Informatika (K-1), Web Developer Project Warga Dinas Kominfo, Kopmas GovTech, serta HajiCare & Sign2Speech AI.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_PROFILE.fullName} · Portofolio Web, Mobile & AI`,
    description:
      "Mendokumentasikan karya rekayasa perangkat lunak, proyek Project Warga Kominfo, Kopmas portal aduan nasional, inovasi IoT & Edge AI HajiCare, serta portal Kewirausahaan Kelompok K-1.",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Fadli Hifziansyah · Personal Developer Portfolio",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-theme="light"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-full focus:bg-[var(--ink)] focus:px-5 focus:py-2.5 focus:font-sans focus:text-xs focus:font-semibold focus:text-white focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--violet)]"
        >
          Lewati ke konten utama
        </a>

        {/* Choreographed Preloader (Session-Gated, singkat & minimalis) */}
        <div id="loader" data-loader="" aria-hidden="true">
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)]">
            <span>FADLI HIFZIANSYAH · DEVELOPER PORTFOLIO</span>
            <span>NEXT.JS · TYPESCRIPT · SUPABASE</span>
          </div>
          <div>
            <div data-loader-count="">000</div>
            <div className="mt-4 w-full bg-[var(--rule)]">
              <div data-loader-bar="" />
            </div>
          </div>
        </div>

        {/* Route Transition Curtain */}
        <div data-transition="" aria-hidden="true" />

        <PortfolioStateProvider>
          <MotionSetup>
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
            <CommandPalette />
            <SmartInquiryModal />
          </MotionSetup>
        </PortfolioStateProvider>
      </body>
    </html>
  );
}
