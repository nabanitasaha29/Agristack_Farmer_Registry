import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // allows self-signed certs, adjust if you have a proper cert
  },
});

pool.on('connect', () => {
  console.log('connected to database');
});
