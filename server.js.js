const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

// اتصال الداتا بيز
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345", // لو عندك باسورد حطه هنا
  database: "hacklearn"
});

db.connect(err => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("Database Connected 🔥");
  }
});

// API تجيب كل اليوزرز
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

app.listen(3000, () => {
  console.log("Server running...");
});

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

  db.query(sql, [username, email, password], (err) => {
    if (err) return res.send(err);
    res.send("User Added 🔥");
  });
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, result) => {
    if (err) return res.send(err);

    if (result.length === 0) {
      return res.send("User not found");
    }

    const user = result[0];

    if (user.password !== password) {
      return res.send("Wrong password");
    }

    res.send("Login successful 🔥");
  });
});
app.get("/paths", (req, res) => {
  db.query("SELECT * FROM paths", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});
app.get("/rooms/:pathId", (req, res) => {
  const pathId = req.params.pathId;

  db.query(
    "SELECT * FROM rooms WHERE path_id = ?",
    [pathId],
    (err, result) => {
      if (err) return res.send(err);
      res.json(result);
    }
  );
});
app.post("/progress", (req, res) => {
  const { user_id, room_id, status, score } = req.body;

  const sql = `
    INSERT INTO progress (user_id, room_id, status, score)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [user_id, room_id, status, score], (err) => {
    if (err) return res.send(err);
    res.send("Progress Saved 🔥");
  });
});
app.get("/leaderboard", (req, res) => {
  const sql = `
    SELECT users.username, SUM(progress.score) AS total_score
    FROM progress
    JOIN users ON users.id = progress.user_id
    GROUP BY users.username
    ORDER BY total_score DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});
app.get("/", (req, res) => {
  res.send("HackLearn API is running 🚀");
});
app.get("/", (req, res) => {
  res.send(`
    <h1>HackLearn 🚀</h1>
    <p>Welcome to HackLearn API</p>
    <ul>
      <li>/users</li>
      <li>/paths</li>
      <li>/rooms/1</li>
      <li>/leaderboard</li>
    </ul>
  `);
});