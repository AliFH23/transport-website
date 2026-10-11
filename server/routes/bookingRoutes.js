import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import adminAuth from '../middleware/adminAuth.js';
import { publicPostLimiter } from '../middleware/rateLimit.js';
import { createRequest, getRequests, updateRequestStatus } from '../controllers/bookingController.js';

const router = Router();

router
  .route('/')
  .post(publicPostLimiter(), asyncHandler(createRequest))
  .get(adminAuth, asyncHandler(getRequests));

router.patch('/:id', adminAuth, asyncHandler(updateRequestStatus));

export default router;
