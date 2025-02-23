"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const SECRET_KEY = process.env.JWT_SECRET || 'secret';
const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const [result] = await db_1.default.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
        res.status(201).json({ message: 'Usuário criado com sucesso!' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0)
            return res.status(404).json({ error: 'Usuário não encontrado' });
        const validPassword = await bcrypt_1.default.compare(password, users[0].password);
        if (!validPassword)
            return res.status(401).json({ error: 'Senha inválida' });
        const token = jsonwebtoken_1.default.sign({ id: users[0].id, email: users[0].email, isAdmin: users[0].is_admin }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro no login' });
    }
};
exports.login = login;
