// pages/api/admin/sponsors.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow',['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [rows] = await conn.execute(
      `SELECT
         sponsor_id AS sponsorId,
         name
       FROM Sponsor
       ORDER BY name ASC`
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error('Admin sponsors list error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await conn.end();
  }
}

