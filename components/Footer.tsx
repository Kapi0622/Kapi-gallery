"use client"

import Link from "next/link"
import { PawPrint, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    // トップに戻る関数
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <footer className="relative mt-20">

            {/* 曲線的な切り取りデザイン (SVG) */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 -translate-y-[1px]">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[40px] text-white dark:text-slate-900/50 fill-current">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>

            {/* フッター本体 */}
            <div className="bg-white dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 py-12 px-4 relative">
                <div className="container mx-auto max-w-4xl flex flex-col items-center space-y-8">

                    {/* アイコンとメッセージ */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-2xl text-orange-500 transform rotate-6 hover:rotate-12 transition-transform duration-300">
                            <PawPrint className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200 font-rounded">
                            カピのあしあと
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-rounded max-w-xs text-center">
                            カピちゃんとの日々を記録した、<br />小さな宝箱のような場所です。
                        </p>
                    </div>

                    {/* リンク集 */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-slate-500 dark:text-slate-400">
                        <Link href="/" className="hover:text-orange-500 transition-colors">ホーム</Link>
                        <Link href="/about" className="hover:text-orange-500 transition-colors">カピについて</Link>
                        <Link href="/admin" className="hover:text-orange-500 transition-colors">管理</Link>
                    </div>

                    {/* 区切り線 */}
                    <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded-full" />

                    {/* コピーライト & Topボタン */}
                    <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 text-xs text-slate-400 font-rounded">
                        <p>&copy; {currentYear} カピのあしあと. All rights reserved.</p>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={scrollToTop}
                            className="rounded-full gap-2 border-slate-200 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-500 group"
                        >
                            Back to Top
                            <ArrowUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                    </div>

                </div>
            </div>
        </footer>
    )
}