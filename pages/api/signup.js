import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { username, password, email, role } = req.body;
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (!username || !password || !email || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Insert the new user
    await connection.execute(
      "INSERT INTO User (username, password, email, role) VALUES (?, ?, ?, ?)",
      [username, password, email, role]
    );

    //log successful
    await connection.execute(
      `INSERT INTO audit_logs (user_id, action_type, action_status, action_description, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        null, //no user id
        "signup",
        "success",
        `New user signed up with email: ${email} and role: ${role}`,
        ipAddress,
      ]
    );

    res.status(201).json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error(error);

    if (connection) {
      try {
        //log signup
        await connection.execute(
          `INSERT INTO audit_logs (user_id, action_type, action_status, action_description, ip_address, created_at)
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [
            null, //signup failed
            "signup",
            "failure",
            `Sign-up failed for email: ${email}. Error: ${error.message}`,
            ipAddress,
          ]
        );
      } catch (logError) {
        console.error("Failed to log audit event:", logError);
      }
    }

    res.status(500).json({ error: "Server error. Please try again later." });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
