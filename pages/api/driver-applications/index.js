// pages/api/driver-applications/index.js

import db from "../../../lib/db";

export default async function handler(req, res) {
  const { method, query, headers } = req;

  // — GET: list (optionally filtered) applications →
  if (method === "GET") {
    // parse optional sponsor filter
    let sponsorId = null;
    if (query.sponsor_id) {
      sponsorId = Number(query.sponsor_id);
      if (Number.isNaN(sponsorId)) {
        return res.status(400).json({ error: "Invalid sponsor_id" });
      }
    }

    try {
      // build base SQL
      let sql = `
        SELECT
          da.id                                           AS id,
          u.username                                      AS driver_name,
          s.name                                          AS sponsor_name,
          JSON_UNQUOTE(JSON_EXTRACT(da.info, '$.name'))   AS name,
          da.reason                                       AS reason,
          da.status                                       AS status,
          da.created_at                                   AS applied_at
        FROM Driver_Application AS da
        JOIN \`User\`           AS u ON da.user_id    = u.user_id
        LEFT JOIN Sponsor       AS s ON da.sponsor_id = s.sponsor_id
      `;
      const params = [];

      // apply WHERE if sponsorId was provided
      if (sponsorId) {
        sql += " WHERE da.sponsor_id = ?";
        params.push(sponsorId);
      }

      sql += " ORDER BY da.created_at DESC";

      const [rows] = await db.execute(sql, params);
      return res.status(200).json(rows);
    } catch (err) {
      console.error("DB error fetching applications:", err);
      return res.status(500).json({ error: "Database error fetching applications" });
    }
  }

  // — POST: insert new application —
  if (method === "POST") {
    const { sponsor_id, name } = req.body;

    if (!sponsor_id || !name) {
      return res.status(400).json({ error: "Missing sponsor_id or name" });
    }

    let user_id;
    try {
      const session = JSON.parse(headers["x-user-session"] || "{}");
      user_id = session.user_id;
    } catch {
      return res.status(401).json({ error: "Invalid session" });
    }
    if (!user_id) {
      return res.status(401).json({ error: "Missing user_id" });
    }

    try {
      await db.execute(
        `INSERT INTO Driver_Application (user_id, sponsor_id, info)
         VALUES (?, ?, JSON_OBJECT('name', ?))`,
        [user_id, sponsor_id, name]
      );
      return res.status(201).json({ message: "Application submitted" });
    } catch (err) {
      console.error("DB error creating application:", err);
      return res.status(500).json({ error: "Server error creating application" });
    }
  }

  // method not allowed
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${method} Not Allowed`);
}

