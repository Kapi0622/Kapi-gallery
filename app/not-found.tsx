import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#fdfcf8] flex flex-col items-center justify-center text-center p-4 space-y-6">

            {/* 数字の404を可愛く表現 */}
            <h1 className="text-9xl font-bold text-slate-200 font-rounded select-none">
                404
            </h1>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-700 font-rounded">
                    ページが見つかりません😿
                </h2>
                <p className="text-slate-500 font-rounded">
                    カピがどこかに隠してしまったか、<br />
                    URLが間違っている可能性があります。
                </p>
            </div>

            <Link href="/">
                <Button className="gap-2 rounded-full px-8">
                    <Home className="w-4 h-4" />
                    トップに戻る
                </Button>
            </Link>
        </div>
    )
}