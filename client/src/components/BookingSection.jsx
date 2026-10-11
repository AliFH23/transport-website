import { ClipboardList, PhoneCall, Truck } from 'lucide-react';
import BookingForm from './BookingForm';

const STEPS = [
  { icon: ClipboardList, title: 'أرسل طلبك', desc: 'املأ النموذج بتفاصيل الحمولة والمسار.' },
  { icon: PhoneCall, title: 'نتواصل معك', desc: 'نؤكد الموعد والسعر خلال وقت قصير.' },
  { icon: Truck, title: 'ننطلق', desc: 'نستلم الحمولة ونوصلها بأمان وفي الوقت.' },
];

export default function BookingSection() {
  return (
    <section id="booking" className="relative overflow-hidden bg-navy py-20 text-white sm:py-24">
      <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-x relative grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="font-bold text-gold">احجز أونلاين</p>
          <h2 className="mt-2 font-display text-3xl font-black sm:text-4xl">اطلب نقلتك بخطوات بسيطة</h2>
          <div className="mt-4 h-1 w-24 rounded-full bg-gold-gradient" />
          <ol className="mt-10 space-y-6">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-gradient text-navy">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-black">
                    <span className="text-gold">{i + 1}.</span> {title}
                  </h3>
                  <p className="text-slate-300">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-3xl bg-white p-6 text-navy shadow-2xl sm:p-8 lg:col-span-3">
          <BookingForm idPrefix="section" />
        </div>
      </div>
    </section>
  );
}
