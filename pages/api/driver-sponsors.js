// pages/api/driver-sponsors.js
import mysql from 'mysql2/promise';
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  const cookies = parseCookies({ req });
  const userId = cookies.userId;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId cookie' });
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host:     process.env.DB_HOST,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port:     3306,
    });

    const [rows] = await connection.execute(
      `SELECT sp.sponsor_id,
              sp.name,
              sp.contact_email,
              sp.contact_phone
       FROM Driver_Application da
       JOIN Sponsor sp ON da.sponsor_id = sp.sponsor_id
       WHERE da.user_id = ?
         AND da.status = 'accepted'
       ORDER BY sp.name`,
      [userId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Database query failed' });
  } finally {
    if (connection) await connection.end();
  }
}

