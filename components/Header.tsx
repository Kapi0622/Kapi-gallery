"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { PawPrint } from "lucide-react"
import { ModeToggle } from "./ModeToggle"
import MobileNav from "./MobileNav"

export default function Header() {
    return (
        // 上部にマージン(py-4)を取り、その中にヘッダーを浮かせる
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4 pointer-events-none">
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                // カプセル型のデザイン (rounded-full)
                className="pointer-events-auto w-full max-w-5xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/40 dark:border-slate-700/50 shadow-lg shadow-orange-100/50 dark:shadow-slate-900/50 rounded-full px-4 py-2 flex items-center justify-between"
            >

                {/* ロゴエリア */}
                <Link href="/" className="flex items-center gap-2 group pl-2">
                    <div className="bg-orange-500 text-white p-1.5 rounded-full transition-transform group-hover:rotate-12 shadow-sm">
                        <PawPrint size={18} fill="currentColor" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-700 dark:text-slate-200 font-rounded">
                        カピのあしあと
                    </span>
                </Link>

                {/* PC用メニュー */}
                <nav className="hidden md:flex items-center gap-1 pr-1">
                    <NavLink href="/">ホーム</NavLink>
                    <NavLink href="/about">カピについて</NavLink>
                    <NavLink href="/admin">管理</NavLink>

                    <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-2" /> {/* 区切り線 */}

                    <ModeToggle />
                </nav>

                {/* スマホ用メニュー */}
                <div className="md:hidden pr-1">
                    <MobileNav />
                </div>

            </motion.header>
        </div>
    )
}

// ナビゲーションリンクのサブコンポーネント
function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="px-4 py-1.5 rounded-full text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
        >
            {children}
        </Link>
    )
}