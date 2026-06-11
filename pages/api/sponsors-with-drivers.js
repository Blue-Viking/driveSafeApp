// pages/api/sponsors-with-drivers.js

import db from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { sponsor_id } = req.query;
  if (!sponsor_id) {
    return res.status(400).json({ error: "Missing sponsor_id query parameter" });
  }
  const sid = parseInt(sponsor_id, 10);
  if (Number.isNaN(sid)) {
    return res.status(400).json({ error: "Invalid sponsor_id" });
  }

  try {
    // Fetch sponsor info
    const [sponsorRows] = await db.execute(
      `SELECT sponsor_id, name AS sponsor_name
       FROM Sponsor
       WHERE sponsor_id = ?`,
      [sid]
    );
    if (sponsorRows.length === 0) {
      return res.status(404).json({ error: "Sponsor not found" });
    }
    const sponsor = sponsorRows[0];

    // Fetch only drivers belonging to this sponsor
    const [driverRows] = await db.execute(
      `SELECT user_id, username
       FROM \`User\`
       WHERE sponsor_id = ?
         AND role = 'driver'`,
      [sid]
    );

    // Return single-element array for front-end mapping
    return res.status(200).json([
      {
        sponsor_id:   sponsor.sponsor_id,
        sponsor_name: sponsor.sponsor_name,
        drivers:      driverRows,
      },
    ]);
  } catch (err) {
    console.error("DB error in sponsors-with-drivers:", err);
    return res.status(500).json({ error: "Database error" });
  }
}

