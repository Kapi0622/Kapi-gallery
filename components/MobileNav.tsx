"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, PawPrint, Home, Info, Settings, SunMoon, LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ModeToggle } from "./ModeToggle"
import { cn } from "@/lib/utils"

export default function MobileNav() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {/* トリガーボタン（ハンバーガーアイコン） */}
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-orange-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <Menu className="h-6 w-6 text-slate-700 dark:text-slate-200" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>

            {/* メニューの中身デザイン */}
            <SheetContent
                side="right"
                // 全体のスタイル: フォント、背景色、ボーダー、うっすらドットパターン
                className="w-[300px] sm:w-[400px] font-rounded border-l-[6px] border-orange-300 bg-[#fdfcf8] dark:bg-slate-950 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:20px_20px] dark:bg-[radial-gradient(#1f2937_1.5px,transparent_1.5px)] flex flex-col p-0 overflow-hidden"
            >

                {/* ヘッダーエリア */}
                <SheetHeader className="p-6 pb-2 text-left bg-gradient-to-b from-orange-50/80 to-transparent dark:from-slate-900/80">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-orange-100 dark:bg-orange-900/50 p-3 rounded-2xl text-orange-500 shadow-sm transform -rotate-6">
                            <PawPrint size={26} className="animate-pulse" />
                        </div>
                        <div>
                            <SheetTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Kapi Gallery
                            </SheetTitle>
                            <p className="text-xs text-orange-600/80 dark:text-orange-400 font-bold mt-1">
                                癒やしの猫フォトアーカイブ 🐾
                            </p>
                        </div>
                    </div>
                </SheetHeader>

                {/* メインナビゲーションリンク */}
                <div className="flex-1 px-4 py-6 flex flex-col gap-3 overflow-y-auto">
                    <NavItem href="/" icon={Home} onClick={() => setOpen(false)}>
                        ホーム
                    </NavItem>
                    <NavItem href="/about" icon={Info} onClick={() => setOpen(false)}>
                        カピについて
                    </NavItem>
                    <NavItem href="/admin" icon={Settings} onClick={() => setOpen(false)} isLast>
                        管理者メニュー
                    </NavItem>
                </div>

                {/* フッターエリア（テーマ切り替え） */}
                <div className="mt-auto p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800">
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 flex items-center justify-between shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                        <span className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                            <div className="p-2 bg-white dark:bg-slate-700 rounded-full text-slate-400 dark:text-slate-200 shadow-sm">
                                <SunMoon className="w-4 h-4" />
                            </div>
                            デザイン切り替え
                        </span>
                        <ModeToggle />
                    </div>
                    <p className="text-center text-[10px] text-slate-400 mt-4 font-medium">
                        © 2025 Kapi Gallery.
                    </p>
                </div>

            </SheetContent>
        </Sheet>
    )
}

// リンクの見た目を統一するためのサブコンポーネント
type NavItemProps = {
    href: string
    icon: LucideIcon
    children: React.ReactNode
    onClick: () => void
    isLast?: boolean
}

function NavItem({ href, icon: Icon, children, onClick, isLast }: NavItemProps) {
    return (
        <Link href={href} onClick={onClick}>
            <Button
                variant="ghost"
                className={cn(
                    "w-full justify-start gap-4 text-lg h-auto py-4 font-bold text-slate-700 dark:text-slate-200 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-2xl transition-all duration-300 group relative overflow-hidden border-2 border-transparent hover:border-orange-200 dark:hover:border-orange-900/50 shadow-sm hover:shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm",
                    isLast && "mt-4 bg-slate-100/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600" // 管理者メニューだけ少し色を変える
                )}
            >
                {/* アイコンの装飾 */}
                <div className="bg-orange-100 dark:bg-slate-800 p-2.5 rounded-xl text-orange-500/80 dark:text-slate-400 group-hover:text-orange-500 group-hover:scale-110 transition-all shadow-sm group-hover:rotate-6 bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900">
                    <Icon size={22} />
                </div>
                {/* テキスト */}
                <span>{children}</span>

                {/* ホバー時のキラッと光るエフェクト */}
                <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-orange-100/10 dark:group-hover:bg-orange-500/5"></div>
            </Button>
        </Link>
    )
}