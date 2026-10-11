// Lightweight vector truck so the hero has no heavy image dependency.
// Replace with a real fleet photo (e.g. /images/truck.webp) when available.
export default function TruckIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 520 300" className={className} role="img" aria-label="شاحنة نقل">
      <defs>
        <linearGradient id="t-gold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#F6EDC8" />
          <stop offset=".5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#937222" />
        </linearGradient>
        <linearGradient id="t-body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#334155" />
          <stop offset="1" stopColor="#1E293B" />
        </linearGradient>
        <linearGradient id="t-glass" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#94A3B8" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      <ellipse cx="260" cy="262" rx="240" ry="14" fill="#000" opacity=".35" />

      {/* Trailer */}
      <rect x="20" y="60" width="330" height="170" rx="10" fill="url(#t-body)" stroke="#475569" />
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i} x1={50 + i * 30} y1="70" x2={50 + i * 30} y2="220" stroke="#475569" strokeWidth="2" />
      ))}
      <rect x="20" y="200" width="330" height="10" fill="url(#t-gold)" />
      <text x="185" y="150" textAnchor="middle" fontFamily="Tajawal, Cairo" fontWeight="900" fontSize="34" fill="url(#t-gold)">
        درة المتقين
      </text>

      {/* Cab */}
      <path d="M360 100h70c18 0 30 10 38 26l24 44c4 8 6 16 6 24v36H360z" fill="url(#t-body)" stroke="#475569" />
      <path d="M375 112h52c10 0 18 6 23 15l17 33H375z" fill="url(#t-glass)" />
      <rect x="360" y="200" width="138" height="10" fill="url(#t-gold)" />
      <rect x="480" y="210" width="20" height="10" rx="3" fill="#FDE68A" />
      <rect x="350" y="92" width="10" height="138" fill="#1E293B" />

      {/* Wheels */}
      {[80, 140, 290, 410, 465].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="240" r="24" fill="#0B1220" />
          <circle cx={cx} cy="240" r="11" fill="url(#t-gold)" />
        </g>
      ))}

      {/* Speed lines */}
      <g stroke="url(#t-gold)" strokeLinecap="round" strokeWidth="5" opacity=".9">
        <line x1="505" y1="120" x2="515" y2="120" />
        <line x1="0" y1="110" x2="12" y2="110" />
        <line x1="0" y1="140" x2="8" y2="140" />
      </g>
    </svg>
  );
}
