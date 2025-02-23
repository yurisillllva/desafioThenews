"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// var authenticate = require("../middlewares/authMiddleware");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.get('/stats', userController_1.getUserStats);
router.get('/admin/metrics', userController_1.getAdminMetrics);
exports.default = router;
