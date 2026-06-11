// pages/api/points-change.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const connection = await mysql.createConnection({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port:     3306,
  });

  try {
    if (req.method === "GET") {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
      }

      const [rows] = await connection.execute(
        `SELECT
           point_change_id,
           DATE_FORMAT(change_date, '%Y-%m-%d') AS date,
           DATE_FORMAT(change_date, '%H:%i:%s') AS time,
           reason,
           change_type,
           points_added,
           points_after
         FROM Points_Change
         WHERE user_id = ?
         ORDER BY change_date DESC`,
        [userId]
      );

      const formatted = rows.map((r) => ({
        id:     r.point_change_id,
        date:   r.date,
        time:   r.time,
        reason: r.reason,
        change: (r.change_type === 'addition' ? '+' : '−') + r.points_added,
        after:  r.points_after,
      }));

      res.status(200).json(formatted);
    } 
    else if (req.method === "POST") {
      const { driver_id, delta, reason } = req.body;
      if (!driver_id || typeof delta !== "number" || !reason) {
        return res.status(400).json({ error: "Missing or invalid fields" });
      }

      // Get current points from Points_Balance
      const [balanceRows] = await connection.execute(
        `SELECT current_points FROM Points_Balance WHERE user_id = ?`,
        [driver_id]
      );

      if (balanceRows.length === 0) {
        return res.status(404).json({ error: "Driver not found in Points_Balance" });
      }

      const currentPoints = balanceRows[0].current_points || 0;
      const newPoints = currentPoints + delta;

      // Update Points_Balance
      await connection.execute(
        `UPDATE Points_Balance SET current_points = ? WHERE user_id = ?`,
        [newPoints, driver_id]
      );

      // Insert into Points_Change
      await connection.execute(
        `INSERT INTO Points_Change (user_id, points_added, reason, change_date, change_type, points_before, points_after)
         VALUES (?, ?, ?, NOW(), ?, ?, ?)`,
        [
          driver_id,
          Math.abs(delta),
          reason,
          delta >= 0 ? "addition" : "deduction",
          currentPoints,
          newPoints
        ]
      );

      res.status(200).json({ message: "Points updated successfully." });
    } 
    else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ error: "Database query failed" });
  } finally {
    await connection.end();
  }
}

