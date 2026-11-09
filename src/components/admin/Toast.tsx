"use client";

import { createContext, useCallback, useContext, useState } from "react";

type Toast = { id: number; text: string; kind: "ok" | "error" };
const Ctx = createContext<(text: string, kind?: "ok" | "error") => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, kind: "ok" | "error" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`rounded-xl px-4 py-3 text-sm text-white shadow-lg ${t.kind === "ok" ? "bg-[#171717]" : "bg-red-600"}`}>
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
