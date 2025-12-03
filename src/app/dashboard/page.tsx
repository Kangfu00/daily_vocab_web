"use client";

import BarChart from "@/components/BarChart";
import RecentHistory from "@/components/RecentHistory";
import StatsCard from "@/components/StatsCard";
import { useState, useEffect } from 'react';
import { SummaryResponse } from "@/types";

const API_BASE_URL = 'http://localhost:8000/api';

export default function Dashboard() {
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/summary`);
        if (!response.ok) throw new Error('Failed to fetch summary');
        const data = await response.json();
        setSummaryData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (isLoading) return <div className="min-h-screen flex justify-center items-center text-slate-500">Loading Dashboard...</div>;

  const total = summaryData?.total_practices ?? 0;
  const avg = summaryData?.average_score ?? 0.0;
  const words = summaryData?.total_words_practiced ?? 0;
  const dist = summaryData?.level_distribution ?? { Beginner: 0, Intermediate: 0, Advanced: 0 };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Learner Dashboard</h1>
          <p className="text-slate-500">Track your progress and vocabulary mastery.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Practices" value={total.toString()} icon="📝" />
        <StatsCard title="Average Score" value={avg.toFixed(1)} icon="⭐" />
        <StatsCard title="Words Learned" value={words.toString()} icon="📚" />
      </div>

      {/* Charts & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Proficiency Level</h2>
          <BarChart distribution={dist} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Activity</h2>
          <RecentHistory />
        </div>
      </div>
    </div>
  );
}