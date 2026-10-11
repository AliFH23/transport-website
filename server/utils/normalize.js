// Input normalisation shared by every controller.

export const str = (v) => (typeof v === 'string' || typeof v === 'number' ? String(v).trim() : '');

// Convert Arabic-Indic digits (٠-٩) and the Arabic decimal separator (٫) to Latin.
export const toLatinDigits = (s) =>
  String(s)
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/٫/g, '.');

// Normalise any Jordanian mobile format (+962 / 00962 / 962 / 07…) to the local 07XXXXXXXX form.
export const normalizePhone = (raw = '') => {
  let p = toLatinDigits(String(raw).replace(/[\s\-()]/g, ''));
  if (p.startsWith('+962')) p = '0' + p.slice(4);
  else if (p.startsWith('00962')) p = '0' + p.slice(5);
  else if (p.startsWith('962')) p = '0' + p.slice(3);
  return p;
};

/**
 * Parse an optional numeric field. Returns { value } (undefined when empty) or { error }.
 * Accepts numbers or numeric strings, including Arabic-Indic digits.
 */
export const parseNumber = (raw, { min, max, integer = false, label }) => {
  const s = toLatinDigits(str(raw));
  if (s === '') return { value: undefined };
  const n = Number(s);
  if (!Number.isFinite(n)) return { error: `${label} يجب أن يكون رقماً` };
  if (integer && !Number.isInteger(n)) return { error: `${label} يجب أن يكون عدداً صحيحاً` };
  if (n < min || n > max) return { error: `${label} يجب أن يكون بين ${min} و ${max}` };
  return { value: n };
};

export const parseBool = (v) => v === true || v === 'true' || v === 'on' || v === '1' || v === 1;
