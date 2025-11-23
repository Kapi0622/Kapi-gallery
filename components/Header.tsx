"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { PawPrint } from "lucide-react"

export default function Header() {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            // スティッキー配置 + すりガラス効果 (backdrop-blur)
            className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-md px-6 py-4 shadow-sm"
        >
            <div className="mx-auto max-w-6xl flex items-center justify-between">

                {/* ロゴエリア */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-orange-100 p-2 rounded-full text-orange-500 transition-transform group-hover:rotate-12">
                        <PawPrint size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-700 font-rounded">
                        Kapi Gallery
                    </span>
                </Link>

                {/* 右側メニュー */}
                <nav className="flex items-center gap-4 text-lg font-medium text-slate-600">
                    <Link href="/" className="hover:text-orange-500 transition-colors">
                        Home
                    </Link>
                    <Link href="/about" className="hover:text-orange-500 transition-colors hidden sm:block">
                        About
                    </Link>
                    <Link href="/admin" className="hover:text-orange-500 transition-colors">
                        Admin
                    </Link>
                </nav>
            </div>
        </motion.header>
    )
}