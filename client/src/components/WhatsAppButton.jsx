import { PRIMARY_PHONE, COMPANY } from '../constants';

export default function WhatsAppButton() {
  const text = encodeURIComponent(`السلام عليكم، أرغب بالاستفسار عن خدمات ${COMPANY.name}`);
  return (
    <a
      href={`${PRIMARY_PHONE.whatsapp}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="group fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-110"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
      <svg viewBox="0 0 32 32" className="relative h-8 w-8" fill="currentColor" aria-hidden="true">
        <path d="M16.04 3C9.07 3 3.4 8.66 3.4 15.62c0 2.23.58 4.4 1.69 6.32L3.3 28.7l6.92-1.77a12.6 12.6 0 0 0 5.82 1.42h.01c6.97 0 12.64-5.66 12.64-12.62C28.69 8.66 23.01 3 16.04 3Zm0 23.02h-.01a10.5 10.5 0 0 1-5.35-1.46l-.38-.23-4.1 1.05 1.1-4-.25-.41a10.33 10.33 0 0 1-1.6-5.55c0-5.75 4.69-10.42 10.6-10.42 5.73 0 10.4 4.67 10.4 10.42 0 5.74-4.67 10.6-10.41 10.6Zm5.7-7.8c-.31-.16-1.85-.91-2.14-1.02-.29-.1-.5-.16-.7.16-.21.31-.81 1.01-.99 1.22-.18.21-.37.23-.68.08-.31-.16-1.32-.49-2.51-1.55-.93-.83-1.56-1.85-1.74-2.16-.18-.31-.02-.48.14-.64.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.7-1.69-.96-2.31-.25-.6-.51-.52-.7-.53h-.6c-.21 0-.55.08-.83.39-.29.31-1.09 1.06-1.09 2.6 0 1.53 1.12 3.01 1.27 3.22.16.21 2.2 3.36 5.33 4.71.75.32 1.33.51 1.78.66.75.24 1.43.2 1.97.12.6-.09 1.85-.76 2.11-1.49.26-.73.26-1.35.18-1.49-.08-.13-.28-.21-.59-.36Z" />
      </svg>
      <span className="pointer-events-none absolute left-16 whitespace-nowrap rounded-lg bg-navy px-3 py-1.5 text-sm font-bold opacity-0 shadow-lg transition group-hover:opacity-100">
        راسلنا على واتساب
      </span>
    </a>
  );
}
