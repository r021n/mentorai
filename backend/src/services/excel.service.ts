import ExcelJS from "exceljs";

export interface QuestionSummary {
  id: number;
  question: string;
}

export interface StudentAnswerItem {
  answer: string | null;
  feedback: string | null;
  score: number | null;
}

export interface StudentSummary {
  userId: number;
  username: string;
  answers: Record<number, StudentAnswerItem>;
  totalScore: number;
}

export async function generateTopicExcelReport(
  topicName: string,
  questions: QuestionSummary[],
  students: StudentSummary[]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`Laporan_${topicName.substring(0, 20)}`);

  // 1. Dynamic Headers
  const headerRow: string[] = ["No", "Nama Siswa"];
  questions.forEach((_, idx) => {
    headerRow.push(`Jawaban ${idx + 1}`);
    headerRow.push(`Feedback ${idx + 1}`);
  });
  headerRow.push("Total Skor (%)");

  const row = worksheet.addRow(headerRow);
  row.font = { bold: true };

  // 2. Data Rows
  const numQuestions = questions.length;
  students.forEach((student, index) => {
    const rowData: (string | number)[] = [index + 1, student.username];

    questions.forEach((q) => {
      const ans = student.answers[q.id];
      if (ans) {
        rowData.push(ans.answer || "-");
        rowData.push(ans.feedback || "-");
      } else {
        rowData.push("");
        rowData.push("");
      }
    });

    const maxScore = numQuestions * 3;
    const finalScore = maxScore > 0 ? Math.round((student.totalScore / maxScore) * 100) : 0;
    rowData.push(finalScore);

    worksheet.addRow(rowData);
  });

  // 3. Set Column Widths
  worksheet.getColumn(1).width = 5;
  worksheet.getColumn(2).width = 20;

  let currentColumn = 3;
  questions.forEach(() => {
    worksheet.getColumn(currentColumn).width = 30;
    worksheet.getColumn(currentColumn + 1).width = 40;
    currentColumn += 2;
  });

  worksheet.getColumn(currentColumn).width = 15;

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
