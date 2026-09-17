import { describe, it, expect } from "../test-utils.js";
import { generateTopicExcelReport, type StudentSummary, type StudentAnswerItem } from "../../src/services/excel.service.js";
import ExcelJS from "exceljs";

describe("Excel Service - generateTopicExcelReport", () => {
  it("should generate a valid XLSX buffer with correct headers and rows", async () => {
    const questions = [
      { id: 1, question: "Soal 1" },
      { id: 2, question: "Soal 2" },
    ];
    const student1Answers: Record<number, StudentAnswerItem> = {
      1: { answer: "Jawaban 1", feedback: "Bagus", score: 3 },
      2: { answer: "Jawaban 2", feedback: "Cukup", score: 2 },
    };
    const student2Answers: Record<number, StudentAnswerItem> = {
      1: { answer: "Jawaban Ani 1", feedback: "Hebat", score: 3 },
    };
    const students: StudentSummary[] = [
      {
        userId: 1,
        username: "budi",
        answers: student1Answers,
        totalScore: 5,
      },
      {
        userId: 2,
        username: "ani",
        answers: student2Answers,
        totalScore: 3,
      },
    ];

    const buffer = await generateTopicExcelReport("Pemrograman Python", questions, students);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);

    // Read back buffer to verify sheet content
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);
    const worksheet = workbook.worksheets[0];
    expect(worksheet).toBeDefined();

    // Verify headers
    const headerRow = worksheet!.getRow(1).values as string[];
    expect(headerRow).toContain("No");
    expect(headerRow).toContain("Nama Siswa");
    expect(headerRow).toContain("Jawaban 1");
    expect(headerRow).toContain("Feedback 1");
    expect(headerRow).toContain("Jawaban 2");
    expect(headerRow).toContain("Feedback 2");
    expect(headerRow).toContain("Total Skor (%)");

    // Verify row count (1 header + 2 students = 3 rows)
    expect(worksheet!.rowCount).toBe(3);
  });
});
