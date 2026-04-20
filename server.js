const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Server is running 🔥");
});


// ================== COURSES ==================

// get all courses
app.get("/api/courses", (req, res) => {
  const sql = "SELECT * FROM courses";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(result);
    }
  });
});


// ================== USERS ==================

// register user
app.post("/api/users", (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json({ message: "User created ✅" });
    }
  });
});


// ================== SERVER ==================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});