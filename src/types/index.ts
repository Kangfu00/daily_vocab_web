// src/types/index.ts
import internal from "stream";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Word = {
    id: number;
    word: string;
    definition: string;
    difficulty_level: Difficulty;
};

// เพิ่ม Type สำหรับ AI Feedback
export type AIResponse = {
    score: number;
    level: Difficulty;
    suggestion: string;
    corrected_sentence: string;
};

// เพิ่ม Type สำหรับ History จาก API
export type HistoryItem = {
    id: number;
    word: string;
    user_sentence: string;
    score: number;
    feedback: string;
    practiced_at: string; // ISO string
}

// เพิ่ม Type สำหรับ Summary จาก API
export type SummaryResponse = {
    total_practices: number;
    average_score: number;
    total_words_practiced: number;
    // ใช้ string key ตามที่ FastAPI ส่งกลับมา
    level_distribution: {
        [key in Difficulty]: number;
    };
};