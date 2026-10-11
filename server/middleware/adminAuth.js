import crypto from 'node:crypto';
import ApiError from '../utils/ApiError.js';

// Minimal shared-secret guard for the admin endpoints.
// Send the token in the `x-admin-token` header (or `Authorization: Bearer <token>`).
export default function adminAuth(req, _res, next) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return next(new ApiError(500, 'ADMIN_TOKEN is not configured on the server'));

  const header = req.get('authorization') || '';
  const provided = req.get('x-admin-token') || (header.startsWith('Bearer ') ? header.slice(7) : '');

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return next(new ApiError(401, 'غير مصرح لك بالوصول'));
  }
  next();
}
