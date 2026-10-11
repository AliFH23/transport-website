import mongoose from 'mongoose';
import { LOCATIONS, TRUCK_TYPES } from '../config/marketplace.js';
import { applyListingIndexes, listingFields } from './listingBase.js';

const driverSchema = new mongoose.Schema(
  {
    driverName: {
      type: String,
      required: [true, 'اسم السائق مطلوب'],
      trim: true,
      minlength: [2, 'الاسم قصير جداً'],
      maxlength: [100, 'الاسم طويل جداً'],
    },
    truckType: {
      type: String,
      required: [true, 'نوع الشاحنة مطلوب'],
      enum: { values: TRUCK_TYPES, message: 'نوع الشاحنة غير صالح' },
    },
    // Free-text description when truckType is "أخرى".
    truckTypeOther: {
      type: String,
      trim: true,
      maxlength: [50, 'وصف نوع الشاحنة طويل جداً'],
      required: [
        function () {
          return this.truckType === 'أخرى';
        },
        'يرجى تحديد نوع الشاحنة',
      ],
    },
    trailerLengthM: {
      type: Number,
      required: [true, 'طول المقطورة مطلوب'],
      min: [2, 'طول المقطورة غير صالح'],
      max: [25, 'طول المقطورة كبير جداً'],
    },
    maxLoadTons: {
      type: Number,
      required: [true, 'الحمولة القصوى مطلوبة'],
      min: [0.5, 'الحمولة القصوى غير صالحة'],
      max: [100, 'الحمولة القصوى كبيرة جداً'],
    },
    currentCity: {
      type: String,
      required: [true, 'المدينة الحالية مطلوبة'],
      enum: { values: LOCATIONS, message: 'المدينة غير صالحة' },
    },
    availableFrom: { type: Date, required: [true, 'تاريخ التوفر مطلوب'] },
    preferredRoutes: { type: String, trim: true, maxlength: [300, 'الخطوط المفضلة طويلة جداً'], default: '' },
    ...listingFields(),
  },
  { timestamps: true, versionKey: false }
);

applyListingIndexes(driverSchema);

export const DRIVER_PUBLIC_FIELDS =
  'driverName phone truckType truckTypeOther trailerLengthM maxLoadTons currentCity availableFrom preferredRoutes price negotiable notes createdAt expiresAt';

export default mongoose.model('Driver', driverSchema);
