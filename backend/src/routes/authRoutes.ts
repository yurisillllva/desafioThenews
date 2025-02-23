import { Router } from 'express';
var authController = require("../controllers/authController");

const router = Router();

// Rota de registro de usuário
router.post('/register', authController.register);

// Rota de login
router.post('/login', authController.login);

export default router;