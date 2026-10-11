import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// Accessible bottom-sheet (mobile) / centered (desktop) dialog used by every form pop-up.
export default function Modal({ open, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-navy/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative max-h-[92vh] w-full ${maxWidth} animate-fade-up overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl outline-none sm:rounded-3xl sm:p-8`}
      >
        <button type="button" onClick={onClose} aria-label="إغلاق"
          className="absolute left-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-navy">
          <X className="h-6 w-6" />
        </button>
        <h2 id="modal-title" className="font-display text-2xl font-black text-navy">{title}</h2>
        {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
