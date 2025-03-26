exports.getLogin = (req, res) => {
  res.render("login", { error: null });
};

exports.postLogin = (req, res) => {
  const { username, password } = req.body;
  const db = req.db;
  const sql = "SELECT * FROM users WHERE username = ?";

  db.get(sql, [username], (err, user) => {
    if (err) {
      return res.render("login", {
        error: "terjadi kesalahan, silahkan coba lagi",
      });
    }

    // validasi
    if (!user || user.password !== password) {
      return res.render("login", { error: "username atau password salah" });
    }

    // simpan data user ke session
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    res.redirect("/dashboard");
  });
};

exports.getRegister = (req, res) => {
  res.render("register", { error: null });
};

exports.postRegister = (req, res) => {
  const { username, password, confirmPassword } = req.body;

  //   validasi form
  if (!username || !password || !confirmPassword) {
    return res.render("register", { error: "semua kolom wajib diisi" });
  }

  if (password !== confirmPassword) {
    return res.render("register", {
      error: "password dan konfirmasi password tidak sama",
    });
  }

  const db = req.db;

  //   sisipkan user baru dengan role "siswa"
  const sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
  db.run(sql, [username, password, "siswa"], (err) => {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.render("register", { error: "username sudah digunakan" });
      }
      return res.render("register", {
        error: "terjadi kesalahan, silahkan coba lagi",
      });
    }

    res.redirect("/login");
  });
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/dashboard");
};
