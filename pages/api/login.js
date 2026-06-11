import mysql from "mysql2/promise";
import { serialize } from "cookie";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Prevent too many simultaneous connections
  queueLimit: 0,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { username, password } = req.body;

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM User WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = rows[0];
    const role = user.role;
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    await pool.execute(
      `INSERT INTO audit_logs (user_id, action_type, action_status, action_description, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        user.user_id,
        "login",
        "success",
        `user logged in with username: ${username} and role: ${role}`,
        ipAddress
      ]
    );


    res.setHeader(
      "Set-Cookie",
      serialize("session", JSON.stringify(user), {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24,
      })
    );

    return res.status(200).json({ success: true, user });
  } catch (error) {
    if (pool) {
      try {
        await pool.execute(
          `INSERT INTO audit_logs (user_id, action_type, action_status, action_description, ip_address, created_at)
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [
            null,
            "login",
            "failure",
            `user logged in with username: ${username} and role: ${role}`,
            ipAddress

          ]
        );
      } catch (logError) {
        console.error("Failed to log audit event:", logError);
      }
    }

    console.error("Database error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

