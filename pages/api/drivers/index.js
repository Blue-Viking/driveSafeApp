// pages/api/drivers/index.js

import db from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // pull sponsor_id (snake_case) to match what the client sends
    const { username, email, password, sponsor_id } = req.body;

    // validate all four fields
    if (!username || !email || !password || !sponsor_id) {
      return res.status(400).json({ error: "Missing fields" });
    }

    try {
      const [result] = await db.execute(
        `INSERT INTO \`User\` (username, email, password, role, sponsor_id)
         VALUES (?, ?, ?, 'driver', ?)`,
        [username, email, password, sponsor_id]
      );
      return res.status(201).json({ driverId: result.insertId });
    } catch (err) {
      console.error("DB error creating driver:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

