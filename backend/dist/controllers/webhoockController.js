"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processWebhook = void 0;
const db_1 = __importDefault(require("../config/db"));
const processWebhook = async (req, res, next) => {
    // Verifica se o corpo da requisição está formatado corretamente
    if (!req.body?.data) {
        res.status(400).json({ error: 'Payload inválido: estrutura de dados incorreta' });
        return;
    }
    const eventData = req.body.data;
    try {
        // Validação dos campos obrigatórios
        if (!eventData.email || !eventData.id || !eventData.created_at) {
            res.status(400).json({
                error: 'Campos obrigatórios faltando: email, id ou created_at'
            });
            return;
        }
        // Converter e validar a data
        const createdAt = new Date(eventData.created_at);
        if (isNaN(createdAt.getTime())) {
            res.status(400).json({ error: 'Formato de data inválido' });
            return;
        }
        // Obter conexão do pool e iniciar transação
        const connection = await db_1.default.getConnection();
        await connection.beginTransaction();
        try {
            // Buscar usuário
            const [users] = await connection.query('SELECT id FROM users WHERE email = ?', [eventData.email]);
            if (users.length === 0) {
                await connection.rollback();
                res.status(404).json({ error: 'Usuário não encontrado' });
                return;
            }
            // Inserir evento de leitura
            await connection.execute(`INSERT INTO reading_events 
        (user_id, post_id, utm_source, utm_medium, utm_campaign, utm_channel, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                users[0].id,
                eventData.id,
                eventData.utm_source || null,
                eventData.utm_medium || null,
                eventData.utm_campaign || null,
                eventData.utm_channel || null,
                createdAt
            ]);
            await connection.commit();
            res.status(200).json({ message: 'Evento processado com sucesso' });
        }
        catch (error) {
            await connection.rollback();
            throw error; // Repassa o erro para o bloco externo
        }
        finally {
            connection.release();
        }
    }
    catch (error) {
        console.error('Erro no processamento do webhook:', error);
        next(error); // Encaminha para o middleware de erros
    }
};
exports.processWebhook = processWebhook;
