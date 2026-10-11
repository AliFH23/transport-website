import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import BookingForm from './BookingForm';
import { useBooking } from '../hooks/useBooking';

export default function BookingModal() {
  const { open, presetService, closeBooking } = useBooking();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && closeBooking();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, closeBooking]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-navy/70 backdrop-blur-sm" onClick={closeBooking} aria-hidden="true" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="relative max-h-[92vh] w-full max-w-2xl animate-fade-up overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl outline-none sm:rounded-3xl sm:p-8"
      >
        <button type="button" onClick={closeBooking} aria-label="إغلاق"
          className="absolute left-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-navy">
          <X className="h-6 w-6" />
        </button>
        <h2 id="booking-modal-title" className="font-display text-2xl font-black text-navy">طلب خدمة نقل</h2>
        <p className="mt-1 text-slate-500">املأ البيانات وسيتواصل معك فريقنا لتأكيد الموعد والسعر.</p>
        <div className="mt-6">
          <BookingForm presetService={presetService} idPrefix="modal" />
        </div>
      </div>
    </div>
  );
}
