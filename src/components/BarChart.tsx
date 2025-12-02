// src/components/BarChart.tsx
"use client";

import { Bar } from 'react-chartjs-2';
// ต้องติดตั้ง Chart.js dependencies: npm install chart.js react-chartjs-2
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { SummaryResponse } from '@/types'; // นำเข้า Type

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

type Props = {
    distribution: SummaryResponse['level_distribution'];
};

export default function BarChart({ distribution }: Props) {
    const data = {
        labels: ['Beginner', 'Intermediate', 'Advanced'],
        datasets: [
            {
                label: 'Practice Count',
                data: [
                    distribution.Beginner,
                    distribution.Intermediate,
                    distribution.Advanced,
                ],
                backgroundColor: [
                    '#10B981', // Green (Success)
                    '#F59E0B', // Yellow (Warning)
                    '#EF4444', // Red (Danger)
                ],
                borderColor: [
                    '#059669',
                    '#D97706',
                    '#DC2626',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                ticks: {
                    stepSize: 1, // บังคับให้แสดงเป็นเลขจำนวนเต็ม
                }
            },
        },
    };

    return (
        <div className="h-64">
            <Bar data={data} options={options} />
        </div>
    );
}
// อย่าลืมติดตั้ง Chart.js ใน Next.js project ด้วย: npm install chart.js react-chartjs-2