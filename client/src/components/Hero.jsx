import { CalendarCheck, Clock, Phone, ShieldCheck, Handshake } from 'lucide-react';
import { COMPANY, PRIMARY_PHONE } from '../constants';
import { useBooking } from '../hooks/useBooking';
import PhoneNumber from './PhoneNumber';
import TruckIllustration from './TruckIllustration';

const VALUE_ICONS = [ShieldCheck, Handshake, Clock];

export default function Hero() {
  const { openBooking } = useBooking();

  return (
    <section id="home" className="relative isolate overflow-hidden bg-navy pt-28 text-white sm:pt-32">
      {/* Sunset glow + mountains backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gold/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.18),transparent_60%)]" />
        <svg className="absolute bottom-24 w-full text-navy-800" viewBox="0 0 1440 220" preserveAspectRatio="none">
          <path fill="currentColor" d="M0 220V140l120-60 140 70 160-110 170 120 150-80 190 90 170-130 180 100 160-60v140z" />
        </svg>
      </div>

      <div className="container-x grid items-center gap-12 pb-16 lg:grid-cols-2 lg:pb-24">
        <div className="animate-fade-up text-center lg:text-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-sm font-bold text-gold">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
            {COMPANY.branch} — {COMPANY.tagline}
          </span>

          <h1 className="mt-6 font-display text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            {COMPANY.name}
            <span className="mt-3 block text-gold-gradient">{COMPANY.sloganMain}</span>
          </h1>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            {COMPANY.sloganValues.map((v, i) => {
              const Icon = VALUE_ICONS[i];
              return (
                <li key={v} className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 font-bold ring-1 ring-white/10">
                  <Icon className="h-5 w-5 text-gold" />
                  {v}
                </li>
              );
            })}
          </ul>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300 lg:mx-0">
            نقل آمن ومنظّم للبضائع والمواشي على طرقات المملكة وخارجها، بأسطول حديث وسائقين محترفين يضمنون وصول
            حمولتك سليمة وفي موعدها.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <button type="button" onClick={() => openBooking()} className="btn-gold px-7 py-4 text-lg">
              <CalendarCheck className="h-5 w-5" />
              احجز نقلتك الآن
            </button>
            <a href={PRIMARY_PHONE.tel} className="btn-outline px-7 py-4 text-lg">
              <Phone className="h-5 w-5" />
              <PhoneNumber phone={PRIMARY_PHONE} />
            </a>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:150ms]">
          <TruckIllustration className="mx-auto w-full max-w-xl drop-shadow-2xl" />
        </div>
      </div>

      {/* Animated road */}
      <div className="relative h-16 bg-navy-950">
        <div className="road-dash absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 animate-road opacity-80" />
      </div>
    </section>
  );
}
