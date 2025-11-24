"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { PawPrint } from "lucide-react"
import { ModeToggle } from "./ModeToggle"
import MobileNav from "./MobileNav"

export default function Header() {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            // ▼ 背景色をダークモード対応に変更 (dark:bg-slate-900/60)
            className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-6 py-4 shadow-sm"
        >
            <div className="mx-auto max-w-6xl flex items-center justify-between">

                {/* ロゴエリア */}
                <Link href="/" className="flex items-center gap-2 group">
                    {/* ...ロゴの中身... */}
                    <span className="text-xl font-bold tracking-tight text-slate-700 dark:text-slate-200 font-rounded">
                        カピのあしあと🐾
                    </span>
                </Link>

                {/* 右側メニュー */}
                {/* PC用メニュー (スマホでは非表示: hidden md:flex) */}
                <nav className="hidden md:flex items-center gap-4 text-lg font-medium text-slate-600 dark:text-slate-300">
                    <Link href="/" className="hover:text-orange-500 transition-colors">
                        ホーム
                    </Link>
                    <Link href="/about" className="hover:text-orange-500 transition-colors">
                        カピについて
                    </Link>
                    <Link href="/admin" className="hover:text-orange-500 transition-colors">
                        管理者
                    </Link>
                    <ModeToggle />
                </nav>

                {/* スマホ用メニュー (PCでは非表示: md:hidden) */}
                <div className="md:hidden">
                    <MobileNav />
                </div>
            </div>
        </motion.header>
    )
}