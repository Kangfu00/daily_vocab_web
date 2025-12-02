"use client";

import { useState, useEffect, useCallback } from 'react';
import { Word, AIResponse, Difficulty } from '@/types';
// ลบ import { scoreSentence } from '@/lib/scoring'; ทิ้ง

// Base URL สำหรับ FastAPI (ควรใช้ Environment Variable ใน Production)
const API_BASE_URL = 'http://localhost:8000/api';

export default function Home() {
    const [currentWord, setCurrentWord] = useState<Word | null>(null);
    const [sentence, setSentence] = useState<string>('');
    const [aiFeedback, setAiFeedback] = useState<AIResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getWord = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/word`);
            if (!response.ok) throw new Error('Failed to fetch word');
            
            const data = await response.json();

            // รีเซ็ต state ทั้งหมด
            setCurrentWord(data);
            setSentence('');
            setAiFeedback(null);
        } catch (e: any) {
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getWord();
    }, [getWord]);

    const handleSentenceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSentence(e.target.value);
    };

    const handleSubmitSentence = async () => {
        if (!currentWord || !sentence.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/validate-sentence`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    word_id: currentWord.id,
                    sentence: sentence.trim(),
                    // user_id: 1, // สามารถเพิ่ม user_id หากมีระบบ login
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Validation failed on server.');
            }

            const feedbackData: AIResponse = await response.json();
            setAiFeedback(feedbackData);

        } catch (e: any) {
            setError(e.message || 'An unknown error occurred during submission.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextWord = () => {
        getWord();
    };
    
    const getDifficultyColor = (difficulty: Difficulty) => {
        switch (difficulty) {
            case "Beginner": return "bg-green-200 text-green-800";
            case "Intermediate": return "bg-yellow-200 text-yellow-800";
            case "Advanced": return "bg-red-200 text-red-800";
            default: return "bg-gray-200 text-gray-800";
        }
    };
    
    const getScoreColor = (score: number) => {
        if (score >= 8.0) return "text-success";
        if (score >= 6.0) return "text-warning";
        return "text-danger";
    };

    if (isLoading && !currentWord) {
        return <div className="flex justify-center items-center h-screen text-xl text-gray-600">Loading word...</div>;
    }
    
    if (error) {
        return <div className="text-center p-8 bg-red-100 text-danger rounded-lg max-w-xl mx-auto">Error: {error}</div>;
    }

    if (!currentWord) {
        return null;
    }


    // ส่วน UI แสดงผลลัพธ์ (Challenge Completed)
    if (aiFeedback) {
        return (
            <div className="container mx-auto p-4 max-w-3xl">
                <div className="bg-white p-8 rounded-2xl shadow-xl mb-6 border border-gray-100 min-h-[400px] flex flex-col justify-center items-center">
                    <h2 className="text-4xl font-extrabold text-success mb-6">Challenge Completed</h2>
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold mb-6 ${getDifficultyColor(aiFeedback.level)} shadow-md`}>
                        {currentWord.word} (Score: {aiFeedback.score.toFixed(1)})
                    </span>
                    
                    <div className="w-full text-left space-y-4">
                        <p className="font-semibold text-lg text-gray-800">Your sentence:</p>
                        <p className="p-3 bg-gray-50 border border-gray-200 rounded-lg italic">
                           "{sentence.trim()}"
                        </p>
                        
                        <p className="font-semibold text-lg text-gray-800 mt-4">Suggestion:</p>
                        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800">
                            {aiFeedback.suggestion}
                        </div>
                        
                        <p className="font-semibold text-lg text-gray-800 mt-4">Corrected Sentence:</p>
                        <p className="p-3 bg-green-100 border border-green-300 rounded-lg text-green-800">
                            {aiFeedback.corrected_sentence}
                        </p>
                    </div>

                    <div className="flex justify-center space-x-4 mt-8">
                        <button
                            onClick={handleNextWord}
                            className="px-6 py-3 bg-info text-white rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out font-medium shadow-md"
                        >
                            View next word
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    // ส่วน UI สำหรับพิมพ์ประโยค (ปกติ)
    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-gray-800 leading-tight">Word Challenge</h1>

            <div className="bg-white p-8 rounded-2xl shadow-xl mb-6 border border-gray-100 transform hover:scale-105 transition-transform duration-300 ease-in-out">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2 sm:mb-0">{currentWord.word}</h2>
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(currentWord.difficulty_level)} shadow-md`}>
                        {currentWord.definition}
                    </span>
                </div>
                <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">{currentWord.definition}</p>

                <div className="mb-6">
                    <label htmlFor="sentence" className="block text-base font-medium text-gray-700 mb-2">Your Sentence:</label>
                    <textarea
                        id="sentence"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-200 ease-in-out resize-y text-lg"
                        rows={4}
                        placeholder="Type your sentence here..."
                        value={sentence}
                        onChange={handleSentenceChange}
                        disabled={isLoading}
                    ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row justify-end items-center mb-6 space-y-4 sm:space-y-0">
                    <button
                        onClick={handleSubmitSentence}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition duration-200 ease-in-out font-medium shadow-md disabled:opacity-50"
                        disabled={!sentence.trim() || isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Sentence'}
                    </button>
                </div>
            </div>
        </div>
    );
}