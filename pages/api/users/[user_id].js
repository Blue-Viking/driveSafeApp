// pages/api/users/[user_id].js
import db from "../../../lib/db";

export default async function handler(req, res) {
  const { user_id } = req.query;
  const id = parseInt(user_id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid user_id" });
  }

  if (req.method === "GET") {
    try {
      const [rows] = await db.execute(
        "SELECT user_id, username, email FROM `User` WHERE user_id = ?",
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  if (req.method === "PUT") {
    const { username, email, password, points } = req.body;

    const fields = [];
    const params = [];

    if (typeof username === "string") {
      fields.push("username = ?");
      params.push(username);
    }
    if (typeof email === "string") {
      fields.push("email = ?");
      params.push(email);
    }
    if (typeof password === "string") {
      fields.push("password = ?");
      params.push(password);
    }

    if (fields.length === 0 && points === undefined) {
      return res.status(400).json({ error: "No fields to update" });
    }

    try {
      if (fields.length > 0) {
        params.push(id);
        await db.execute(
          `UPDATE \`User\` SET ${fields.join(", ")} WHERE user_id = ?`,
          params
        );
      }
      if (points !== undefined) {
        await db.execute(
          `INSERT INTO Points_Balance (user_id, current_points)
           VALUES (?, ?)
           ON DUPLICATE KEY UPDATE current_points = ?`,
          [id, points, points]
        );
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

