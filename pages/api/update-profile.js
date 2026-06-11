// pages/api/update-profile.js
import db from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const sessionHeader = req.headers["x-user-session"];
  if (!sessionHeader) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  let session;
  try {
    session = JSON.parse(sessionHeader);
  } catch {
    return res.status(400).json({ error: "Invalid session data" });
  }

  const userId = parseInt(session.user_id, 10);
  if (isNaN(userId)) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { username, email, password } = req.body;

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

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  params.push(userId);

  try {
    const sql = `UPDATE \`User\` SET ${fields.join(", ")} WHERE user_id = ?`;
    await db.execute(sql, params);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
}

