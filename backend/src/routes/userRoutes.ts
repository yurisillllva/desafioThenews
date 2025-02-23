import { Router } from 'express';
// var authenticate = require("../middlewares/authMiddleware");
import { getUserStats, getAdminMetrics } from '../controllers/userController';

const router = Router();


router.get('/stats', getUserStats);
router.get('/admin/metrics', getAdminMetrics);

export default router;