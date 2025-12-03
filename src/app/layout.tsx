import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Worddee.ai', // เปลี่ยน Title ตรงนี้ด้วยเลย
  description: 'Improve your vocabulary daily',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* ลบ class bg-gray-100 ออก เหลือแค่ inter.className */}
      <body className={inter.className}>
        <Header />
        <div className="pt-0"> 
          {children}
        </div>
      </body>
    </html>
  );
}