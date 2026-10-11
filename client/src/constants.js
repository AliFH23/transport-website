export const COMPANY = {
  name: 'شركة درة المتقين',
  nameEn: 'Durrat Al-Muttaqin Co.',
  tagline: 'نقل البضائع / المواشي على الطرقات',
  sloganMain: 'شريكك في كل طريق',
  sloganValues: ['أمان', 'التزام', 'وصول في الوقت'],
  branch: 'فرع إربد',
  address: 'إربد، المملكة الأردنية الهاشمية',
  mapsQuery: 'Irbid, Jordan',
};

const toIntl = (local) => `962${local.replace(/^0/, '')}`;
// 0795849835 -> "0795 849 835"
const pretty = (local) => local.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3');

export const PHONES = ['0795849835', '0792678854'].map((local) => ({
  local,
  display: pretty(local),
  tel: `tel:+${toIntl(local)}`,
  whatsapp: `https://wa.me/${toIntl(local)}`,
}));

export const PRIMARY_PHONE = PHONES[0];

export const SERVICE_TYPES = ['نقل بضائع', 'نقل مواشي'];

export const STATUS_LABELS = {
  Pending: { label: 'قيد الانتظار', className: 'bg-amber-100 text-amber-800 ring-amber-300' },
  'In-Progress': { label: 'قيد التنفيذ', className: 'bg-sky-100 text-sky-800 ring-sky-300' },
  Completed: { label: 'مكتمل', className: 'bg-emerald-100 text-emerald-800 ring-emerald-300' },
};

export const NAV_LINKS = [
  { href: '#home', label: 'الرئيسية' },
  { href: '#services', label: 'خدماتنا' },
  { href: '#about', label: 'عن الشركة' },
  { href: '#branch', label: 'فرع إربد' },
  { href: '#contact', label: 'اتصل بنا' },
];
