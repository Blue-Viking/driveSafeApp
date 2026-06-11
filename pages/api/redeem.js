// pages/api/redeem.js

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { driverId, points } = req.body;

  if (!driverId || points == null) {
    return res.status(400).json({ error: 'Missing driverId or points' });
  }

  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    await pool.query(
      'UPDATE Driver SET total_points = total_points + ? WHERE driver_id = ?',
      [points, driverId]
    );

    // Log the redeem action
    await pool.execute(
      `INSERT INTO audit_logs (user_id, action_type, action_status, action_description, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        driverId,
        'redeem',
        'success',
        `Driver redeemed ${points} points.`,
        ipAddress
      ]
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Database error:', err);

    // Log the failure
    try {
      await pool.execute(
        `INSERT INTO audit_logs (user_id, action_type, action_status, action_description, ip_address, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          driverId || null,
          'redeem',
          'failure',
          `Failed to redeem ${points} points for driver ${driverId}.`,
          ipAddress
        ]
      );
    } catch (logErr) {
      console.error('Failed to log audit event:', logErr);
    }

    res.status(500).json({ error: 'Failed to update points' });
  }
}
