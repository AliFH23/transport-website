import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { Field, PHONE_ERROR, isJoMobile } from './FormControls';
import { createRequest, getErrorMessage } from '../api/client';
import { SERVICE_TYPES } from '../constants';

const EMPTY = { customerName: '', phone: '', serviceType: '', pickupLocation: '', destination: '', notes: '' };

const validate = (v) => {
  const e = {};
  if (v.customerName.trim().length < 2) e.customerName = 'يرجى إدخال الاسم';
  if (!isJoMobile(v.phone)) e.phone = PHONE_ERROR;
  if (!SERVICE_TYPES.includes(v.serviceType)) e.serviceType = 'اختر نوع الخدمة';
  if (!v.pickupLocation.trim()) e.pickupLocation = 'يرجى تحديد موقع التحميل';
  if (!v.destination.trim()) e.destination = 'يرجى تحديد الوجهة';
  return e;
};

export default function BookingForm({ presetService = '', onSuccess, idPrefix = 'bf' }) {
  const [values, setValues] = useState({ ...EMPTY, serviceType: presetService });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverMsg, setServerMsg] = useState('');

  useEffect(() => {
    if (presetService) setValues((v) => ({ ...v, serviceType: presetService }));
  }, [presetService]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate(values);
    setErrors(v);
    if (Object.keys(v).length) return;

    setStatus('loading');
    try {
      const res = await createRequest(values);
      setStatus('success');
      setServerMsg(res.message);
      setValues({ ...EMPTY });
      onSuccess?.(res.data);
    } catch (err) {
      setStatus('error');
      setServerMsg(getErrorMessage(err));
      if (err?.response?.data?.errors) setErrors(err.response.data.errors);
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        <h3 className="mt-4 font-display text-2xl font-black text-navy">شكراً لك!</h3>
        <p className="mt-2 text-slate-600">{serverMsg}</p>
        <button type="button" onClick={() => setStatus('idle')} className="btn-dark mt-6">
          إرسال طلب آخر
        </button>
      </div>
    );
  }

  const id = (n) => `${idPrefix}-${n}`;
  const aria = (n) => ({ 'aria-invalid': !!errors[n], 'aria-describedby': errors[n] ? `${id(n)}-error` : undefined });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field id={id('customerName')} label="الاسم الكامل *" error={errors.customerName}>
        <input id={id('customerName')} name="customerName" value={values.customerName} onChange={onChange}
          className="input" placeholder="مثال: محمد أحمد" autoComplete="name" {...aria('customerName')} />
      </Field>

      <Field id={id('phone')} label="رقم الهاتف *" error={errors.phone}>
        <input id={id('phone')} name="phone" type="tel" inputMode="tel" dir="ltr" value={values.phone} onChange={onChange}
          className="input text-right placeholder:text-right" placeholder="07XXXXXXXX" autoComplete="tel" {...aria('phone')} />
      </Field>

      <Field id={id('serviceType')} label="نوع الخدمة *" error={errors.serviceType}>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="نوع الخدمة">
          {SERVICE_TYPES.map((s) => (
            <label key={s}
              className={`cursor-pointer rounded-xl border px-4 py-3 text-center font-bold transition ${
                values.serviceType === s ? 'border-gold bg-gold/15 text-navy ring-2 ring-gold/40' : 'border-slate-300 text-slate-600 hover:border-gold/60'
              }`}>
              <input type="radio" name="serviceType" value={s} checked={values.serviceType === s} onChange={onChange} className="sr-only" />
              {s}
            </label>
          ))}
        </div>
      </Field>

      <div className="hidden sm:block" />

      <Field id={id('pickupLocation')} label="موقع التحميل *" error={errors.pickupLocation}>
        <input id={id('pickupLocation')} name="pickupLocation" value={values.pickupLocation} onChange={onChange}
          className="input" placeholder="مثال: إربد - الحي الشرقي" {...aria('pickupLocation')} />
      </Field>

      <Field id={id('destination')} label="الوجهة *" error={errors.destination}>
        <input id={id('destination')} name="destination" value={values.destination} onChange={onChange}
          className="input" placeholder="مثال: عمّان - سحاب" {...aria('destination')} />
      </Field>

      <div className="sm:col-span-2">
        <Field id={id('notes')} label="ملاحظات (اختياري)">
          <textarea id={id('notes')} name="notes" rows={3} maxLength={1000} value={values.notes} onChange={onChange}
            className="input resize-none" placeholder="نوع الحمولة، العدد أو الوزن، الموعد المفضل..." />
        </Field>
      </div>

      {status === 'error' && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 ring-1 ring-red-200 sm:col-span-2">
          {serverMsg}
        </p>
      )}

      <button type="submit" disabled={status === 'loading'} className="btn-gold py-4 text-lg sm:col-span-2">
        {status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        {status === 'loading' ? 'جارٍ الإرسال...' : 'إرسال الطلب'}
      </button>
    </form>
  );
}
