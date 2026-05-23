'use client';

import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, isVisible, onClose, duration = 2500 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom fade-in duration-300">
      <div className="flex items-center gap-3 bg-foreground text-background px-5 py-3 rounded-full shadow-xl">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <Check className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-medium whitespace-nowrap">{message}</span>
        <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
