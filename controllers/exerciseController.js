exports.getExcerciseTopics = (req, res) => {
  const db = req.db;
  db.all("SELECT * FROM topics", (err, topics) => {
    if (err) {
      return res.send("Terjadi kesalahan saat mendapatkan topik");
    }

    res.render("exercise/topics", { topics });
  });
};

exports.getExercisePage = (req, res) => {
  const topicId = req.params.topicId;
  const userId = req.session.user.id;
  const db = req.db;

  //ambil data question berdasarkan id topic
  db.all(
    "SELECT * FROM questions WHERE topicId = ? ORDER BY id ASC",
    [topicId],
    (err, questions) => {
      if (err || !questions) {
        return res.send("Terjadi kesalahan saat mengambil data soal");
      }

      //   ambil data answer untuk user ini pada topik tersebut
      db.all(
        "SELECT * FROM answers WHERE topicId = ? AND userId = ?",
        [topicId, userId],
        (err, answers) => {
          if (err) {
            return res.send("Terjadi kesalahan saat mengambil data jawaban");
          }

          res.render("exercise/exercise", {
            topicId: topicId,
            questions: JSON.stringify(questions),
            answers: JSON.stringify(answers),
          });
        }
      );
    }
  );
};

exports.postSubmitAnswer = (req, res) => {
  const topicId = req.params.topicId;
  const userId = req.session.user.id;
  const { questionId, answer } = req.body;
  //   generate dummy feedback dan score
  const feedback = `Jawaban id ${questionId} sudah direkam, terimakasih`;
  const score = 100;
  const db = req.db;

  //   cek apakah sudah ada record answer
  db.get(
    "SELECT * FROM answers WHERE userId = ? AND questionId = ? AND topicId = ?",
    [userId, questionId, topicId],
    (err, row) => {
      if (err) {
        return res.json({ success: false, message: "error saat query" });
      }

      if (row) {
        // update jawaban yang sudah ada
        db.run(
          "UPDATE answers SET answer = ?, feedback = ?, score = ? WHERE id = ?",
          [answer, feedback, score, row.id],
          (err) => {
            if (err) {
              return res.json({
                success: false,
                message: "Gagal memperbarui jawaban",
              });
            }
            return res.json({
              success: true,
              feedback: feedback,
            });
          }
        );
      } else {
        //insert jawaban baru
        db.run(
          "INSERT INTO answers (answer, feedback, score, userId, questionId, topicId) VALUES (?, ?, ?, ?, ?, ?)",
          [answer, feedback, score, userId, questionId, topicId],
          (err) => {
            if (err) {
              return res.json({
                success: false,
                message: "Gagal menyimpan jawaban",
              });
            }

            return res.json({
              success: true,
              feedback: feedback,
            });
          }
        );
      }
    }
  );
};
