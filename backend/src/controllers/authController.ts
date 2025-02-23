import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import {User} from '../models/User';

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query<User[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    
    const validPassword = await bcrypt.compare(password, users[0].password);
    if (!validPassword) return res.status(401).json({ error: 'Senha inválida' });

    const token = jwt.sign(
      { id: users[0].id, email: users[0].email, isAdmin: users[0].is_admin },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro no login' });
  }
};
