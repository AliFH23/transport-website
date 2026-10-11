// Formatting helpers. Latin digits are used throughout so numbers match the phone numbers.

const JO_TZ = 'Asia/Amman';

const dayFmt = new Intl.DateTimeFormat('ar-JO-u-nu-latn', { timeZone: JO_TZ, weekday: 'long', day: 'numeric', month: 'long' });
const dateTimeFmt = new Intl.DateTimeFormat('ar-JO-u-nu-latn', { timeZone: JO_TZ, dateStyle: 'medium', timeStyle: 'short' });
const numFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

export const fmtDay = (iso) => dayFmt.format(new Date(iso));
export const fmtDateTime = (iso) => dateTimeFmt.format(new Date(iso));
export const fmtNum = (n) => numFmt.format(n);

// YYYY-MM-DD for today (+ offset days) in Jordan — used for <input type="date"> min/max.
export const jordanDate = (offsetDays = 0) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: JO_TZ }).format(new Date(Date.now() + offsetDays * 86400000));

export const fmtPrice = ({ price, negotiable }) => {
  if (price) return `${fmtNum(price)} د.أ${negotiable ? ' · قابل للتفاوض' : ''}`;
  return negotiable ? 'السعر قابل للتفاوض' : 'السعر عند الاتصال';
};

// "منذ 3 ساعات"-style relative time for listing cards.
const rtf = new Intl.RelativeTimeFormat('ar-u-nu-latn', { numeric: 'auto' });
export const fmtAgo = (iso) => {
  const mins = Math.round((new Date(iso) - Date.now()) / 60000);
  if (Math.abs(mins) < 60) return rtf.format(mins, 'minute');
  const hours = Math.round(mins / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
  return rtf.format(Math.round(hours / 24), 'day');
};
