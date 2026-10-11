import { ArrowLeft, Check, Globe2, Package, Beef } from 'lucide-react';
import { useBooking } from '../hooks/useBooking';

const SERVICES = [
  {
    icon: Package,
    title: 'نقل البضائع',
    service: 'نقل بضائع',
    desc: 'نقل جميع أنواع البضائع والحمولات التجارية بشاحنات مغلقة ومجهزة، مع تحميل وتنزيل احترافي.',
    points: ['شاحنات مغلقة ومؤمنة', 'حمولات كاملة وجزئية', 'متابعة الشحنة حتى التسليم'],
  },
  {
    icon: Beef,
    title: 'نقل المواشي',
    service: 'نقل مواشي',
    desc: 'نقل الأغنام والأبقار والمواشي على الطرقات بمقطورات مخصصة مهوّاة تراعي سلامة وراحة الحيوان.',
    points: ['مقطورات مهوّاة ومخصصة', 'سائقون ذوو خبرة بالمواشي', 'رحلات مباشرة بلا تأخير'],
    featured: true,
  },
  {
    icon: Globe2,
    title: 'النقل الداخلي والخارجي',
    service: '',
    desc: 'تغطية جميع محافظات المملكة انطلاقاً من فرع إربد، ورحلات خارجية إلى الدول المجاورة.',
    points: ['جميع محافظات الأردن', 'رحلات للدول المجاورة', 'أسعار تنافسية وواضحة'],
  },
];

export default function Services() {
  const { openBooking } = useBooking();

  return (
    <section id="services" className="bg-slate-50 py-20 sm:py-24">
      <div className="container-x">
        <div className="text-center">
          <p className="font-bold text-gold-700">ماذا نقدم</p>
          <h2 className="section-title mt-2">خدماتنا</h2>
          <div className="gold-line" />
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, desc, points, service, featured }) => (
            <article
              key={title}
              className={`group relative flex flex-col overflow-hidden rounded-3xl p-8 transition duration-300 hover:-translate-y-1 ${
                featured
                  ? 'bg-navy text-white shadow-2xl ring-1 ring-gold/40'
                  : 'bg-white text-navy shadow-lg ring-1 ring-slate-200 hover:shadow-xl'
              }`}
            >
              <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-gold/10 transition group-hover:scale-125" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-gradient text-navy shadow-gold">
                <Icon className="h-8 w-8" />
              </div>
              <h3 className="relative mt-6 font-display text-2xl font-black">{title}</h3>
              <p className={`relative mt-3 leading-7 ${featured ? 'text-slate-300' : 'text-slate-600'}`}>{desc}</p>
              <ul className="relative mt-6 space-y-2.5">
                {points.map((p) => (
                  <li key={p} className="flex items-center gap-2 font-semibold">
                    <Check className="h-5 w-5 shrink-0 text-gold" />
                    {p}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => openBooking(service)}
                className={`relative mt-8 ${featured ? 'btn-gold' : 'btn-dark'} self-start`}
              >
                اطلب الخدمة
                <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
