import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import asyncHandler from '../utils/asyncHandler.js';
import adminAuth from '../middleware/adminAuth.js';
import { createRequest, getRequests, updateRequestStatus } from '../controllers/bookingController.js';

const router = Router();

// Throttle public submissions to limit spam (10 requests / 15 min / IP).
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'عدد كبير من الطلبات، يرجى المحاولة لاحقاً' },
});

router
  .route('/')
  .post(createLimiter, asyncHandler(createRequest))
  .get(adminAuth, asyncHandler(getRequests));

router.patch('/:id', adminAuth, asyncHandler(updateRequestStatus));

export default router;
