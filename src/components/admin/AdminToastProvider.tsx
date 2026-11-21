"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import SwipeToast from "@/components/SwipeToast";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  showToast: (opts: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useAdminToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useAdminToast must be used within an AdminToastProvider");
  }
  return ctx;
}

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toastState, setToastState] = useState<{
    open: boolean;
    title: string;
    description: string;
    variant: ToastVariant;
    duration: number;
    id: number;
  }>({
    open: false,
    title: "",
    description: "",
    variant: "info",
    duration: 3800,
    id: 0,
  });

  const showToast = useCallback(
    ({ title, description = "", variant = "success", duration = 3800 }: ToastOptions) => {
      setToastState({
        open: true,
        title,
        description,
        variant,
        duration,
        id: Date.now(),
      });
    },
    []
  );

  const getVariantStyles = (v: ToastVariant) => {
    switch (v) {
      case "success":
        return {
          background: "#101115",
          color: "#ffffff",
          fuseColor: "#c4e22e",
          icon: <CheckCircle2 className="h-5 w-5 text-[#c4e22e] shrink-0" />,
        };
      case "error":
        return {
          background: "#1a0f12",
          color: "#ffffff",
          fuseColor: "#f43f5e",
          icon: <XCircle className="h-5 w-5 text-rose-400 shrink-0" />,
        };
      case "warning":
        return {
          background: "#161713",
          color: "#ffffff",
          fuseColor: "#c4e22e",
          icon: <AlertTriangle className="h-5 w-5 text-[#c4e22e] shrink-0" />,
        };
      default:
        return {
          background: "#101115",
          color: "#ffffff",
          fuseColor: "#c4e22e",
          icon: <Info className="h-5 w-5 text-[#c4e22e] shrink-0" />,
        };
    }
  };

  const currentStyles = getVariantStyles(toastState.variant);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastState.open && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-[100] max-w-[calc(100vw-32px)]">
          <SwipeToast
            key={toastState.id}
            open={toastState.open}
            title={toastState.title}
            description={toastState.description}
            icon={currentStyles.icon}
            background={currentStyles.background}
            color={currentStyles.color}
            fuseColor={currentStyles.fuseColor}
            duration={toastState.duration}
            onClose={() => setToastState((prev) => ({ ...prev, open: false }))}
            closeButton={true}
            dismissible={true}
          />
        </div>
      )}
    </ToastContext.Provider>
  );
}
