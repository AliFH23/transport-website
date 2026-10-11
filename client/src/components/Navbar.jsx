import { useEffect, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import Logo from './Logo';
import PhoneNumber from './PhoneNumber';
import { NAV_LINKS, PRIMARY_PHONE } from '../constants';
import { useBooking } from '../hooks/useBooking';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openBooking } = useBooking();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || menuOpen ? 'bg-navy/95 shadow-lg backdrop-blur' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-20 items-center justify-between gap-4">
        <Logo light />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/5 hover:text-gold"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={PRIMARY_PHONE.tel} className="btn-outline px-4 py-2 text-sm">
            <Phone className="h-4 w-4" />
            <PhoneNumber phone={PRIMARY_PHONE} />
          </a>
          <button type="button" onClick={() => openBooking()} className="btn-gold px-4 py-2 text-sm">
            اطلب نقلة
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a href={PRIMARY_PHONE.tel} className="btn-gold h-11 w-11 p-0" aria-label="اتصل بنا">
            <Phone className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="btn h-11 w-11 border border-white/20 p-0 text-white"
            aria-label="القائمة"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/10 lg:hidden">
          <ul className="container-x flex flex-col py-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-3 font-bold text-slate-200 hover:bg-white/5 hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openBooking();
                }}
                className="btn-gold w-full"
              >
                اطلب نقلة الآن
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
