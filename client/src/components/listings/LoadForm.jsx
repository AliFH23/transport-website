import { createListing } from '../../api/client';
import { ANIMAL_TYPES, CARGO_TYPES, LISTING_TTL_DAYS } from '../../constants';
import useForm from '../../hooks/useForm';
import { jordanDate } from '../../utils';
import {
  ChoiceGroup, Field, FormAlert, LocationSelect, PHONE_ERROR, PriceFields, SelectInput, SubmitButton, SuccessPanel,
  ariaFor, isJoMobile,
} from '../FormControls';

const EMPTY = {
  merchantName: '', phone: '', cargoType: '', cargoDescription: '', animalType: '', animalCount: '',
  approxWeightTons: '', fromCity: '', toCity: '', pickupDate: '', price: '', negotiable: false, notes: '',
};

const validate = (v) => {
  const e = {};
  if (v.merchantName.trim().length < 2) e.merchantName = 'يرجى إدخال الاسم';
  if (!isJoMobile(v.phone)) e.phone = PHONE_ERROR;
  if (!CARGO_TYPES.includes(v.cargoType)) e.cargoType = 'اختر نوع الحمولة';
  if (!v.cargoDescription.trim()) e.cargoDescription = 'يرجى وصف الحمولة';
  if (v.cargoType === 'مواشي') {
    if (!v.animalType) e.animalType = 'اختر نوع المواشي';
    if (!(Number.isInteger(Number(v.animalCount)) && Number(v.animalCount) >= 1)) e.animalCount = 'أدخل عدد الرؤوس';
  }
  if (!v.fromCity) e.fromCity = 'اختر مدينة التحميل';
  if (!v.toCity) e.toCity = 'اختر مدينة الوجهة';
  if (!v.pickupDate) e.pickupDate = 'اختر تاريخ التحميل';
  if (v.price !== '' && !(Number(v.price) >= 1)) e.price = 'السعر غير صالح';
  return e;
};

// Only send livestock fields for livestock loads.
const toPayload = (v) =>
  v.cargoType === 'مواشي' ? v : { ...v, animalType: undefined, animalCount: undefined };

export default function LoadForm({ idPrefix = 'load' }) {
  const { values, errors, status, serverMsg, onChange, onSubmit, reset } = useForm(EMPTY, validate, (v) =>
    createListing('loads', toPayload(v))
  );

  if (status === 'success') {
    return <SuccessPanel title="تم استلام حمولتك!" message={serverMsg} onReset={reset} resetLabel="إضافة حمولة أخرى" />;
  }

  const id = (n) => `${idPrefix}-${n}`;
  const livestock = values.cargoType === 'مواشي';

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field id={id('merchantName')} label="اسم التاجر / الجهة *" error={errors.merchantName}>
        <input id={id('merchantName')} name="merchantName" value={values.merchantName} onChange={onChange}
          className="input" placeholder="مثال: مؤسسة الشمال التجارية" autoComplete="name" {...ariaFor(id('merchantName'), errors.merchantName)} />
      </Field>

      <Field id={id('phone')} label="رقم الهاتف *" error={errors.phone}>
        <input id={id('phone')} name="phone" type="tel" inputMode="tel" dir="ltr" value={values.phone} onChange={onChange}
          className="input text-right placeholder:text-right" placeholder="07XXXXXXXX" autoComplete="tel" {...ariaFor(id('phone'), errors.phone)} />
      </Field>

      <Field id={id('cargoType')} label="نوع الحمولة *" error={errors.cargoType}>
        <ChoiceGroup name="cargoType" label="نوع الحمولة" options={CARGO_TYPES} value={values.cargoType} onChange={onChange} />
      </Field>

      <Field id={id('approxWeightTons')} label="الوزن التقريبي (طن)" error={errors.approxWeightTons} hint="اختياري">
        <input id={id('approxWeightTons')} name="approxWeightTons" type="number" inputMode="decimal" min="0.1" max="100" step="any" dir="ltr"
          value={values.approxWeightTons} onChange={onChange} className="input text-right" placeholder="مثال: 20" />
      </Field>

      {livestock && (
        <>
          <Field id={id('animalType')} label="نوع المواشي *" error={errors.animalType}>
            <SelectInput id={id('animalType')} name="animalType" value={values.animalType} onChange={onChange}
              options={ANIMAL_TYPES} placeholder="اختر النوع" {...ariaFor(id('animalType'), errors.animalType)} />
          </Field>
          <Field id={id('animalCount')} label="عدد الرؤوس *" error={errors.animalCount}>
            <input id={id('animalCount')} name="animalCount" type="number" inputMode="numeric" min="1" max="10000" step="1" dir="ltr"
              value={values.animalCount} onChange={onChange} className="input text-right" placeholder="مثال: 120" {...ariaFor(id('animalCount'), errors.animalCount)} />
          </Field>
        </>
      )}

      <Field id={id('cargoDescription')} label="وصف الحمولة *" error={errors.cargoDescription} className="sm:col-span-2">
        <input id={id('cargoDescription')} name="cargoDescription" maxLength={500} value={values.cargoDescription} onChange={onChange}
          className="input" placeholder={livestock ? 'مثال: أغنام عواسي للتصدير' : 'مثال: مواد بناء على مشاطيح'} {...ariaFor(id('cargoDescription'), errors.cargoDescription)} />
      </Field>

      <Field id={id('fromCity')} label="من *" error={errors.fromCity}>
        <LocationSelect id={id('fromCity')} name="fromCity" value={values.fromCity} onChange={onChange} placeholder="مدينة التحميل" {...ariaFor(id('fromCity'), errors.fromCity)} />
      </Field>

      <Field id={id('toCity')} label="إلى *" error={errors.toCity}>
        <LocationSelect id={id('toCity')} name="toCity" value={values.toCity} onChange={onChange} placeholder="مدينة الوجهة" {...ariaFor(id('toCity'), errors.toCity)} />
      </Field>

      <Field id={id('pickupDate')} label="تاريخ التحميل *" error={errors.pickupDate} hint={`خلال ${LISTING_TTL_DAYS} يوماً من اليوم`}>
        <input id={id('pickupDate')} name="pickupDate" type="date" min={jordanDate()} max={jordanDate(LISTING_TTL_DAYS)}
          value={values.pickupDate} onChange={onChange} className="input" {...ariaFor(id('pickupDate'), errors.pickupDate)} />
      </Field>

      <PriceFields idPrefix={idPrefix} values={values} errors={errors} onChange={onChange} />

      <Field id={id('notes')} label="ملاحظات (اختياري)" className="sm:col-span-2">
        <textarea id={id('notes')} name="notes" rows={3} maxLength={1000} value={values.notes} onChange={onChange}
          className="input resize-none" placeholder="تفاصيل التحميل والتنزيل، نوع الشاحنة المطلوبة..." />
      </Field>

      {status === 'error' && <FormAlert>{serverMsg}</FormAlert>}
      <p className="text-sm text-slate-500 sm:col-span-2">سيظهر إعلانك بعد مراجعته من الإدارة، ويبقى منشوراً حتى تاريخ التحميل أو {LISTING_TTL_DAYS} يوماً كحد أقصى.</p>
      <SubmitButton loading={status === 'loading'}>نشر الحمولة</SubmitButton>
    </form>
  );
}
