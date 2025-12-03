type Props = {
    title: string;
    value: string;
    icon?: string;
}

export default function StatsCard({ title, value, icon }: Props) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl">
                {icon || '📊'}
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                <p className="text-3xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    )
}