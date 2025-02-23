import type { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2';

jest.mock('../src/config/db', () => ({
  default: {
    query: jest.fn().mockImplementation((
      // Tipagem completa dos parâmetros e retorno
      sql: string,
      values?: any
    ): Promise<[
      RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader,
      any
    ]> => {
      return Promise.resolve([[], []]); // Mock básico
    })
  }
}));