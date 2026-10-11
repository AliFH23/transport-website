import { Link } from 'react-router-dom';
import { ArrowLeft, PackageSearch, Truck } from 'lucide-react';

const ITEMS = [
  {
    to: '/loads',
    icon: PackageSearch,
    title: 'عروض البضائع',
    desc: 'تاجر أو مربي مواشي؟ انشر حمولتك ليتواصل معك السائقون. وأنت سائق؟ تصفّح الحمولات المتاحة الآن.',
    cta: 'تصفّح الحمولات',
  },
  {
    to: '/drivers',
    icon: Truck,
    title: 'سائقين متوفرين',
    desc: 'ابحث عن براد، قلاب، سطحة أو ناقلة مواشي متوفرة قربك. وإن كنت سائقاً، سجّل توفرك واستقبل الطلبات.',
    cta: 'تصفّح السائقين',
  },
];

export default function MarketplaceTeaser() {
  return (
    <section id="marketplace" className="py-20 sm:py-24">
      <div className="container-x">
        <div className="text-center">
          <p className="font-bold text-gold-700">سوق النقل</p>
          <h2 className="section-title mt-2">حمولات وسائقون في مكان واحد</h2>
          <div className="gold-line" />
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            منصة تجمع أصحاب الحمولات بالسائقين المتوفرين. كل إعلان يُراجع من فريقنا قبل نشره.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {ITEMS.map(({ to, icon: Icon, title, desc, cta }) => (
            <Link key={to} to={to}
              className="group relative overflow-hidden rounded-3xl bg-navy p-8 text-white shadow-xl ring-1 ring-gold/30 transition hover:-translate-y-1 hover:ring-gold">
              <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-gold/10 transition group-hover:scale-125" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-gradient text-navy shadow-gold">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="relative mt-5 font-display text-2xl font-black">{title}</h3>
              <p className="relative mt-3 leading-7 text-slate-300">{desc}</p>
              <span className="relative mt-6 inline-flex items-center gap-2 font-bold text-gold">
                {cta} <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
