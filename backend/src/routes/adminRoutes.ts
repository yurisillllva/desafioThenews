import { Router } from 'express';
import { getAdminMetrics, getWeeklyEngagement } from '../controllers/userController';

const router = Router();

router.get('/metrics', getAdminMetrics); 
router.get('/engagement', getWeeklyEngagement);

export default router;