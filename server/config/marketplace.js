// Fixed option lists for the marketplace (loads & drivers).
// Keep in sync with client/src/constants.js — the server is the source of truth for validation.

export const JORDAN_CITIES = [
  'عمّان', 'إربد', 'الزرقاء', 'المفرق', 'الرمثا', 'جرش', 'عجلون',
  'السلط', 'مادبا', 'الكرك', 'الطفيلة', 'معان', 'العقبة', 'الأغوار',
];
export const NEIGHBOR_COUNTRIES = ['السعودية', 'العراق', 'سوريا', 'فلسطين'];
export const LOCATIONS = [...JORDAN_CITIES, ...NEIGHBOR_COUNTRIES];

export const CARGO_TYPES = ['بضائع', 'مواشي'];
export const ANIMAL_TYPES = ['أغنام', 'ماعز', 'أبقار', 'إبل', 'خيول', 'أخرى'];

export const TRUCK_TYPES = ['براد', 'قلاب', 'مسطح/سطحة', 'ستارة', 'صندوق مغلق', 'ناقلة مواشي', 'تنك', 'أخرى'];

export const LISTING_STATUSES = ['Pending', 'Approved', 'Rejected', 'Expired'];

// A listing lives at most this many days, and also ends when its pickup / available-from date passes.
export const LISTING_TTL_DAYS = 14;

// Jordan has used UTC+3 all year since 2022; calendar dates from forms are interpreted in this zone.
export const JO_UTC_OFFSET = '+03:00';
