const { GoogleGenAI } = require("@google/genai");
const PQueue = require("p-queue").default;
require("dotenv").config();

// =========================================================
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}
const genAI = new GoogleGenAI({ apiKey: apiKey });
const feedbackQueue = new PQueue({ concurrency: 1 });
const MAX_RETRIES = 2;
const DEFAULT_FEEDBACK =
  "Maaf, kami tidak dapat memberikan evaluasi saat ini. Silakan coba lagi.";

function parseFeedbackResponse(rawText) {
  if (typeof rawText !== "string" || !rawText.trim()) {
    throw new Error("Respon Gemini kosong");
  }
  let candidate = rawText.trim();
  if (!candidate.startsWith("{")) {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      candidate = candidate.slice(start, end + 1);
    }
  }
  let parsed;
  try {
    parsed = JSON.parse(candidate);
  } catch {
    throw new Error("Format respon Gemini tidak valid");
  }
  const feedback =
    typeof parsed.feedback === "string" && parsed.feedback.trim()
      ? parsed.feedback.trim()
      : DEFAULT_FEEDBACK;
  const numericScore = Number(parsed.score);
  const score = Number.isFinite(numericScore)
    ? Math.max(0, Math.min(3, numericScore))
    : 0;
  return { feedback, score };
}

// fungsi untuk generate feedback
async function generateFeedback(inputText) {
  return feedbackQueue.add(() => generateFeedbackWithRetry(inputText));
}

async function generateFeedbackWithRetry(inputText, attempt = 0) {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      config: { temperature: 0 },
      contents: inputText,
    });
    return response.text;
  } catch (error) {
    if (attempt >= MAX_RETRIES) {
      throw error;
    }
    const backoff = Math.pow(2, attempt) * 500;
    await new Promise((resolve) => setTimeout(resolve, backoff));
    return generateFeedbackWithRetry(inputText, attempt + 1);
  }
}

// fungsi untuk mendapatkan pertanyaan dari database
function getQuestionById(db, questionId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT question, imageDescription FROM questions WHERE id = ?",
      [questionId],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          reject(new Error("Pertanyaan tidak ditemukan"));
        } else {
          resolve(row);
        }
      }
    );
  });
}

// =========================================================

exports.getExcerciseTopics = (req, res) => {
  const user = req.session.user;
  const db = req.db;

  db.all("SELECT * FROM topics", (err, topics) => {
    if (err) {
      return res.send("Terjadi kesalahan saat mendapatkan topik");
    }

    res.render("exercise/topics", { user, topics });
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
  const db = req.db;

  let feedback;
  let score = 0;

  // get question from database and make the prompt
  try {
    const questionData = await getQuestionById(db, questionId);
    const prompt = `Tugas Anda: nilai jawaban siswa secara objektif.
Output wajib berupa JSON valid tanpa teks tambahan dengan format {"feedback":"...", "score":<0-3>}.
Ketentuan:
- Feedback edukatif maksimal 3 kalimat (lebih pendek lebih baik) dan jangan membocorkan jawaban, arahkan siswa berpikir logis.
- Skor berupa angka 0 hingga 3 sesuai ketepatan jawaban.
Pertanyaan: "${questionData.question}"
Gambar pendukung soal: "${questionData.imageDescription || "-"}"
Jawaban siswa: "${answer}"`;
    const rawResponse = await generateFeedback(prompt);
    const parsed = parseFeedbackResponse(rawResponse);
    feedback = parsed.feedback;
    score = parsed.score;
  } catch (error) {
    console.error("Feedback queue error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Gagal menghasilkan feedback" });
  }

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
