"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeeklyEngagement = exports.getAdminMetrics = exports.getUserStats = void 0;
const db_1 = __importDefault(require("../config/db"));
const streakCalculator_1 = require("../utils/streakCalculator");
const getUserStats = async (req, res) => {
    try {
        const { email } = req.query;
        // Debugar...
        console.log('Buscando usuário com email:', email);
        const [userRows] = await db_1.default.query('SELECT id, email, is_admin FROM users WHERE email = ?', [email]);
        if (userRows.length === 0) {
            return res.status(404).json({ error: "Usuário não cadastrado" });
        }
        const userId = userRows[0].id;
        const [eventRows] = await db_1.default.query('SELECT id, post_id, created_at FROM reading_events WHERE user_id = ?', [userId]);
        const result = (0, streakCalculator_1.calculateStreak)(eventRows.map(e => new Date(e.created_at)));
        res.json({
            email: userRows[0].email,
            isAdmin: userRows[0].is_admin,
            streak: result.currentStreak,
            events: eventRows,
            maxStreak: result.maxStreak,
            streakHistory: result.streakHistory
        });
    }
    catch (error) {
        res.status(500).json({ error: "Erro interno" });
    }
};
exports.getUserStats = getUserStats;
const getAdminMetrics = async (req, res) => {
    try {
        const [users] = await db_1.default.query('SELECT id, email, is_admin FROM users');
        const { email } = req.query;
        const [user] = await db_1.default.query('SELECT is_admin FROM users WHERE email = ?', [email]);
        if (!user[0]?.is_admin) {
            return res.status(403).json({ error: "Acesso não autorizado" });
        }
        // Calculando streaks para cada usuário
        const usersWithStreaks = await Promise.all(users.map(async (user) => {
            const [events] = await db_1.default.query('SELECT created_at FROM reading_events WHERE user_id = ?', [user.id]);
            const result = (0, streakCalculator_1.calculateStreak)(events.map(e => new Date(e.created_at)));
            return {
                email: user.email,
                currentStreak: result.currentStreak,
                maxStreak: result.maxStreak
            };
        }));
        // Ordernando users por streak decrescente
        const sortedUsers = usersWithStreaks.sort((a, b) => {
            return b.currentStreak - a.currentStreak || b.maxStreak - a.maxStreak;
        });
        res.json(sortedUsers);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar métricas" });
    }
};
exports.getAdminMetrics = getAdminMetrics;
const getWeeklyEngagement = async (req, res) => {
    try {
        // Query para obter contagem de eventos por dia da semana
        const [results] = await db_1.default.query(`
      SELECT 
        DAYOFWEEK(created_at) AS day_of_week,
        COUNT(*) AS event_count
      FROM reading_events
      GROUP BY day_of_week
      ORDER BY day_of_week
    `);
        // Mapear para array de 7 posições (Dom-Sáb)
        const weeklyCounts = Array(7).fill(0);
        results.forEach((row) => {
            const dayIndex = row.day_of_week - 1; // DAYOFWEEK retorna 1=Domingo, 7=Sábado
            weeklyCounts[dayIndex] = row.event_count;
        });
        res.json(weeklyCounts);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar engajamento semanal" });
    }
};
exports.getWeeklyEngagement = getWeeklyEngagement;
