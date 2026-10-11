import mongoose from 'mongoose';

export const SERVICE_TYPES = ['نقل بضائع', 'نقل مواشي'];
export const STATUSES = ['Pending', 'In-Progress', 'Completed'];

// Jordanian mobile numbers: 07[7|8|9] + 7 digits (e.g. 0795849835).
// The controller normalises +962 / 00962 / 962 prefixes to the local 07 form.
export const JO_PHONE_REGEX = /^07[789]\d{7}$/;

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'اسم العميل مطلوب'],
      trim: true,
      minlength: [2, 'اسم العميل قصير جداً'],
      maxlength: [100, 'اسم العميل طويل جداً'],
    },
    phone: {
      type: String,
      required: [true, 'رقم الهاتف مطلوب'],
      trim: true,
      match: [JO_PHONE_REGEX, 'رقم الهاتف غير صحيح — مثال: 0795849835'],
    },
    serviceType: {
      type: String,
      required: [true, 'نوع الخدمة مطلوب'],
      enum: { values: SERVICE_TYPES, message: 'نوع الخدمة غير صالح' },
    },
    pickupLocation: {
      type: String,
      required: [true, 'موقع التحميل مطلوب'],
      trim: true,
      maxlength: 200,
    },
    destination: {
      type: String,
      required: [true, 'الوجهة مطلوبة'],
      trim: true,
      maxlength: 200,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'الملاحظات طويلة جداً'],
      default: '',
    },
    status: {
      type: String,
      enum: { values: STATUSES, message: 'حالة الطلب غير صالحة' },
      default: 'Pending',
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

bookingSchema.index({ createdAt: -1 });

export default mongoose.model('Booking', bookingSchema);
