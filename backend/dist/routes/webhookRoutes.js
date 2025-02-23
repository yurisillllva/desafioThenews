"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webhoockController_1 = require("../controllers/webhoockController");
const router = (0, express_1.Router)();
// Rota para receber webhooks da plataforma
router.post('/', webhoockController_1.processWebhook);
exports.default = router;
