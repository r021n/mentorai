exports.getAnswersPage = (req, res) => {
  const db = req.db;
  // ambil filter dari query jika ada
  let { userId, questionId, topicId } = req.query;
  let sql = "SELECT * FROM answers";
  let conditions = [];
  let params = [];

  if (userId) {
    conditions.push("userId = ?");
    params.push(userId);
  }

  if (questionId) {
    conditions.push("questionId = ?");
    params.push(questionId);
  }

  if (topicId) {
    conditions.push("topicId = ?");
    params.push(topicId);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  sql += " ORDER BY id ASC";

  db.all(sql, params, (err, answers) => {
    if (err) {
      return res.send("error saat mengambil data answers");
    }
    res.render("database/answers", {
      answers: answers,
      filters: { userId, questionId, topicId },
    });
  });
};

exports.searchAnswers = (req, res) => {
  const db = req.db;
  const { userId, topicId, questionId } = req.query;
  let sql = "SELECT * FROM answers";
  let conditions = [];
  let params = [];

  if (userId) {
    conditions.push("userId = ?");
    params.push(userId);
  }

  if (questionId) {
    conditions.push("questionId = ?");
    params.push(questionId);
  }

  if (topicId) {
    conditions.push("topicId = ?");
    params.push(topicId);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  sql += " ORDER BY id ASC";

  db.all(sql, params, (err, answers) => {
    if (err) {
      return res.json({ success: false, message: "Error pencarian" });
    }
    res.json(answers);
  });
};

exports.deleteAnswers = (req, res) => {
  const ids = req.body.ids;
  const db = req.db;
  if (!Array.isArray(ids)) {
    return res.json({ success: "false", message: "Data tidak valid" });
  }

  const placeholders = ids.map(() => "?").join(",");
  const sql = `DELETE FROM answers WHERE id IN (${placeholders})`;
  db.run(sql, ids, function (err) {
    if (err) {
      return res.json({ success: false, message: "gagal menghapus data" });
    }
    res.json({ success: true });
  });
};

exports.editAnswers = (req, res) => {
  const { id, answer, feedback, score, userId, questionId, topicId } = req.body;
  const db = req.db;
  const sql =
    "UPDATE answers SET answer = ?, feedback = ?, score = ?, userId = ?, questionId = ?, topicId = ? WHERE id = ?";
  db.run(
    sql,
    [answer, feedback, score, userId, questionId, topicId],
    function (err) {
      if (err) {
        return res.json({ success: false, message: "gagal mengupdate data" });
      }

      res.json({ success: true });
    }
  );
};
