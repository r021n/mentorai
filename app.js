const express = require("express");
const session = require("express-session");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// koneksi ke database sqlite
const db = new sqlite3.Database("./db.sqlite", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Coneected to sqlite database");
  }
});

// middleware untuk parsing form
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// konfigurasi session
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// set EJS sebagai view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// folder untuk file static (css, js, image)
app.use(express.static(path.join(__dirname, "public")));

// membuat objek db supaya dapat diakses direquest (req.db)
app.use((req, res, next) => {
  req.db = db;
  next();
});

// import routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const topicRoutes = require("./routes/topicRoutes");

// menggunakan routes
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/topics", topicRoutes);

// buat tabel user jika belum ada dan seed akun admin
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT NOT NULL
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
    )`);

  // cek dan sisipkan akun admin jika belum ada
  db.get("SELECT * FROM users WHERE username = ?", ["admin"], (err, row) => {
    if (err) {
      console.error(err.message);
    } else if (!row) {
      db.run(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        ["admin", "adminMentorAI123", "admin"],
        (err) => {
          if (err) {
            console.error(err.message);
          }
          console.log("inserted admin account");
        }
      );
    }
  });
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
