exports.getUsersPage = (req, res) => {
  const db = req.db;

  //   Ambil semua data user
  db.all("SELECT * FROM users", (err, users) => {
    if (err) {
      return res
        .status(500)
        .send("Terjadi kesalahan saat mengambil data users");
    }

    res.render("database/users", { users: users });
  });
};

exports.searchUsers = (req, res) => {
  const query = req.query.q || "";
  const db = req.db;
  const sql = "SELECT * FROM users WHERE username LIKE ?";
  db.all(sql, ["%" + query + "%"], (err, users) => {
    if (err) {
      return res.json({ success: false, message: "error dalam pencarian" });
    }

    res.json(users);
  });
};

exports.deleteUsers = (req, res) => {
  const ids = req.body.ids;
  const db = req.db;
  if (!Array.isArray(ids)) {
    return res.json({ success: false, message: "Data tidak valid" });
  }

  //   menggunakan query DELETE dengan klausa IN
  const placeholders = ids.map(() => "?").join(",");
  const sql = `DELETE FROM users WHERE id IN (${placeholders})`;
  db.run(sql, ids, (err) => {
    if (err) {
      return res.json({ success: false, message: "gagal menghapus data" });
    }

    res.json({ success: true });
  });
};

exports.editUsers = (req, res) => {
  const { id, username, password, role } = req.body;
  const db = req.db;
  const sql =
    "UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?";
  db.run(sql, [username, password, role, id], (err) => {
    if (err) {
      return res.json({ success: false, message: "gagal menghapus data" });
    }

    res.json({ success: true });
  });
};
