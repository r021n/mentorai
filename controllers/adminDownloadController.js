const ExcelJS = require("exceljs");

exports.downloadTopicExcel = (req, res) => {
  const topicId = req.params.topicId;
  const db = req.db;

  //   1. ambil data soal sesuai topicId
  db.all(
    "SELECT * FROM questions WHERE topicId = ? ORDER BY id ASC",
    [topicId],
    (err, questions) => {
      if (err) {
        return res.send("Terjadi kesalahan saat mengambil data soal");
      }
      if (!questions || questions.length === 0) {
        return res.send("Tidak ada soal untuk topik ini");
      }

      //   2. Ambil jawaban siswa beserta nama dari tabel users
      const sql = `SELECT a.*, u.username
      FROM answers a
      JOIN users u ON a.userId = u.id
      WHERE a.topicId = ?
      ORDER BY u.id, a.questionId ASC
      `;

      db.all(sql, [topicId], (err, answerRows) => {
        if (err) {
          return res.send("Terjadi kesalahan saat mengambil data jawaban");
        }

        // 3. Kelompokkan jawaban berdasarkan tiap siswa
        let studentMap = {};
        answerRows.forEach((row) => {
          if (!studentMap[row.userId]) {
            studentMap[row.userId] = {
              userId: row.userId,
              username: row.username,
              answers: {},
              totalScore: 0,
            };
          }

          studentMap[row.userId].answers[row.questionId] = {
            answer: row.answer,
            feedback: row.feedback,
            score: row.score,
          };
          studentMap[row.userId].totalScore += row.score || 0;
        });
        let students = Object.values(studentMap);

        // 4. Buat file excel dengan exceljs
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Data Jawaban Siswa");

        // Buat header secara dinamis
        let headerRow = ["No", "Nama Siswa"];
        questions.forEach((question, index) => {
          headerRow.push(`Jawaban ${index + 1}`);
          headerRow.push(`Feedback ${index + 1}`);
        });
        headerRow.push("Total Skor");
        worksheet.addRow(headerRow);

        // atur style header (misal bold)
        worksheet.getRow(1).font = { bold: true };

        // 5. Tambahkan baris untuk tiap siswa
        students.forEach((student, index) => {
          let rowData = [];
          rowData.push(index + 1);
          rowData.push(student.username);

          //   cek apakah ada jawaban untuk tiap soal, jika tidak maka dibiarkan kosong
          questions.forEach((question) => {
            if (student.answers[question.id]) {
              rowData.push(student.answers[question.id].answer);
              rowData.push(student.answers[question.id].feedback);
            } else {
              rowData.push("");
              rowData.push("");
            }
          });

          rowData.push(
            Math.round((student.totalScore / (questions.length * 3)) * 100)
          );

          worksheet.addRow(rowData);
        });

        // Mengatur lebar kolom
        // =================================

        // Kolom No
        worksheet.getColumn(1).width = 5;

        // Kolom Nama Siswa
        worksheet.getColumn(2).width = 20;

        // Kolom jawaban dan feedback
        let currentColumn = 3;
        questions.forEach(() => {
          worksheet.getColumn(currentColumn).width = 30;
          worksheet.getColumn(currentColumn + 1).width = 40;
          currentColumn += 2;
        });

        // Kolom total skor
        worksheet.getColumn(currentColumn).width = 15;

        // set response headers dan kirim file sebagai download
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
          "Content-Disposition",
          `attachment; filename="Laporan_Topic_${topicId}.xlsx"`
        );

        workbook.xlsx
          .write(res)
          .then(() => res.end())
          .catch((err) => {
            console.error(err);
            res.send("Terjadi error saat membuat file excel");
          });
      });
    }
  );
};
