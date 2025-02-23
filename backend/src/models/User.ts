import { RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
  id: number;
  email: string;
  password: string;
  is_admin: boolean;
  created_at: Date;
}