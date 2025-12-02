// src/app/dashboard/page.tsx
"use client";

import BarChart from "@/components/BarChart";
import RecentHistory from "@/components/RecentHistory";
import StatsCard from "@/components/StatsCard";
import { useState, useEffect } from 'react';
import { SummaryResponse } from "@/types"; // นำเข้า Type

const API_BASE_URL = 'http://localhost:8000/api';

export default function Dashboard() {
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/summary`);
        if (!response.ok) throw new Error('Failed to fetch summary');
        
        const data: SummaryResponse = await response.json();
        setSummaryData(data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-xl text-gray-600">Loading Dashboard...</div>;
  }
  
  const totalPractices = summaryData?.total_practices ?? 0;
  const averageScore = summaryData?.average_score ?? 0.0;
  const wordsPracticed = summaryData?.total_words_practiced ?? 0;
  const distribution = summaryData?.level_distribution ?? { Beginner: 0, Intermediate: 0, Advanced: 0 };


  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Practices" value={totalPractices.toString()} />
        <StatsCard title="Average Score" value={averageScore.toFixed(1)} />
        <StatsCard title="Words Practiced" value={wordsPracticed.toString()} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Practice Distribution</h2>
          <BarChart distribution={distribution} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recent History (Last 5)</h2>
          <RecentHistory />
        </div>
      </div>
    </div>
  );
}