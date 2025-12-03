import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <nav className="container mx-auto px-6 h-16 flex justify-between items-center">
                <Link href="/" className="text-xl font-black text-indigo-600 flex items-center gap-2">
                    <span>Worddee.ai</span>
                </Link>
                <ul className="flex space-x-8">
                    <li>
                        <Link href="/" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                            Challenge
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                            Dashboard
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}