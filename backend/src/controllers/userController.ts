import { Request, Response } from 'express';
import pool from '../config/db';
import { calculateStreak } from '../utils/streakCalculator';
import { RowDataPacket } from 'mysql2'; 

// Interface para tipar os resultados das queries
interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  is_admin: boolean;
}

interface EventRow extends RowDataPacket {
  created_at: Date;
}

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const { email } = req.query as { email: string };
    
    // Debugar...
    console.log('Buscando usuário com email:', email);
    
    const [userRows] = await pool.query<UserRow[]>(
      'SELECT id, email, is_admin FROM users WHERE email = ?',
      [email]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: "Usuário não cadastrado" });
    }

    const userId = userRows[0].id;

    const [eventRows] = await pool.query<EventRow[]>(
      'SELECT id, post_id, created_at FROM reading_events WHERE user_id = ? ORDER BY created_at',
      [userId]
    );

    const result = calculateStreak(
      eventRows.map(e => { 
        const d = new Date(e.created_at);
        return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
      })
    );

    res.json({
      email: userRows[0].email,
      isAdmin: userRows[0].is_admin,
      streak: result.currentStreak,
      events: eventRows,
      maxStreak: result.maxStreak,
      streakHistory: result.streakHistory
    });

  } catch (error) {
    res.status(500).json({ error: "Erro interno" });
  }
};

export const getAdminMetrics = async (req: Request, res: Response) => {
  try {
    
    const [users] = await pool.query<UserRow[]>(
      'SELECT id, email, is_admin FROM users'
    );

    const { email } = req.query as { email: string };

    const [user] = await pool.query<UserRow[]>(
      'SELECT is_admin FROM users WHERE email = ?',
      [email]
    );

    if (!user[0]?.is_admin) {
      return res.status(403).json({ error: "Acesso não autorizado" });
    }

    // Calculando streaks para cada usuário
    const usersWithStreaks = await Promise.all(
      users.map(async (user) => {
        const [events] = await pool.query<EventRow[]>(
          'SELECT created_at FROM reading_events WHERE user_id = ?',
          [user.id]
        );
        
        const result = calculateStreak(
          events.map(e => {
            const d = new Date(e.created_at);
            return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
          })
        );

        return {
          email: user.email,
          currentStreak: result.currentStreak,
          maxStreak: result.maxStreak
        };
      })
    );

    // Ordernando users por streak decrescente
    const sortedUsers = usersWithStreaks.sort((a, b) => {
      return b.currentStreak - a.currentStreak || b.maxStreak - a.maxStreak;
    });

    res.json(sortedUsers);

  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar métricas" });
  }
};

export const getWeeklyEngagement = async (req: Request, res: Response) => {
  try {
    // Query para obter contagem de eventos por dia da semana
    const [results] = await pool.query<RowDataPacket[]>(`
      SELECT 
        DAYOFWEEK(created_at) AS day_of_week,
        COUNT(*) AS event_count
      FROM reading_events
      GROUP BY day_of_week
      ORDER BY day_of_week
    `);

    // Mapear para array de 7 posições (Dom-Sáb)
    const weeklyCounts = Array(7).fill(0);
    results.forEach((row: any) => {
      const dayIndex = row.day_of_week - 1; // DAYOFWEEK retorna 1=Domingo, 7=Sábado
      weeklyCounts[dayIndex] = row.event_count;
    });

    res.json(weeklyCounts);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar engajamento semanal" });
  }
};