import { Link } from 'react-router-dom';
import { COMPANY } from '../constants';

export function LogoMark({ className = 'h-11 w-11' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logo-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6EDC8" />
          <stop offset=".5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#937222" />
        </linearGradient>
      </defs>
      <path d="M24 6l4 5 4-6 4 6 4-5-1.5 8h-13z" fill="url(#logo-gold)" />
      <path d="M14 18h19c12 0 20 8 20 18s-8 18-20 18H14l5-6h14c8 0 14-5 14-12s-6-12-14-12H19z" fill="url(#logo-gold)" />
      <rect x="21" y="30" width="14" height="9" rx="1.2" fill="currentColor" />
      <rect x="35" y="32.5" width="6" height="6.5" rx="1.2" fill="currentColor" />
      <circle cx="25" cy="41" r="2" fill="currentColor" />
      <circle cx="37" cy="41" r="2" fill="currentColor" />
      <path d="M4 60c12-2 22-9 30-5" stroke="url(#logo-gold)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label={COMPANY.name}>
      <LogoMark className={`h-11 w-11 ${light ? 'text-white' : 'text-navy'}`} />
      <span className="leading-tight">
        <span className={`block font-display text-lg font-black sm:text-xl ${light ? 'text-white' : 'text-navy'}`}>
          {COMPANY.name}
        </span>
        <span className="block text-[11px] font-semibold text-gold">{COMPANY.tagline}</span>
      </span>
    </Link>
  );
}
