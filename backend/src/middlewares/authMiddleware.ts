import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string; email: string };
    req.userId = decoded.id; // Adiciona o userId à requisição
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};