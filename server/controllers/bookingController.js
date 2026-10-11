import mongoose from 'mongoose';
import Booking, { SERVICE_TYPES, STATUSES } from '../models/Booking.js';
import ApiError from '../utils/ApiError.js';

const str = (v) => (typeof v === 'string' || typeof v === 'number' ? String(v).trim() : '');

const normalizePhone = (raw = '') => {
  let p = String(raw).replace(/[\s\-()]/g, '');
  // Convert Arabic-Indic digits (٠-٩) to Latin digits
  p = p.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
  if (p.startsWith('+962')) p = '0' + p.slice(4);
  else if (p.startsWith('00962')) p = '0' + p.slice(5);
  else if (p.startsWith('962')) p = '0' + p.slice(3);
  return p;
};

/**
 * @route  POST /api/v1/requests
 * @access Public
 */
export const createRequest = async (req, res) => {
  const body = req.body ?? {};
  const [customerName, phone, serviceType, pickupLocation, destination, notes] = [
    'customerName', 'phone', 'serviceType', 'pickupLocation', 'destination', 'notes',
  ].map((k) => str(body[k]));

  const errors = {};
  if (!customerName) errors.customerName = 'اسم العميل مطلوب';
  if (!phone) errors.phone = 'رقم الهاتف مطلوب';
  if (!SERVICE_TYPES.includes(serviceType)) errors.serviceType = 'نوع الخدمة غير صالح';
  if (!pickupLocation) errors.pickupLocation = 'موقع التحميل مطلوب';
  if (!destination) errors.destination = 'الوجهة مطلوبة';
  if (Object.keys(errors).length) throw new ApiError(400, 'بيانات الطلب غير مكتملة', errors);

  // Whitelist fields so clients cannot set `status` or other internals.
  const booking = await Booking.create({
    customerName,
    phone: normalizePhone(phone),
    serviceType,
    pickupLocation,
    destination,
    notes,
  });

  res.status(201).json({
    success: true,
    message: 'تم استلام طلبك بنجاح، سنتواصل معك قريباً',
    data: booking,
  });
};

/**
 * @route  GET /api/v1/requests?status=Pending&page=1&limit=20
 * @access Admin
 */
export const getRequests = async (req, res) => {
  const { status, serviceType } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 100);

  const filter = {};
  if (status) {
    if (!STATUSES.includes(status)) throw new ApiError(400, 'حالة الطلب غير صالحة');
    filter.status = status;
  }
  if (serviceType) {
    if (!SERVICE_TYPES.includes(serviceType)) throw new ApiError(400, 'نوع الخدمة غير صالح');
    filter.serviceType = serviceType;
  }

  const [items, total, counts] = await Promise.all([
    Booking.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Booking.countDocuments(filter),
    Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);

  const stats = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  counts.forEach(({ _id, count }) => (stats[_id] = count));

  res.json({
    success: true,
    data: items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) || 1, stats },
  });
};

/**
 * @route  PATCH /api/v1/requests/:id
 * @access Admin
 */
export const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body ?? {};

  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'معرّف الطلب غير صالح');
  if (!STATUSES.includes(status)) {
    throw new ApiError(400, `الحالة يجب أن تكون إحدى القيم: ${STATUSES.join(', ')}`);
  }

  const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  if (!booking) throw new ApiError(404, 'الطلب غير موجود');

  res.json({ success: true, message: 'تم تحديث حالة الطلب', data: booking });
};
