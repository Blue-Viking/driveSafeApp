// pages/api/points/transaction.js
import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { user_id, sponsor_user_id = null, changeAmount, reason } = req.body;
  if (!user_id || typeof changeAmount !== 'number') {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // lock & read old balance
    const [[row]] = await conn.execute(
      'SELECT current_points FROM Points_Balance WHERE user_id = ? FOR UPDATE',
      [user_id]
    );
    const before = row ? row.current_points : 0;
    const after  = before + changeAmount;
    const type   = changeAmount > 0 ? 'addition' : 'deduction';

    // insert audit record
    await conn.execute(
      `INSERT INTO Points_Change
         (sponsor_user_id, user_id, points_added, reason, change_date, change_type, points_before, points_after)
       VALUES (?, ?, ?, ?, NOW(), ?, ?, ?)`,
      [sponsor_user_id, user_id, Math.abs(changeAmount), reason, type, before, after]
    );

    // upsert the cached balance
    await conn.execute(
      `INSERT INTO Points_Balance (user_id, current_points)
         VALUES (?, ?)
       ON DUPLICATE KEY UPDATE
         current_points = ?`,
      [user_id, after, after]
    );

    await conn.commit();
    res.status(200).json({ before, after });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    conn.release();
  }
}

