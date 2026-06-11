// pages/api/get-points.js
import db from '../../lib/db';

export default async function handler(req, res) {
  const userId = parseInt(req.query.user_id, 10);
  if (!userId) return res.status(400).json({ error: 'Missing user_id' });

  // 1) Available balance from cache
  const [balRows] = await db.execute(
    'SELECT current_points FROM Points_Balance WHERE user_id = ?',
    [userId]
  );
  const availablePoints = balRows.length ? balRows[0].current_points : 0;

  // start of month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // 2a) earned this month
  const [[{ earned }]] = await db.execute(
    `SELECT COALESCE(SUM(points_added),0) AS earned
     FROM Points_Change
     WHERE user_id = ?
       AND change_type = 'addition'
       AND change_date >= ?`,
    [userId, startOfMonth]
  );

  // 2b) deducted this month
  const [[{ deducted }]] = await db.execute(
    `SELECT COALESCE(SUM(points_added),0) AS deducted
     FROM Points_Change
     WHERE user_id = ?
       AND change_type = 'deduction'
       AND change_date >= ?`,
    [userId, startOfMonth]
  );

  // 2c) all-time added
  const [[{ totalAdded }]] = await db.execute(
    `SELECT COALESCE(SUM(points_added),0) AS totalAdded
     FROM Points_Change
     WHERE user_id = ?
       AND change_type = 'addition'`,
    [userId]
  );

  // 2d) all-time deducted
  const [[{ totalDeducted }]] = await db.execute(
    `SELECT COALESCE(SUM(points_added),0) AS totalDeducted
     FROM Points_Change
     WHERE user_id = ?
       AND change_type = 'deduction'`,
    [userId]
  );

  return res.json({
    availablePoints,
    earnedThisMonth: earned,
    pointsDeducted:  deducted,
    pointsSpent:     totalDeducted,
    totalPoints:     totalAdded
  });
}

