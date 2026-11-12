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
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: `${SITE_PROFILE.fullName} · Portofolio Web, Mobile & AI`,
    template: `%s · ${SITE_PROFILE.shortName}`,
  },
  description:
    "Portofolio Software Engineer Fadli Hifziansyah: proyek Web, Flutter Mobile, Vision AI (HajiCare, Sign2Speech), dan aplikasi pemerintahan Kominfo.",
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
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
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
      className={cn(display.variable, sans.variable, mono.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-full focus:bg-[var(--ink)] focus:px-5 focus:py-2.5 focus:font-sans focus:text-xs focus:font-semibold focus:text-white focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--violet)]"
        >
          Lewati ke konten utama
        </a>

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
