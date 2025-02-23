import type { Pool } from 'mysql2/promise';

declare module 'jest' {
  interface Mock<T = any> {
    mockResolvedValue(value: ReturnType<Pool['query']>): this;
  }
}