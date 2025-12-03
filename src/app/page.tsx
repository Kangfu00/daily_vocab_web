"use client";

import { useState, useEffect, useCallback } from 'react';
import { Word, AIResponse, Difficulty } from '@/types';

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
            setCurrentWord(data);
            setSentence('');
            setAiFeedback(null);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getWord();
    }, [getWord]);

    const handleSubmitSentence = async () => {
        if (!currentWord || !sentence.trim() || isLoading) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/validate-sentence`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    word_id: currentWord.id,
                    sentence: sentence.trim(),
                }),
            });
            if (!response.ok) throw new Error('Validation failed.');
            const feedbackData: AIResponse = await response.json();
            setAiFeedback(feedbackData);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !currentWord) return <div className="min-h-screen flex items-center justify-center bg-indigo-900 text-white text-xl">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-indigo-900 text-red-400 font-bold">Error: {error}</div>;
    if (!currentWord) return null;

    return (
        // พื้นหลังสี Indigo เข้ม (เปลี่ยนจากเดิมแน่นอน)
        <div className="min-h-screen bg-indigo-900 flex items-center justify-center p-4">
            
            {/* การ์ดหลัก */}
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01]">
                
                {/* ส่วนหัวสีสันสดใส */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-center text-white">
                    <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Word of the Day</p>
                    <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md">{currentWord.word}</h1>
                    <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-sm font-bold backdrop-blur-sm border border-white/30">
                        {currentWord.difficulty_level}
                    </span>
                </div>

                <div className="p-8">
                    {/* กล่องความหมาย */}
                    <div className="bg-slate-100 p-6 rounded-2xl border-l-8 border-indigo-500 mb-8">
                        <p className="text-slate-500 text-xs font-bold uppercase mb-2">Definition</p>
                        <p className="text-xl text-slate-800 font-medium italic">"{currentWord.definition}"</p>
                    </div>

                    {!aiFeedback ? (
                        /* Input Form */
                        <div className="space-y-6">
                            <div>
                                <label className="block text-slate-700 font-bold mb-2 ml-1">Your Sentence:</label>
                                <textarea
                                    className="w-full p-4 rounded-xl border-2 border-slate-200 bg-slate-50 text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                                    rows={3}
                                    placeholder="Make a sentence..."
                                    value={sentence}
                                    onChange={(e) => setSentence(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <button
                                onClick={handleSubmitSentence}
                                disabled={!sentence.trim() || isLoading}
                                className="w-full py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? 'Checking...' : 'Check Answer 🚀'}
                            </button>
                        </div>
                    ) : (
                        /* Results */
                        <div className="space-y-6 animate-pulse-once">
                            <div className="text-center">
                                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-black border-4 mb-2 ${aiFeedback.score >= 7 ? 'border-green-500 text-green-600 bg-green-50' : 'border-yellow-500 text-yellow-600 bg-yellow-50'}`}>
                                    {aiFeedback.score}
                                </div>
                                <p className="text-slate-400 text-sm font-bold uppercase">Score</p>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                                <p className="text-yellow-700 font-bold text-sm mb-1">💡 Suggestion</p>
                                <p className="text-yellow-900">{aiFeedback.suggestion}</p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                                <p className="text-green-700 font-bold text-sm mb-1">✅ Better Sentence</p>
                                <p className="text-green-900">{aiFeedback.corrected_sentence}</p>
                            </div>

                            <button
                                onClick={getWord}
                                className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-black transition-all"
                            >
                                Next Word ➡️
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}