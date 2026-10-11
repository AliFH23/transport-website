import mongoose from 'mongoose';
import { ANIMAL_TYPES, CARGO_TYPES, LOCATIONS } from '../config/marketplace.js';
import { applyListingIndexes, listingFields } from './listingBase.js';

const isLivestock = function () {
  return this.cargoType === 'مواشي';
};

const loadSchema = new mongoose.Schema(
  {
    merchantName: {
      type: String,
      required: [true, 'اسم التاجر مطلوب'],
      trim: true,
      minlength: [2, 'الاسم قصير جداً'],
      maxlength: [100, 'الاسم طويل جداً'],
    },
    cargoType: {
      type: String,
      required: [true, 'نوع الحمولة مطلوب'],
      enum: { values: CARGO_TYPES, message: 'نوع الحمولة غير صالح' },
    },
    cargoDescription: {
      type: String,
      required: [true, 'وصف الحمولة مطلوب'],
      trim: true,
      maxlength: [500, 'وصف الحمولة طويل جداً'],
    },
    animalType: {
      type: String,
      enum: { values: ANIMAL_TYPES, message: 'نوع المواشي غير صالح' },
      required: [isLivestock, 'نوع المواشي مطلوب'],
    },
    animalCount: {
      type: Number,
      min: [1, 'عدد الرؤوس يجب أن يكون 1 على الأقل'],
      max: [10000, 'عدد الرؤوس كبير جداً'],
      validate: { validator: Number.isInteger, message: 'عدد الرؤوس يجب أن يكون عدداً صحيحاً' },
      required: [isLivestock, 'عدد الرؤوس مطلوب'],
    },
    approxWeightTons: {
      type: Number,
      min: [0.1, 'الوزن غير صالح'],
      max: [100, 'الوزن كبير جداً'],
    },
    fromCity: {
      type: String,
      required: [true, 'مدينة التحميل مطلوبة'],
      enum: { values: LOCATIONS, message: 'مدينة التحميل غير صالحة' },
    },
    toCity: {
      type: String,
      required: [true, 'مدينة الوجهة مطلوبة'],
      enum: { values: LOCATIONS, message: 'مدينة الوجهة غير صالحة' },
    },
    pickupDate: { type: Date, required: [true, 'تاريخ التحميل مطلوب'] },
    ...listingFields(),
  },
  { timestamps: true, versionKey: false }
);

applyListingIndexes(loadSchema);

// Fields safe to show on the public /loads page (only ever for Approved listings).
export const LOAD_PUBLIC_FIELDS =
  'merchantName phone cargoType cargoDescription animalType animalCount approxWeightTons fromCity toCity pickupDate price negotiable notes createdAt expiresAt';

export default mongoose.model('Load', loadSchema);
