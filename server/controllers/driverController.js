import Driver, { DRIVER_PUBLIC_FIELDS } from '../models/Driver.js';
import { JO_PHONE_REGEX } from '../models/Booking.js';
import { LOCATIONS, TRUCK_TYPES } from '../config/marketplace.js';
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
 * @route  POST /api/v1/drivers
 * @access Public (rate-limited) — saved as Pending until an admin approves it
 */
export const createDriver = async (req, res) => {
  const body = req.body ?? {};
  const errors = {};

  const driverName = str(body.driverName);
  if (driverName.length < 2) errors.driverName = 'اسم السائق مطلوب';

  const phone = normalizePhone(str(body.phone));
  if (!phone) errors.phone = 'رقم الهاتف مطلوب';
  else if (!JO_PHONE_REGEX.test(phone)) errors.phone = 'رقم الهاتف غير صحيح — مثال: 0795849835';

  const truckType = str(body.truckType);
  if (!TRUCK_TYPES.includes(truckType)) errors.truckType = 'اختر نوع الشاحنة';
  const truckTypeOther = truckType === 'أخرى' ? str(body.truckTypeOther) : undefined;
  if (truckType === 'أخرى' && !truckTypeOther) errors.truckTypeOther = 'يرجى تحديد نوع الشاحنة';

  const length = parseNumber(body.trailerLengthM, { min: 2, max: 25, label: 'طول المقطورة' });
  if (length.error) errors.trailerLengthM = length.error;
  else if (length.value === undefined) errors.trailerLengthM = 'طول المقطورة مطلوب';

  const maxLoad = parseNumber(body.maxLoadTons, { min: 0.5, max: 100, label: 'الحمولة القصوى' });
  if (maxLoad.error) errors.maxLoadTons = maxLoad.error;
  else if (maxLoad.value === undefined) errors.maxLoadTons = 'الحمولة القصوى مطلوبة';

  const currentCity = str(body.currentCity);
  if (!LOCATIONS.includes(currentCity)) errors.currentCity = 'اختر المدينة الحالية';

  const available = parseListingDate(body.availableFrom, 'تاريخ التوفر');
  if (available.error) errors.availableFrom = available.error;

  const { price, negotiable } = parsePrice(body, errors);

  if (Object.keys(errors).length) throw new ApiError(400, 'بيانات الإعلان غير مكتملة', errors);

  const driver = await Driver.create({
    driverName,
    phone,
    truckType,
    truckTypeOther,
    trailerLengthM: length.value,
    maxLoadTons: maxLoad.value,
    currentCity,
    availableFrom: available.value,
    preferredRoutes: str(body.preferredRoutes),
    price,
    negotiable,
    notes: str(body.notes),
    expiresAt: computeExpiry(available.value),
  });

  createdResponse(res, driver);
};

/**
 * @route  GET /api/v1/drivers?truckType=&city=&minLength=&page=&limit=
 * @access Public — Approved, non-expired listings only
 */
export const getDrivers = async (req, res) => {
  const filter = {};
  const truckType = enumFilter(req.query, 'truckType', TRUCK_TYPES, 'نوع الشاحنة غير صالح');
  const city = enumFilter(req.query, 'city', LOCATIONS, 'المدينة غير صالحة');
  if (truckType) filter.truckType = truckType;
  if (city) filter.currentCity = city;

  const minLength = parseNumber(req.query.minLength, { min: 0, max: 25, label: 'طول المقطورة' });
  if (minLength.error) throw new ApiError(400, minLength.error);
  if (minLength.value) filter.trailerLengthM = { $gte: minLength.value };

  const { items, meta } = await listPublic(
    Driver,
    { filter, fields: DRIVER_PUBLIC_FIELDS, sort: { availableFrom: 1, createdAt: -1 } },
    req.query
  );
  res.json({ success: true, data: items, meta });
};

/**
 * @route  GET /api/v1/drivers/admin · PATCH /api/v1/drivers/:id · DELETE /api/v1/drivers/:id
 * @access Admin
 */
export const {
  list: getDriversAdmin,
  updateStatus: updateDriverStatus,
  remove: deleteDriver,
} = listingAdminHandlers(Driver, {
  param: 'truckType',
  field: 'truckType',
  values: TRUCK_TYPES,
  message: 'نوع الشاحنة غير صالح',
});
