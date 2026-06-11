// pages/api/sponsor/drivers.js
import db from '../../../lib/db';

export default async function handler(req, res) {
  const sponsorId = parseInt(req.query.sponsor_id, 10);
  if (!sponsorId) {
    return res.status(400).json({ error: 'Missing sponsor_id' });
  }

  try {
    const [rows] = await db.execute(
      `SELECT id, name
         FROM \`User\`
        WHERE role = 'driver'
          AND sponsor_id = ?`,
      [sponsorId]
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}

