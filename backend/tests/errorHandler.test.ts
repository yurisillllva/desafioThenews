import { jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/server';
import pool from '../src/config/db';
import type { RowDataPacket, FieldPacket } from 'mysql2/promise';

// Mock completo com tipagem correta
jest.mock('../src/config/db', () => ({
  __esModule: true,
  default: {
    query: jest.fn<typeof pool.query>(),
  },
}));

const mockedPool = pool as jest.Mocked<typeof pool>;

describe('Error Handler', () => {
  it('deve lidar com erros internos', async () => {
    // Mock de erro na consulta ao banco de dados
    mockedPool.query.mockRejectedValueOnce(new Error('DB Error'));

    const res = await request(app)
      .get('/api/user/stats?email=user@test.com')
      .set('Authorization', 'Bearer valid_token');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
