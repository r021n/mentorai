const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// =========================================================
// fungsi untuk generate feedback
async function generateFeedback(inputText) {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenAI({ apiKey: apiKey });
  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: inputText,
  });
  return response.text;
}

// fungsi untuk mendapatkan pertanyaan dari database
function getQuestionById(db, questionId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT question FROM questions WHERE id = ?",
      [questionId],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          reject(new Error("Pertanyaan tidak ditemukan"));
        } else {
          resolve(row.question);
        }
      }
    );
  });
}

// =========================================================

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

exports.postSubmitAnswer = async (req, res) => {
  const topicId = req.params.topicId;
  const userId = req.session.user.id;
  const { questionId, answer } = req.body;
  //   generate dummy feedback dan score
  const score = 3;
  const db = req.db;

  // get question from database and make the prompt
  const question = await getQuestionById(db, questionId);
  const prompt = `Tolong berikan feedback edukatif singkat (maksimal 3 kalimat) untuk pertanyaan berikut "${question}" terhadap jawaban berikut "${answer}"`;
  let feedback = await generateFeedback(prompt);

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
