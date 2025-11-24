import Link from "next/link"
import { PawPrint } from "lucide-react"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-12 mt-12 transition-colors duration-300">
            <div className="container mx-auto px-4 flex flex-col items-center space-y-6">

                {/* アイコンとタイトル */}
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-100 opacity-80 hover:opacity-100 transition-opacity">
                    <PawPrint className="w-5 h-5 text-orange-400" />
                    <span className="font-bold font-rounded text-2xl tracking-tight">Kapi Gallery</span>
                </div>

                {/* ナビゲーションリンク */}
                <nav className="flex gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    <Link href="/" className="hover:text-orange-500 transition-colors">
                        ホーム
                    </Link>
                    <Link href="/about" className="hover:text-orange-500 transition-colors">
                        カピについて
                    </Link>
                    {/* 管理者ログインページへのリンク（少し目立たなくする） */}
                    <Link href="/login" className="hover:text-orange-500 transition-colors">
                        管理者
                    </Link>
                </nav>

                {/* コピーライト */}
                <div className="text-xs text-slate-400 dark:text-slate-600 font-rounded">
                    &copy; {currentYear} Kapi Gallery. All rights reserved.
                </div>
            </div>
        </footer>
    )
}