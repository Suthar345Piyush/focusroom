"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}




// ── Singleton event bus ────────────────────────────────────────────────────────


type Listener = (toast: Toast) => void;
const listeners = new Set<Listener>();

export const toast = {
  _emit(t: Toast) { listeners.forEach((l) => l(t)); },
  success: (message: string, duration = 4000) =>
    toast._emit({ id: crypto.randomUUID(), type: "success", message, duration }),
  error: (message: string, duration = 5000) =>
    toast._emit({ id: crypto.randomUUID(), type: "error", message, duration }),
  info: (message: string, duration = 4000) =>
    toast._emit({ id: crypto.randomUUID(), type: "info", message, duration }),
  warning: (message: string, duration = 5000) =>
    toast._emit({ id: crypto.randomUUID(), type: "warning", message, duration }),
};





// ── Styles ─────────────────────────────────────────────────────────────────────


const typeStyles: Record<ToastType, { bar: string; icon: string; label: string }> = {
  success: {
    bar:   "bg-emerald-500",
    icon:  "text-emerald-400",
    label: "✓",
  },
  error: {
    bar:   "bg-red-500",
    icon:  "text-red-400",
    label: "✕",
  },
  info: {
    bar:   "bg-accent",
    icon:  "text-text-accent",
    label: "i",
  },
  warning: {
    bar:   "bg-amber",
    icon:  "text-amber",
    label: "!",
  },
};




// ── ToastItem ─────────────────────────────────────────────────────────────────



function ToastItem({ toast: t, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const { bar, icon, label } = typeStyles[t.type];

  useEffect(() => {
    const timer = setTimeout(() => onRemove(t.id), t.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [t.id, t.duration, onRemove]);




  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0,  scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative flex items-start gap-3 overflow-hidden",
        "w-72 p-3.5 pr-9 rounded-lg card",
        "shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
      )}
    >

      
      {/* Accent bar */}


      <span className={cn("absolute left-0 top-0 bottom-0 w-0.75 rounded-l-lg", bar)} />

      {/* Icon */}


      <span
        className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
          "font-mono text-xs font-bold bg-bg-elevated mt-0.5",
          icon
        )}
      >
        {label}
      </span>



      {/* Message */}


      <p className="text-text-primary text-sm leading-snug">{t.message}</p>



      {/* Dismiss */}


      <button
        onClick={() => onRemove(t.id)}
        className="absolute top-3 right-3 text-text-muted hover:text-text-primary transition-colors"
        aria-label="Dismiss"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </button>
    </motion.div>
  );
}



// ── ToastProvider (mount in root layout) ─────────────────────────────────────


export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Toast) => {
    setToasts((prev) => [...prev.slice(-4), t]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    listeners.add(addToast);
    return () => { listeners.delete(addToast); };
  }, [addToast]);



  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-100 flex flex-col gap-2 items-end pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}