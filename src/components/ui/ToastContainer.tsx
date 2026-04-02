'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeToast } from '@/store/slices/uiSlice';
import { selectToasts } from '@/store/selectors';

const ICONS: Record<string, string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
};

const COLORS: Record<string, string> = {
  success: 'bg-green-600',
  error:   'bg-red-600',
  info:    'bg-brand-action',
};

export default function ToastContainer() {
  const dispatch = useAppDispatch();
  const toasts   = useAppSelector(selectToasts);

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={() => dispatch(removeToast(toast.id))}
        />
      ))}
    </div>
  );
}

function Toast({
  id,
  message,
  type,
  onDismiss,
}: {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 text-white text-sm
        font-medium px-4 py-3 rounded-xl shadow-lg min-w-[260px] max-w-sm
        animate-in slide-in-from-right-5 ${COLORS[type]}`}
    >
      <span className="text-lg leading-none">{ICONS[type]}</span>
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} className="opacity-70 hover:opacity-100 transition-opacity text-lg leading-none">
        ×
      </button>
    </div>
  );
}
