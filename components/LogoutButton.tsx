"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/login/actions"

export default function LogoutButton() {
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            className="gap-2 text-slate-600 hover:text-red-600 hover:bg-red-50 border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
        >
            <LogOut className="w-4 h-4" />
            ログアウト
        </Button>
    )
}