import type { Metadata } from "next";
// 1. フォントをインポート
import { M_PLUS_Rounded_1c } from "next/font/google"; 
import Header from "@/components/Header";
import "./globals.css";

// 2. フォントの設定 (太さなどを指定)
const mPlus = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400", "700"], // 通常と太字
  variable: "--font-m-plus", // Tailwindで使うための変数名
});

export const metadata: Metadata = {
  title: "Kapi Gallery 🐾",
  description: "A photo gallery of my lovely cat Kapi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* 3. bodyにフォント変数を適用し、背景色を少し温かみのある色に変更 */}
      <body className={`${mPlus.variable} antialiased font-rounded bg-[#fdfcf8] text-slate-700`}>
        <Header />
        {children}
      </body>
    </html>
  );
}