import { Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import { COMPANY, PHONES } from '../constants';
import PhoneNumber from './PhoneNumber';

export default function Contact() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(COMPANY.mapsQuery)}&output=embed`;

  return (
    <section id="contact" className="bg-slate-50 py-20 sm:py-24">
      <div className="container-x">
        <div className="text-center">
          <p className="font-bold text-gold-700">تواصل معنا</p>
          <h2 className="section-title mt-2">اتصل بنا</h2>
          <div className="gold-line" />
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            {PHONES.map((p, i) => (
              <div key={p.local} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold">
                    <Phone className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">{i === 0 ? 'الرقم الرئيسي' : 'رقم إضافي'}</p>
                    <a href={p.tel} className="text-2xl font-black text-navy hover:text-gold-700">
                      <PhoneNumber phone={p} />
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={p.tel} className="btn-dark px-4 py-2 text-sm">
                    <Phone className="h-4 w-4" /> اتصال
                  </a>
                  <a href={p.whatsapp} target="_blank" rel="noopener noreferrer" className="btn bg-[#25D366] px-4 py-2 text-sm text-white hover:brightness-110">
                    <MessageCircle className="h-4 w-4" /> واتساب
                  </a>
                </div>
              </div>
            ))}

            <div id="branch" className="rounded-2xl bg-navy p-6 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <MapPin className="h-7 w-7 text-gold" />
                <h3 className="font-display text-2xl font-black">{COMPANY.branch}</h3>
              </div>
              <p className="mt-3 text-slate-300">{COMPANY.address}</p>
              <p className="mt-2 flex items-center gap-2 text-slate-300">
                <Clock className="h-5 w-5 text-gold" />
                نستقبل طلباتكم يومياً — للحالات العاجلة اتصل مباشرة
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.mapsQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold mt-5 text-sm"
              >
                <MapPin className="h-4 w-4" /> افتح في خرائط Google
              </a>
            </div>
          </div>

          <div className="min-h-[320px] overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-200">
            <iframe
              title={`موقع ${COMPANY.branch}`}
              src={mapSrc}
              className="h-full min-h-[320px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
