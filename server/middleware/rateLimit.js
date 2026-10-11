import rateLimit from 'express-rate-limit';

// Throttle public submissions to limit spam (10 requests / 15 min / IP).
// Call once per route so each endpoint keeps its own counter.
export const publicPostLimiter = () =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'عدد كبير من الطلبات، يرجى المحاولة لاحقاً' },
  });
