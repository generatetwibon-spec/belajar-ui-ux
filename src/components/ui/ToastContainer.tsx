'use client';

import { useApp } from '@/context/AppContext';
import { ToastMessage } from '@/lib/types';
import { useEffect, useState } from 'react';

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  };

  const styles = {
    success: 'bg-siaga-secondary text-white',
    error: 'bg-siaga-error text-white',
    info: 'bg-siaga-primary-container text-white',
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-toast max-w-sm w-full transition-all duration-300 ${styles[toast.type]} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <span
        className="material-symbols-outlined text-[22px] flex-shrink-0"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icons[toast.type]}
      </span>
      <p className="flex-1 text-body-md font-semibold leading-snug">{toast.message}</p>
      <button
        onClick={onRemove}
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full max-w-sm">
          <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );
}
