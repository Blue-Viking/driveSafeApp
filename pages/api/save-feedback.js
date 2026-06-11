import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { rating, question1, question2, email, comment } = req.body;

  if (!rating || !question1 || !question2) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await connection.execute(
      `INSERT INTO Feedback (rating, question1, question2, email, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [rating, question1, question2, email || null, comment || null]
    );

    await connection.end();
    res.status(201).json({ success: true, message: "Feedback saved successfully!" });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ error: "Error saving feedback." });
  }
}
