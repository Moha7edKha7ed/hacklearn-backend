const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "HackLearn",
  port: 3307 // أو 3306 حسب XAMPP عندك
});

db.connect((err) => {
  if (err) {
    console.log("DB Error ❌", err);
  } else {
    console.log("Database Connected ✅");
  }
});

module.exports = db;