import { Clock, Handshake, ShieldCheck, Truck } from 'lucide-react';
import { COMPANY } from '../constants';

const FEATURES = [
  { icon: ShieldCheck, title: 'أمان', desc: 'حمولتك مؤمّنة ومربوطة باحتراف، ومركباتنا تخضع لصيانة دورية.' },
  { icon: Handshake, title: 'التزام', desc: 'نلتزم بالاتفاق والسعر دون مفاجآت، ونتواصل معك في كل مرحلة.' },
  { icon: Clock, title: 'وصول في الوقت', desc: 'تخطيط مسبق للمسار يضمن وصول الحمولة في موعدها المحدد.' },
  { icon: Truck, title: 'أسطول حديث', desc: 'شاحنات ومقطورات حديثة مخصصة للبضائع وللمواشي.' },
];

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-24">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <div>
          <p className="font-bold text-gold-700">عن الشركة</p>
          <h2 className="section-title mt-2">
            {COMPANY.name} — <span className="text-gold-gradient">{COMPANY.sloganMain}</span>
          </h2>
          <div className="mt-4 h-1 w-24 rounded-full bg-gold-gradient" />
          <p className="mt-6 text-lg leading-8 text-slate-600">
            انطلقت {COMPANY.name} من مدينة إربد لتقدّم خدمات نقل موثوقة للبضائع والمواشي على الطرقات. نؤمن أن كل
            حمولة أمانة، لذلك نعمل وفق ثلاث قيم ثابتة: <strong className="text-navy">أمان .. التزام .. وصول في الوقت</strong>.
          </p>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            سواء كنت تاجراً تحتاج نقل بضاعتك بانتظام، أو مربّي مواشٍ يبحث عن نقل آمن لقطيعه، فريقنا جاهز لخدمتك على
            مدار الأسبوع.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-gold/60 hover:shadow-gold">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-black">{title}</h3>
              <p className="mt-2 leading-7 text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
