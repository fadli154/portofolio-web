"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  initSoundPreference,
  playMechanicalClick,
  setSoundEnabled as persistSound,
} from "@/lib/audio/sound-effects";

export type Locale = "en" | "id";
export type LensMode = "craft" | "recruiter";
export type ThemeMode = "dark" | "light";

interface PortfolioStateContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  lens: LensMode;
  setLens: (lens: LensMode) => void;
  toggleLens: () => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  soundOn: boolean;
  toggleSound: () => void;
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  inquiryOpen: boolean;
  setInquiryOpen: (open: boolean) => void;
  initialInquiryScope: "full-time" | "contract" | "advisory" | "general";
  openInquiryWithScope: (scope?: "full-time" | "contract" | "advisory" | "general") => void;
}

const PortfolioStateContext = createContext<PortfolioStateContextValue | null>(null);

export function PortfolioStateProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id");
  const [lens, setLensState] = useState<LensMode>("recruiter");
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [soundOn, setSoundOn] = useState<boolean>(false);
  const [commandOpen, setCommandOpen] = useState<boolean>(false);
  const [inquiryOpen, setInquiryOpen] = useState<boolean>(false);
  const [initialInquiryScope, setInitialInquiryScope] = useState<
    "full-time" | "contract" | "advisory" | "general"
  >("full-time");

  useEffect(() => {
    setSoundOn(initSoundPreference());
    try {
      const savedLocale = window.localStorage.getItem("fadli_locale") as Locale | null;
      if (savedLocale === "en" || savedLocale === "id") {
        setLocaleState(savedLocale);
      }
      document.documentElement.setAttribute("data-theme", "light");
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        playMechanicalClick(700);
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const setLocale = (next: Locale) => {
    playMechanicalClick(660);
    setLocaleState(next);
    try {
      window.localStorage.setItem("fadli_locale", next);
    } catch {
      // ignore
    }
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "id" : "en");
  };

  const setTheme = (next: ThemeMode) => {
    playMechanicalClick(580);
    setThemeState(next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", next);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const setLens = (next: LensMode) => {
    playMechanicalClick(720);
    setLensState(next);
    const syncedTheme: ThemeMode = next === "recruiter" ? "light" : "dark";
    setThemeState(syncedTheme);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-lens", next);
      document.documentElement.setAttribute("data-theme", syncedTheme);
    }
    try {
      window.localStorage.setItem("fadli_lens", next);
    } catch {
      // ignore
    }
  };

  const toggleLens = () => {
    setLens(lens === "craft" ? "recruiter" : "craft");
  };

  const toggleSound = () => {
    const next = !soundOn;
    persistSound(next);
    setSoundOn(next);
    if (next) {
      playMechanicalClick(780);
    }
  };

  const openInquiryWithScope = (
    scope: "full-time" | "contract" | "advisory" | "general" = "full-time"
  ) => {
    playMechanicalClick(740);
    setInitialInquiryScope(scope);
    setInquiryOpen(true);
  };

  return (
    <PortfolioStateContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        lens,
        setLens,
        toggleLens,
        theme,
        setTheme,
        toggleTheme,
        soundOn,
        toggleSound,
        commandOpen,
        setCommandOpen,
        inquiryOpen,
        setInquiryOpen,
        initialInquiryScope,
        openInquiryWithScope,
      }}
    >
      {children}
    </PortfolioStateContext.Provider>
  );
}

export function usePortfolioState() {
  const ctx = useContext(PortfolioStateContext);
  if (!ctx) {
    throw new Error("usePortfolioState must be used within a PortfolioStateProvider");
  }
  return ctx;
}

