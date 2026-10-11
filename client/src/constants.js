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

// Call / WhatsApp links for any Jordanian mobile stored in local 07XXXXXXXX form.
export const phoneLinks = (local) => ({
  local,
  display: pretty(local),
  tel: `tel:+${toIntl(local)}`,
  whatsapp: `https://wa.me/${toIntl(local)}`,
});

export const PHONES = ['0795849835', '0792678854'].map(phoneLinks);

export const PRIMARY_PHONE = PHONES[0];

export const SERVICE_TYPES = ['نقل بضائع', 'نقل مواشي'];

export const STATUS_LABELS = {
  Pending: { label: 'قيد الانتظار', className: 'bg-amber-100 text-amber-800 ring-amber-300' },
  'In-Progress': { label: 'قيد التنفيذ', className: 'bg-sky-100 text-sky-800 ring-sky-300' },
  Completed: { label: 'مكتمل', className: 'bg-emerald-100 text-emerald-800 ring-emerald-300' },
};

// `to` values with a hash scroll to that section on the home page (see ScrollManager in App.jsx).
export const NAV_LINKS = [
  { to: '/', label: 'الرئيسية' },
  { to: '/#services', label: 'خدماتنا' },
  { to: '/loads', label: 'عروض البضائع' },
  { to: '/drivers', label: 'سائقين متوفرين' },
  { to: '/#about', label: 'عن الشركة' },
  { to: '/#branch', label: 'فرع إربد' },
  { to: '/#contact', label: 'اتصل بنا' },
];

// ---------- Marketplace (keep in sync with server/config/marketplace.js) ----------

export const LOCATION_GROUPS = [
  {
    label: 'الأردن',
    options: ['عمّان', 'إربد', 'الزرقاء', 'المفرق', 'الرمثا', 'جرش', 'عجلون', 'السلط', 'مادبا', 'الكرك', 'الطفيلة', 'معان', 'العقبة', 'الأغوار'],
  },
  { label: 'دول الجوار', options: ['السعودية', 'العراق', 'سوريا', 'فلسطين'] },
];

export const CARGO_TYPES = ['بضائع', 'مواشي'];
export const ANIMAL_TYPES = ['أغنام', 'ماعز', 'أبقار', 'إبل', 'خيول', 'أخرى'];
export const TRUCK_TYPES = ['براد', 'قلاب', 'مسطح/سطحة', 'ستارة', 'صندوق مغلق', 'ناقلة مواشي', 'تنك', 'أخرى'];
export const TRAILER_LENGTH_FILTERS = [6, 8, 10, 12, 13.6];

// Listings can be posted for a pickup / availability date up to this many days ahead.
export const LISTING_TTL_DAYS = 14;

export const LISTING_STATUS_LABELS = {
  Pending: { label: 'بانتظار المراجعة', className: 'bg-amber-100 text-amber-800 ring-amber-300' },
  Approved: { label: 'منشور', className: 'bg-emerald-100 text-emerald-800 ring-emerald-300' },
  Rejected: { label: 'مرفوض', className: 'bg-red-100 text-red-800 ring-red-300' },
  Expired: { label: 'منتهي', className: 'bg-slate-200 text-slate-700 ring-slate-300' },
};
