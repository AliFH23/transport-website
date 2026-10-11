import { createListing } from '../../api/client';
import { LISTING_TTL_DAYS, TRUCK_TYPES } from '../../constants';
import useForm from '../../hooks/useForm';
import { jordanDate } from '../../utils';
import {
  Field, FormAlert, LocationSelect, PHONE_ERROR, PriceFields, SelectInput, SubmitButton, SuccessPanel, ariaFor, isJoMobile,
} from '../FormControls';

const EMPTY = {
  driverName: '', phone: '', truckType: '', truckTypeOther: '', trailerLengthM: '', maxLoadTons: '',
  currentCity: '', availableFrom: jordanDate(), preferredRoutes: '', price: '', negotiable: false, notes: '',
};

const inRange = (v, min, max) => v !== '' && Number(v) >= min && Number(v) <= max;

const validate = (v) => {
  const e = {};
  if (v.driverName.trim().length < 2) e.driverName = 'يرجى إدخال الاسم';
  if (!isJoMobile(v.phone)) e.phone = PHONE_ERROR;
  if (!TRUCK_TYPES.includes(v.truckType)) e.truckType = 'اختر نوع الشاحنة';
  if (v.truckType === 'أخرى' && !v.truckTypeOther.trim()) e.truckTypeOther = 'يرجى تحديد نوع الشاحنة';
  if (!inRange(v.trailerLengthM, 2, 25)) e.trailerLengthM = 'أدخل طول المقطورة (2 - 25 متر)';
  if (!inRange(v.maxLoadTons, 0.5, 100)) e.maxLoadTons = 'أدخل الحمولة القصوى (0.5 - 100 طن)';
  if (!v.currentCity) e.currentCity = 'اختر المدينة';
  if (!v.availableFrom) e.availableFrom = 'اختر تاريخ التوفر';
  if (v.price !== '' && !(Number(v.price) >= 1)) e.price = 'السعر غير صالح';
  return e;
};

export default function DriverForm({ idPrefix = 'driver' }) {
  const { values, errors, status, serverMsg, onChange, onSubmit, reset } = useForm(EMPTY, validate, (v) =>
    createListing('drivers', v)
  );

  if (status === 'success') {
    return <SuccessPanel title="تم تسجيلك كسائق متوفر!" message={serverMsg} onReset={reset} resetLabel="تسجيل إعلان آخر" />;
  }

  const id = (n) => `${idPrefix}-${n}`;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field id={id('driverName')} label="اسم السائق *" error={errors.driverName}>
        <input id={id('driverName')} name="driverName" value={values.driverName} onChange={onChange}
          className="input" placeholder="مثال: أبو أحمد" autoComplete="name" {...ariaFor(id('driverName'), errors.driverName)} />
      </Field>

      <Field id={id('phone')} label="رقم الهاتف *" error={errors.phone}>
        <input id={id('phone')} name="phone" type="tel" inputMode="tel" dir="ltr" value={values.phone} onChange={onChange}
          className="input text-right placeholder:text-right" placeholder="07XXXXXXXX" autoComplete="tel" {...ariaFor(id('phone'), errors.phone)} />
      </Field>

      <Field id={id('truckType')} label="نوع الشاحنة *" error={errors.truckType}>
        <SelectInput id={id('truckType')} name="truckType" value={values.truckType} onChange={onChange}
          options={TRUCK_TYPES} placeholder="اختر النوع" {...ariaFor(id('truckType'), errors.truckType)} />
      </Field>

      <Field id={id('currentCity')} label="المدينة الحالية *" error={errors.currentCity}>
        <LocationSelect id={id('currentCity')} name="currentCity" value={values.currentCity} onChange={onChange} {...ariaFor(id('currentCity'), errors.currentCity)} />
      </Field>

      {values.truckType === 'أخرى' && (
        <Field id={id('truckTypeOther')} label="حدّد نوع الشاحنة *" error={errors.truckTypeOther} className="sm:col-span-2">
          <input id={id('truckTypeOther')} name="truckTypeOther" maxLength={50} value={values.truckTypeOther} onChange={onChange}
            className="input" placeholder="مثال: لوري صغير" {...ariaFor(id('truckTypeOther'), errors.truckTypeOther)} />
        </Field>
      )}

      <Field id={id('trailerLengthM')} label="طول المقطورة (متر) *" error={errors.trailerLengthM}>
        <input id={id('trailerLengthM')} name="trailerLengthM" type="number" inputMode="decimal" min="2" max="25" step="any" dir="ltr"
          value={values.trailerLengthM} onChange={onChange} className="input text-right" placeholder="مثال: 13.6" {...ariaFor(id('trailerLengthM'), errors.trailerLengthM)} />
      </Field>

      <Field id={id('maxLoadTons')} label="الحمولة القصوى (طن) *" error={errors.maxLoadTons}>
        <input id={id('maxLoadTons')} name="maxLoadTons" type="number" inputMode="decimal" min="0.5" max="100" step="any" dir="ltr"
          value={values.maxLoadTons} onChange={onChange} className="input text-right" placeholder="مثال: 25" {...ariaFor(id('maxLoadTons'), errors.maxLoadTons)} />
      </Field>

      <Field id={id('availableFrom')} label="متوفر ابتداءً من *" error={errors.availableFrom} hint={`خلال ${LISTING_TTL_DAYS} يوماً من اليوم`}>
        <input id={id('availableFrom')} name="availableFrom" type="date" min={jordanDate()} max={jordanDate(LISTING_TTL_DAYS)}
          value={values.availableFrom} onChange={onChange} className="input" {...ariaFor(id('availableFrom'), errors.availableFrom)} />
      </Field>

      <Field id={id('preferredRoutes')} label="الخطوط المفضلة" hint="اختياري">
        <input id={id('preferredRoutes')} name="preferredRoutes" maxLength={300} value={values.preferredRoutes} onChange={onChange}
          className="input" placeholder="مثال: إربد ↔ عمّان، الأردن ↔ السعودية" />
      </Field>

      <div className="sm:col-span-2">
        <PriceFields idPrefix={idPrefix} label="السعر للنقلة (دينار أردني)" values={values} errors={errors} onChange={onChange} />
      </div>

      <Field id={id('notes')} label="ملاحظات (اختياري)" className="sm:col-span-2">
        <textarea id={id('notes')} name="notes" rows={3} maxLength={1000} value={values.notes} onChange={onChange}
          className="input resize-none" placeholder="مواصفات إضافية، تأمين، خبرة بنقل المواشي..." />
      </Field>

      {status === 'error' && <FormAlert>{serverMsg}</FormAlert>}
      <p className="text-sm text-slate-500 sm:col-span-2">سيظهر إعلانك بعد مراجعته من الإدارة، ويبقى منشوراً حتى تاريخ التوفر أو {LISTING_TTL_DAYS} يوماً كحد أقصى.</p>
      <SubmitButton loading={status === 'loading'}>تسجيل كسائق متوفر</SubmitButton>
    </form>
  );
}
