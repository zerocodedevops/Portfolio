import React, { useEffect, useState } from "react";

interface ToastItem {
  id: string;
  type: "success" | "error" | "loading" | "info";
  content: React.ReactNode;
}

let toastsState: ToastItem[] = [];
let toastCounter = 1;
const emitter = new EventTarget();

function notify() {
  emitter.dispatchEvent(new CustomEvent("toasts-updated"));
}

export interface ToastOptions {
  id?: string;
  duration?: number;
  icon?: React.ReactNode;
  position?: string;
  style?: React.CSSProperties;
  className?: string;
}

function upsertToast(
  type: ToastItem["type"],
  content: React.ReactNode,
  options?: ToastOptions,
): string {
  const id = options?.id || `toast_${++toastCounter}`;
  const existingIdx = toastsState.findIndex((t) => t.id === id);
  const item: ToastItem = { id, type, content };

  if (existingIdx >= 0) {
    toastsState = toastsState.map((t, idx) => (idx === existingIdx ? item : t));
  } else {
    toastsState = [...toastsState, item];
  }
  notify();

  if (type !== "loading") {
    const duration = options?.duration ?? 3200;
    setTimeout(() => {
      toastsState = toastsState.filter((t) => t.id !== id);
      notify();
    }, duration);
  }
  return id;
}

export function clearAllDemoToasts(): void {
  toastsState = [];
  notify();
}

const toastFn = Object.assign(
  (content: React.ReactNode, options?: ToastOptions) =>
    upsertToast("info", content, options),
  {
    success: (content: React.ReactNode, options?: ToastOptions) =>
      upsertToast("success", content, options),
    error: (content: React.ReactNode, options?: ToastOptions) =>
      upsertToast("error", content, options),
    loading: (content: React.ReactNode, options?: ToastOptions) =>
      upsertToast("loading", content, options),
    dismiss: (id?: string) => {
      toastsState = id ? toastsState.filter((t) => t.id !== id) : [];
      notify();
    },
    promise: async <T,>(
      promise: Promise<T>,
      msgs: { loading: React.ReactNode; success: React.ReactNode; error: React.ReactNode },
    ): Promise<T> => {
      const id = upsertToast("loading", msgs.loading);
      try {
        const res = await promise;
        upsertToast("success", msgs.success, { id });
        return res;
      } catch (err) {
        upsertToast("error", msgs.error, { id });
        throw err;
      }
    },
  },
);

export const toast = toastFn;
export default toastFn;

export function Toaster(_props?: Record<string, unknown>) {
  const [items, setItems] = useState<ToastItem[]>(toastsState);

  useEffect(() => {
    const handler = () => setItems([...toastsState]);
    emitter.addEventListener("toasts-updated", handler);
    return () => emitter.removeEventListener("toasts-updated", handler);
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      role="status"
      aria-live="polite"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white transition-all ${
            item.type === "error"
              ? "bg-red-600"
              : item.type === "success"
                ? "bg-emerald-700"
                : "bg-slate-800"
          }`}
        >
          <span>
            {item.type === "success" ? "✓" : item.type === "error" ? "✕" : "⏳"}
          </span>
          <div className="flex-1">{item.content}</div>
        </div>
      ))}
    </div>
  );
}
