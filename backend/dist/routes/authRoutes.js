"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
var authController = require("../controllers/authController");
const router = (0, express_1.Router)();
// Rota de registro de usuário
router.post('/register', authController.register);
// Rota de login
router.post('/login', authController.login);
exports.default = router;
