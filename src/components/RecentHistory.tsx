// src/components/RecentHistory.tsx
"use client";

import { useEffect, useState } from 'react';
import { HistoryItem } from '@/types'; 

const API_BASE_URL = 'http://localhost:8000/api';

export default function RecentHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/history?limit=5`);
                if (!response.ok) throw new Error('Failed to fetch history');
                
                const data: HistoryItem[] = await response.json();
                setHistory(data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (isLoading) {
        return <p className="text-center text-gray-500 py-8">Loading history...</p>;
    }

    return (
        <div className="space-y-4">
            {history.length > 0 ? (
                history.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
                        <div className="flex justify-between items-center mb-1">
                            <p className="font-semibold text-lg text-gray-800">{item.word}</p>
                            <p className={`font-bold text-xl ${item.score >= 8 ? 'text-success' : item.score >= 6 ? 'text-warning' : 'text-danger'}`}>
                                {item.score.toFixed(1)}
                            </p>
                        </div>
                        <p className="text-sm text-gray-600 italic">"{item.user_sentence}"</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(item.practiced_at).toLocaleString()}</p>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 py-8">No recent history. Start practicing!</p>
            )}
        </div>
    );
}