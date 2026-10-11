import mongoose from 'mongoose';
import ApiError from './ApiError.js';
import { parseBool, parseNumber } from './normalize.js';
import { JO_UTC_OFFSET, LISTING_STATUSES, LISTING_TTL_DAYS } from '../config/marketplace.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const offsetMs = (() => {
  const [, sign, h, m] = JO_UTC_OFFSET.match(/([+-])(\d\d):(\d\d)/);
  return (sign === '-' ? -1 : 1) * (Number(h) * 60 + Number(m)) * 60 * 1000;
})();

// Today's calendar date in Jordan as YYYY-MM-DD.
export const todayInJordan = (now = new Date()) => new Date(now.getTime() + offsetMs).toISOString().slice(0, 10);

/**
 * Parse a YYYY-MM-DD form date as midnight in Jordan.
 * Must be between today and today + LISTING_TTL_DAYS (a listing never outlives its window).
 * Returns { value } or { error }.
 */
export const parseListingDate = (raw, label, now = new Date()) => {
  const s = typeof raw === 'string' ? raw.trim().slice(0, 10) : '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return { error: `${label} مطلوب` };
  const date = new Date(`${s}T00:00:00${JO_UTC_OFFSET}`);
  // Reject impossible dates such as 2026-02-30 that JS would silently roll over.
  if (Number.isNaN(date.getTime()) || todayInJordan(date) !== s) return { error: `${label} غير صالح` };

  const today = new Date(`${todayInJordan(now)}T00:00:00${JO_UTC_OFFSET}`);
  if (date < today) return { error: `${label} لا يمكن أن يكون في الماضي` };
  if (date - today > LISTING_TTL_DAYS * DAY_MS) {
    return { error: `${label} يجب أن يكون خلال ${LISTING_TTL_DAYS} يوماً من اليوم` };
  }
  return { value: date };
};

// Ends LISTING_TTL_DAYS after creation, or at the end of the pickup / available-from day — whichever comes first.
export const computeExpiry = (date, now = new Date()) =>
  new Date(Math.min(now.getTime() + LISTING_TTL_DAYS * DAY_MS, date.getTime() + DAY_MS));

// Optional price in JOD plus the "negotiable" toggle. Adds to `errors` on failure.
export const parsePrice = (body, errors) => {
  const { value, error } = parseNumber(body.price, { min: 1, max: 100000, label: 'السعر' });
  if (error) errors.price = error;
  return { price: value, negotiable: parseBool(body.negotiable) };
};

// Mark Pending/Approved listings whose time has passed as Expired.
export const expireStale = (Model) =>
  Model.updateMany(
    { status: { $in: ['Pending', 'Approved'] }, expiresAt: { $lte: new Date() } },
    { $set: { status: 'Expired' } }
  );

export const paginate = (query, maxLimit) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), maxLimit);
  return { page, limit, skip: (page - 1) * limit };
};

/**
 * Read an optional enum filter from the query string.
 * Anything that is not one of `values` (including objects like ?x[$ne]=) is rejected.
 */
export const enumFilter = (query, key, values, message) => {
  const v = query[key];
  if (v === undefined || v === '') return undefined;
  if (!values.includes(v)) throw new ApiError(400, message);
  return v;
};

// Public list: only Approved listings that have not expired, with a whitelisted projection.
// Pending / Rejected / Expired listings (and their phone numbers) are never returned.
export const listPublic = async (Model, { filter, fields, sort }, query) => {
  const { page, limit, skip } = paginate(query, 50);
  const where = { ...filter, status: 'Approved', expiresAt: { $gt: new Date() } };
  const [items, total] = await Promise.all([
    Model.find(where).select(fields).sort(sort).skip(skip).limit(limit).lean(),
    Model.countDocuments(where),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) || 1 } };
};

// The public POST response confirms receipt without echoing back the (still unapproved) listing.
export const createdResponse = (res, doc) =>
  res.status(201).json({
    success: true,
    message: 'تم استلام إعلانك، وسيظهر للعموم بعد مراجعته من الإدارة',
    data: { _id: doc._id, status: doc.status, expiresAt: doc.expiresAt },
  });

const ensureId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'معرّف الإعلان غير صالح');
};

/**
 * Admin handlers shared by every listing type.
 * `typeFilter` = { param, field, values, message } for the per-type filter (e.g. cargoType).
 */
export const listingAdminHandlers = (Model, typeFilter) => ({
  // GET /admin?status=&<typeFilter.param>=&page=&limit=
  list: async (req, res) => {
    await expireStale(Model);
    const filter = {};
    const status = enumFilter(req.query, 'status', LISTING_STATUSES, 'حالة الإعلان غير صالحة');
    if (status) filter.status = status;
    const type = enumFilter(req.query, typeFilter.param, typeFilter.values, typeFilter.message);
    if (type) filter[typeFilter.field] = type;

    const { page, limit, skip } = paginate(req.query, 100);
    const [items, total, counts] = await Promise.all([
      Model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Model.countDocuments(filter),
      Model.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    const stats = Object.fromEntries(LISTING_STATUSES.map((s) => [s, 0]));
    counts.forEach(({ _id, count }) => (stats[_id] = count));

    res.json({ success: true, data: items, meta: { page, limit, total, pages: Math.ceil(total / limit) || 1, stats } });
  },

  // PATCH /:id { status }
  updateStatus: async (req, res) => {
    ensureId(req.params.id);
    const { status } = req.body ?? {};
    if (!LISTING_STATUSES.includes(status)) {
      throw new ApiError(400, `الحالة يجب أن تكون إحدى القيم: ${LISTING_STATUSES.join(', ')}`);
    }

    const doc = await Model.findById(req.params.id);
    if (!doc) throw new ApiError(404, 'الإعلان غير موجود');
    if ((status === 'Approved' || status === 'Pending') && doc.expiresAt <= new Date()) {
      throw new ApiError(400, 'انتهت صلاحية هذا الإعلان ولا يمكن نشره');
    }

    doc.status = status;
    await doc.save();
    res.json({ success: true, message: 'تم تحديث حالة الإعلان', data: doc });
  },

  // DELETE /:id
  remove: async (req, res) => {
    ensureId(req.params.id);
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) throw new ApiError(404, 'الإعلان غير موجود');
    res.json({ success: true, message: 'تم حذف الإعلان', data: { _id: doc._id } });
  },
});
