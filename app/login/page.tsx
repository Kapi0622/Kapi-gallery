"use client" 

import { useState } from "react" 
import { login } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react" // エラーアイコン

export default function LoginPage() {
    // エラーメッセージを管理する状態
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [isPending, setIsPending] = useState(false)

    // フォーム送信時の処理をラップする関数
    const handleSubmit = async (formData: FormData) => {
        setIsPending(true)
        setErrorMessage("")

        // Server Actionを実行
        const result = await login(formData)

        // エラーが返ってきたら表示する
        if (result?.error) {
            setErrorMessage(result.error)
            setIsPending(false)
        }
        // 成功した場合はサーバー側でリダイレクトされるので何もしない
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
            <Card className="w-full max-w-sm dark:bg-slate-900">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Admin Login 🔐</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* ▼ 修正点: action={handleSubmit} に変更 */}
                    <form action={handleSubmit} className="space-y-4">

                        {/* エラーがあれば表示するエリア */}
                        {errorMessage && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md flex items-center gap-2 dark:bg-red-900 dark:text-red-100">
                                <AlertCircle className="w-4 h-4" />
                                {errorMessage}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required placeholder="admin@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>

                        <Button type="submit" className="w-full dark:bg-orange-500 dark:text-orange-100" disabled={isPending}>
                            {isPending ? "ログイン中..." : "ログイン"}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}