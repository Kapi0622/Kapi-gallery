import Link from "next/link"
import { PawPrint } from "lucide-react"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-white border-t border-slate-100 py-12 mt-12">
            <div className="container mx-auto px-4 flex flex-col items-center space-y-6">

                {/* アイコンとタイトル */}
                <div className="flex items-center gap-2 text-slate-700 opacity-80 hover:opacity-100 transition-opacity">
                    <PawPrint className="w-5 h-5 text-orange-400" />
                    <span className="font-bold font-rounded text-2xl tracking-tight">Kapi Gallery</span>
                </div>

                {/* ナビゲーションリンク */}
                <nav className="flex gap-6 text-sm text-slate-500 font-medium">
                    <Link href="/" className="hover:text-orange-500 transition-colors">
                        Home
                    </Link>
                    <Link href="/about" className="hover:text-orange-500 transition-colors">
                        About
                    </Link>
                    {/* 管理者ログインページへのリンク（少し目立たなくする） */}
                    <Link href="/login" className="hover:text-orange-500 transition-colors">
                        Admin
                    </Link>
                </nav>

                {/* コピーライト */}
                <div className="text-xs text-slate-400 font-rounded">
                    &copy; {currentYear} Kapi Gallery. All rights reserved.
                </div>
            </div>
        </footer>
    )
}