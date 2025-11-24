"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, PawPrint } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ModeToggle } from "./ModeToggle"

export default function MobileNav() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {/* ハンバーガーアイコン (トリガー) */}
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>

            {/* 開いたときの中身 */}
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white dark:bg-slate-950">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 font-rounded text-slate-700 dark:text-slate-200">
                        <PawPrint className="w-5 h-5 text-orange-400" />
                        Kapi Gallery
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6 mt-8 font-medium text-slate-600 dark:text-slate-300">
                    <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="hover:text-orange-500 transition-colors text-lg"
                    >
                        ホーム
                    </Link>
                    <Link
                        href="/about"
                        onClick={() => setOpen(false)}
                        className="hover:text-orange-500 transition-colors text-lg"
                    >
                        カピについて
                    </Link>
                    <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="hover:text-orange-500 transition-colors text-lg"
                    >
                        管理者
                    </Link>

                    {/* モバイルメニューの中にダークモード切り替えを入れる */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-sm">テーマ切り替え:</span>
                        <ModeToggle />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}