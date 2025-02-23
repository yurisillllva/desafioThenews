"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// import express from 'express';
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const webhookRoutes_1 = __importDefault(require("./routes/webhookRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
exports.app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));
exports.app.use(express_1.default.json());
// Rotas
exports.app.use('/api/auth', authRoutes_1.default);
exports.app.use('/api/webhook', webhookRoutes_1.default);
exports.app.use('/api/user', userRoutes_1.default);
exports.app.use('/api/admin', adminRoutes_1.default);
const errorHandler = (err, req, res, next) => {
    console.error('Erro global:', err);
    res.status(500).json({ error: 'Ocorreu um erro interno' });
};
exports.app.use(errorHandler);
exports.app.listen(PORT, () => {
    console.log(` Servidor rodando na porta ${PORT}`);
});
