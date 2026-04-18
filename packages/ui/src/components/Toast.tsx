import { useState, useEffect } from 'react';

interface ToastItem {
  id: number;
  message: string;
}

let toastId = 0;
const listeners: Set<(toasts: ToastItem[]) => void> = new Set();
let currentToasts: ToastItem[] = [];

function emitToasts(toasts: ToastItem[]) {
  currentToasts = toasts;
  listeners.forEach((fn) => fn(toasts));
}

export function showToast(message: string, duration = 1500) {
  const id = ++toastId;
  const newToasts = [...currentToasts, { id, message }];
  emitToasts(newToasts);
  setTimeout(() => {
    emitToasts(currentToasts.filter((t) => t.id !== id));
  }, duration);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-item">
          {toast.message}
        </div>
      ))}
    </div>
  );
}
