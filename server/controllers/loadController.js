import Load, { LOAD_PUBLIC_FIELDS } from '../models/Load.js';
import { JO_PHONE_REGEX } from '../models/Booking.js';
import { ANIMAL_TYPES, CARGO_TYPES, LOCATIONS } from '../config/marketplace.js';
import ApiError from '../utils/ApiError.js';
import { normalizePhone, parseNumber, str } from '../utils/normalize.js';
import {
  computeExpiry,
  createdResponse,
  enumFilter,
  listingAdminHandlers,
  listPublic,
  parseListingDate,
  parsePrice,
} from '../utils/listings.js';

/**
 * @route  POST /api/v1/loads
 * @access Public (rate-limited) — saved as Pending until an admin approves it
 */
export const createLoad = async (req, res) => {
  const body = req.body ?? {};
  const errors = {};

  const merchantName = str(body.merchantName);
  if (merchantName.length < 2) errors.merchantName = 'اسم التاجر مطلوب';

  const phone = normalizePhone(str(body.phone));
  if (!phone) errors.phone = 'رقم الهاتف مطلوب';
  else if (!JO_PHONE_REGEX.test(phone)) errors.phone = 'رقم الهاتف غير صحيح — مثال: 0795849835';

  const cargoType = str(body.cargoType);
  if (!CARGO_TYPES.includes(cargoType)) errors.cargoType = 'اختر نوع الحمولة';

  const cargoDescription = str(body.cargoDescription);
  if (!cargoDescription) errors.cargoDescription = 'وصف الحمولة مطلوب';

  let animalType;
  let animalCount;
  if (cargoType === 'مواشي') {
    animalType = str(body.animalType);
    if (!ANIMAL_TYPES.includes(animalType)) errors.animalType = 'اختر نوع المواشي';
    const count = parseNumber(body.animalCount, { min: 1, max: 10000, integer: true, label: 'عدد الرؤوس' });
    if (count.error) errors.animalCount = count.error;
    else if (count.value === undefined) errors.animalCount = 'عدد الرؤوس مطلوب';
    animalCount = count.value;
  }

  const weight = parseNumber(body.approxWeightTons, { min: 0.1, max: 100, label: 'الوزن' });
  if (weight.error) errors.approxWeightTons = weight.error;

  const fromCity = str(body.fromCity);
  if (!LOCATIONS.includes(fromCity)) errors.fromCity = 'اختر مدينة التحميل';
  const toCity = str(body.toCity);
  if (!LOCATIONS.includes(toCity)) errors.toCity = 'اختر مدينة الوجهة';

  const pickup = parseListingDate(body.pickupDate, 'تاريخ التحميل');
  if (pickup.error) errors.pickupDate = pickup.error;

  const { price, negotiable } = parsePrice(body, errors);

  if (Object.keys(errors).length) throw new ApiError(400, 'بيانات الإعلان غير مكتملة', errors);

  const load = await Load.create({
    merchantName,
    phone,
    cargoType,
    cargoDescription,
    animalType,
    animalCount,
    approxWeightTons: weight.value,
    fromCity,
    toCity,
    pickupDate: pickup.value,
    price,
    negotiable,
    notes: str(body.notes),
    expiresAt: computeExpiry(pickup.value),
  });

  createdResponse(res, load);
};

/**
 * @route  GET /api/v1/loads?cargoType=&from=&to=&page=&limit=
 * @access Public — Approved, non-expired listings only
 */
export const getLoads = async (req, res) => {
  const filter = {};
  const cargoType = enumFilter(req.query, 'cargoType', CARGO_TYPES, 'نوع الحمولة غير صالح');
  const from = enumFilter(req.query, 'from', LOCATIONS, 'مدينة التحميل غير صالحة');
  const to = enumFilter(req.query, 'to', LOCATIONS, 'مدينة الوجهة غير صالحة');
  if (cargoType) filter.cargoType = cargoType;
  if (from) filter.fromCity = from;
  if (to) filter.toCity = to;

  const { items, meta } = await listPublic(
    Load,
    { filter, fields: LOAD_PUBLIC_FIELDS, sort: { pickupDate: 1, createdAt: -1 } },
    req.query
  );
  res.json({ success: true, data: items, meta });
};

/**
 * @route  GET /api/v1/loads/admin · PATCH /api/v1/loads/:id · DELETE /api/v1/loads/:id
 * @access Admin
 */
export const {
  list: getLoadsAdmin,
  updateStatus: updateLoadStatus,
  remove: deleteLoad,
} = listingAdminHandlers(Load, {
  param: 'cargoType',
  field: 'cargoType',
  values: CARGO_TYPES,
  message: 'نوع الحمولة غير صالح',
});
