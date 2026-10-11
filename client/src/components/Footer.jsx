import { Link } from 'react-router-dom';
import { COMPANY, NAV_LINKS, PHONES } from '../constants';
import Logo from './Logo';
import PhoneNumber from './PhoneNumber';

export default function Footer() {
  return (
    <footer className="bg-navy-950 pt-14 text-slate-400">
      <div className="container-x grid gap-10 pb-10 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-4 font-display text-lg font-bold text-gold">{COMPANY.sloganMain}</p>
          <p className="mt-1">{COMPANY.sloganValues.join(' .. ')}</p>
        </div>
        <div>
          <h3 className="font-display text-lg font-black text-white">روابط سريعة</h3>
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-gold">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg font-black text-white">{COMPANY.branch}</h3>
          <p className="mt-4">{COMPANY.address}</p>
          <ul className="mt-3 space-y-1.5">
            {PHONES.map((p) => (
              <li key={p.local}>
                <a href={p.tel} className="font-bold text-slate-200 hover:text-gold">
                  <PhoneNumber phone={p} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm">
        © {new Date().getFullYear()} {COMPANY.name} — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
