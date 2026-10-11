import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Phone, X } from 'lucide-react';
import Logo from './Logo';
import PhoneNumber from './PhoneNumber';
import { NAV_LINKS, PRIMARY_PHONE } from '../constants';
import { useBooking } from '../hooks/useBooking';

// Route links (/loads, /drivers) are highlighted on their own page; section links never are.
const isActive = (to, pathname) => !to.includes('#') && to !== '/' && pathname.startsWith(to);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openBooking } = useBooking();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || menuOpen ? 'bg-navy/95 shadow-lg backdrop-blur' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-20 items-center justify-between gap-4">
        <Logo light />

        <ul className="hidden items-center gap-0.5 xl:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`rounded-lg px-2.5 py-2 text-sm font-bold transition hover:bg-white/5 hover:text-gold ${
                  isActive(l.to, pathname) ? 'text-gold' : 'text-slate-200'
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 xl:flex">
          <a href={PRIMARY_PHONE.tel} className="btn-outline hidden px-4 py-2 text-sm 2xl:inline-flex">
            <Phone className="h-4 w-4" />
            <PhoneNumber phone={PRIMARY_PHONE} />
          </a>
          <a href={PRIMARY_PHONE.tel} className="btn-outline h-10 w-10 p-0 2xl:hidden" aria-label="اتصل بنا">
            <Phone className="h-4 w-4" />
          </a>
          <button type="button" onClick={() => openBooking()} className="btn-gold px-4 py-2 text-sm">
            اطلب نقلة
          </button>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
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
        <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-white/10 xl:hidden">
          <ul className="container-x flex flex-col py-3">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-lg px-3 py-3 font-bold hover:bg-white/5 hover:text-gold ${
                    isActive(l.to, pathname) ? 'text-gold' : 'text-slate-200'
                  }`}
                >
                  {l.label}
                </Link>
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
