import { LISTING_STATUSES } from '../config/marketplace.js';
import { JO_PHONE_REGEX } from './Booking.js';

// Fields shared by every public marketplace listing (loads & drivers).
export const listingFields = () => ({
  phone: {
    type: String,
    required: [true, 'رقم الهاتف مطلوب'],
    trim: true,
    match: [JO_PHONE_REGEX, 'رقم الهاتف غير صحيح — مثال: 0795849835'],
  },
  price: {
    type: Number,
    min: [1, 'السعر يجب أن يكون أكبر من صفر'],
    max: [100000, 'السعر كبير جداً'],
  },
  negotiable: { type: Boolean, default: false },
  notes: { type: String, trim: true, maxlength: [1000, 'الملاحظات طويلة جداً'], default: '' },
  status: {
    type: String,
    enum: { values: LISTING_STATUSES, message: 'حالة الإعلان غير صالحة' },
    default: 'Pending',
  },
  expiresAt: { type: Date, required: true },
});

export const applyListingIndexes = (schema) => {
  schema.index({ status: 1, expiresAt: 1 });
  schema.index({ createdAt: -1 });
};
