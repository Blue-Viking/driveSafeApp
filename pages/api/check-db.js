import mysql from "mysql2";

export default async function handler(req, res) {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      res.status(500).json({ success: false, message: "Failed to connect to the database" });
    } else {
      res.status(200).json({ success: true, message: "Successfully connected to the database!" });
    }
    connection.end();
  });
}