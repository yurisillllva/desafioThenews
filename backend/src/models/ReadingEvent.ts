import { RowDataPacket } from 'mysql2';

export interface ReadingEvent extends RowDataPacket {
    id: number;
    user_id: number;
    post_id: string;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    utm_channel?: string | null;
    created_at: Date;
}