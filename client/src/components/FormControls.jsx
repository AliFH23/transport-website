import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { LOCATION_GROUPS } from '../constants';

// Jordanian mobile in any common format (07…, +9627…, 009627…). The server normalises it to 07XXXXXXXX.
export const PHONE_RE = /^(?:\+?962|00962|0)?7[789]\d{7}$/;
export const isJoMobile = (v) =>
  PHONE_RE.test(String(v).replace(/[\s-]/g, '').replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))));
export const PHONE_ERROR = 'رقم أردني غير صحيح — مثال: 0795849835';

// aria props for an input whose error is rendered by <Field>.
export const ariaFor = (id, error) => ({ 'aria-invalid': !!error, 'aria-describedby': error ? `${id}-error` : undefined });

export function Field({ id, label, error, hint, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

// Pill-style radio group (e.g. service type, cargo type).
export function ChoiceGroup({ name, label, options, value, onChange, columns = 'grid-cols-2' }) {
  return (
    <div className={`grid gap-3 ${columns}`} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <label
          key={o}
          className={`cursor-pointer rounded-xl border px-4 py-3 text-center font-bold transition ${
            value === o ? 'border-gold bg-gold/15 text-navy ring-2 ring-gold/40' : 'border-slate-300 text-slate-600 hover:border-gold/60'
          }`}
        >
          <input type="radio" name={name} value={o} checked={value === o} onChange={onChange} className="sr-only" />
          {o}
        </label>
      ))}
    </div>
  );
}

export function LocationSelect({ placeholder = 'اختر المدينة', className = 'input', ...props }) {
  return (
    <select className={className} {...props}>
      <option value="">{placeholder}</option>
      {LOCATION_GROUPS.map((g) => (
        <optgroup key={g.label} label={g.label}>
          {g.options.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

export function SelectInput({ options, placeholder, className = 'input', ...props }) {
  return (
    <select className={className} {...props}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

// Optional price in JOD + "قابل للتفاوض" toggle.
export function PriceFields({ idPrefix, label = 'السعر المعروض (دينار أردني)', values, errors, onChange }) {
  const id = `${idPrefix}-price`;
  return (
    <Field id={id} label={label} error={errors.price} hint="اختياري — اتركه فارغاً إن كان السعر عند الاتصال">
      <div className="flex items-stretch gap-3">
        <div className="relative flex-1">
          <input id={id} name="price" type="number" inputMode="decimal" min="1" max="100000" step="any" dir="ltr"
            value={values.price} onChange={onChange} className="input pl-14 text-right" placeholder="0" {...ariaFor(id, errors.price)} />
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-bold text-slate-400">د.أ</span>
        </div>
        <label className={`flex cursor-pointer select-none items-center gap-2 rounded-xl border px-4 text-sm font-bold transition ${
          values.negotiable ? 'border-gold bg-gold/15 text-navy' : 'border-slate-300 text-slate-600 hover:border-gold/60'
        }`}>
          <input type="checkbox" name="negotiable" checked={values.negotiable} onChange={onChange} className="h-4 w-4 accent-[#D4AF37]" />
          قابل للتفاوض
        </label>
      </div>
    </Field>
  );
}

export function FormAlert({ children }) {
  return (
    <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 ring-1 ring-red-200 sm:col-span-2">
      {children}
    </p>
  );
}

export function SubmitButton({ loading, children }) {
  return (
    <button type="submit" disabled={loading} className="btn-gold py-4 text-lg sm:col-span-2">
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
      {loading ? 'جارٍ الإرسال...' : children}
    </button>
  );
}

export function SuccessPanel({ title = 'شكراً لك!', message, onReset, resetLabel }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <CheckCircle2 className="h-16 w-16 text-emerald-500" />
      <h3 className="mt-4 font-display text-2xl font-black text-navy">{title}</h3>
      <p className="mt-2 max-w-md text-slate-600">{message}</p>
      <button type="button" onClick={onReset} className="btn-dark mt-6">
        {resetLabel}
      </button>
    </div>
  );
}
