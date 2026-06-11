require('dotenv').config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// MySQL connection
/*const db = mysql.createConnection({
  host: process.env.DB_HOST,  
  user: process.env.DB_USER,  
  password: process.env.DB_PASS,  
  database: process.env.DB_NAME,  
});
*/
const db = mysql.createConnection({
  host: process.env.DB_HOST,  
  user: process.env.DB_USER,  
  password: process.env.DB_PASS,  
  database: process.env.DB_NAME,  
});

db.connect(err => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to AWS RDS!");
  }
});


// Serve a simple webpage that fetches data from MySQL
app.get("/", (req, res) => {
    db.query("SELECT NOW() AS current_time", (err, results) => {
      if (err) {
        return res.send(`
          <h1 style="color: red;">Database Connection Failed</h1>
          <p>Error: ${err.message}</p>
        `);
      }
      
      res.send(`
        <h1 style="color: green;">Connected to Database!</h1>
        <p>Server Time: ${results[0].current_time}</p>
      `);
    });
  });
  
  
// Start server on port 80 (default HTTP port)
app.listen(80, () => {
  console.log("Server running on port 80");
});

      
