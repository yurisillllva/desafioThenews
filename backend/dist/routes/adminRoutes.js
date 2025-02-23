"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.get('/metrics', userController_1.getAdminMetrics);
router.get('/engagement', userController_1.getWeeklyEngagement);
exports.default = router;
