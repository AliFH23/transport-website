import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import adminAuth from '../middleware/adminAuth.js';
import { publicPostLimiter } from '../middleware/rateLimit.js';
import {
  createDriver,
  deleteDriver,
  getDrivers,
  getDriversAdmin,
  updateDriverStatus,
} from '../controllers/driverController.js';

const router = Router();

router.route('/').get(asyncHandler(getDrivers)).post(publicPostLimiter(), asyncHandler(createDriver));

router.get('/admin', adminAuth, asyncHandler(getDriversAdmin));
router.route('/:id').patch(adminAuth, asyncHandler(updateDriverStatus)).delete(adminAuth, asyncHandler(deleteDriver));

export default router;
