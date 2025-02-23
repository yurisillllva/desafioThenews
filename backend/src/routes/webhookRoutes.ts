import { Router } from 'express';
import { processWebhook } from '../controllers/webhoockController';

const router = Router();

// Rota para receber webhooks da plataforma
router.post('/', processWebhook);

export default router;