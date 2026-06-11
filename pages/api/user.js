// pages/api/users.js
import db from "../../lib/db"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { role, sponsor_id } = req.query

  if (!role) {
    return res.status(400).json({ error: "Missing role parameter" })
  }

  try {
    // Base query: filter by role
    let sql = `
      SELECT user_id, username, email, role, sponsor_id
      FROM User
      WHERE role = ?
    `
    const params = [role]

    // If sponsor_id was passed, AND it into the query
    if (sponsor_id) {
      sql += ` AND sponsor_id = ?`
      params.push(sponsor_id)
    }

    const [rows] = await db.execute(sql, params)
    res.status(200).json(rows)
  } catch (err) {
    console.error("DB error:", err)
    res.status(500).json({ error: "Database error" })
  }
}

