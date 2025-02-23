import { jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/server';
import pool from '../src/config/db';
import type {
  RowDataPacket,
  ResultSetHeader,
  FieldPacket,
  QueryOptions
} from 'mysql2/promise';

type QueryResult = RowDataPacket[] | RowDataPacket[][] | ResultSetHeader | ResultSetHeader[];

// Mock completo com tipagem correta
jest.mock('../src/config/db', () => ({
  __esModule: true,
  default: {
    query: jest.fn<typeof pool.query>()
  }
}));

const mockedPool = pool as jest.Mocked<typeof pool>;

describe('User Controller', () => {
  beforeAll(() => {
    // Implementação padrão com cast explícito
    (mockedPool.query as jest.MockedFunction<typeof pool.query>).mockImplementation((() => {
      return Promise.resolve([[], []]);
    }) as typeof pool.query);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/user/stats', () => {
    it('deve retornar stats do usuário', async () => {
      // Mock da query do usuário
      mockedPool.query.mockResolvedValueOnce([
        [{ id: 1, email: 'user@test.com', is_admin: 0 }] as RowDataPacket[],
        [] as FieldPacket[]
      ]);

      // Mock da query de eventos
      mockedPool.query.mockResolvedValueOnce([
        [
          { created_at: new Date('2024-01-01') },
          { created_at: new Date('2024-01-02') }
        ] as RowDataPacket[],
        [] as FieldPacket[]
      ]);
    
      const res = await request(app)
        .get('/api/user/stats?email=user@test.com')
        .set('Authorization', 'Bearer valid_token');
    
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        email: 'user@test.com',
        isAdmin: 0, 
        streak: 2,
        maxStreak: 2,
        streakHistory: expect.any(Array),
        events: expect.any(Array)
      });
    });
  });

  describe('GET /api/admin/metrics', () => {
    it('deve retornar métricas para admin', async () => {
      // Mock da verificação de admin
      mockedPool.query.mockResolvedValueOnce([
        [{ is_admin: 1 }] as RowDataPacket[],
        [] as FieldPacket[]
      ]);
    
      // Mock da lista de usuários
      mockedPool.query.mockResolvedValueOnce([
        [
          { id: 1, email: 'admin@test.com', is_admin: 1 },
          { id: 2, email: 'user@test.com', is_admin: 0 }
        ] as RowDataPacket[],
        [] as FieldPacket[]
      ]);
    
      // Mocks dos eventos
      mockedPool.query
        .mockResolvedValueOnce([ // Eventos do admin (3 dias consecutivos)
          [
            { created_at: new Date('2024-01-01') },
            { created_at: new Date('2024-01-02') },
            { created_at: new Date('2024-01-03') }
          ] as RowDataPacket[],
          [] as FieldPacket[]
        ])
        .mockResolvedValueOnce([ // Eventos do usuário (2 dias consecutivos)
          [
            { created_at: new Date('2024-01-01') },
            { created_at: new Date('2024-01-02') }
          ] as RowDataPacket[],
          [] as FieldPacket[]
        ]);
    
      const res = await request(app)
        .get('/api/admin/metrics?email=admin@test.com')
        .set('Authorization', 'Bearer valid_token');
    
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        expect.objectContaining({
          email: 'admin@test.com',
          currentStreak: 3,
          maxStreak: 3
        }),
        expect.objectContaining({
          email: 'user@test.com',
          currentStreak: 2,
          maxStreak: 2
        })
      ]);
    });

    it('deve negar acesso para não-admin', async () => {
      mockedPool.query.mockResolvedValueOnce([
        [{ is_admin: 0 }] as RowDataPacket[],
        [] as FieldPacket[]
      ]);

      const res = await request(app)
        .get('/api/admin/metrics?email=user@test.com')
        .set('Authorization', 'Bearer valid_token');

      expect(res.status).toBe(403);
      expect(res.body).toEqual({ error: "Acesso não autorizado" });
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      mockedPool.query.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app)
        .get('/api/admin/metrics?email=admin@test.com')
        .set('Authorization', 'Bearer valid_token');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Erro ao buscar métricas" });
    });
  });
});