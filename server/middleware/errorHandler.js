import mongoose from 'mongoose';

export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `المسار غير موجود: ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'حدث خطأ في الخادم';
  let errors = err.errors;

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'بيانات غير صالحة';
    errors = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'معرّف غير صالح';
    errors = undefined;
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'صيغة JSON غير صحيحة';
  }

  if (statusCode >= 500) console.error(err);

  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 && process.env.NODE_ENV === 'production' ? 'حدث خطأ في الخادم' : message,
    ...(errors && { errors }),
  });
};
