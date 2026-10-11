import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import adminAuth from '../middleware/adminAuth.js';
import { publicPostLimiter } from '../middleware/rateLimit.js';
import { createLoad, deleteLoad, getLoads, getLoadsAdmin, updateLoadStatus } from '../controllers/loadController.js';

const router = Router();

router.route('/').get(asyncHandler(getLoads)).post(publicPostLimiter(), asyncHandler(createLoad));

router.get('/admin', adminAuth, asyncHandler(getLoadsAdmin));
router.route('/:id').patch(adminAuth, asyncHandler(updateLoadStatus)).delete(adminAuth, asyncHandler(deleteLoad));

export default router;
