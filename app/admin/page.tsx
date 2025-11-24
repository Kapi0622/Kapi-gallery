import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import PhotoList from "./PhotoList"
import LogoutButton from "@/components/LogoutButton"

// データのキャッシュはしない（管理画面なので常に最新を見たい）
export const revalidate = 0

export default async function AdminDashboard() {
    const supabase = await createClient()

    // 写真一覧を取得
    const { data: photos } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false })

    // URLを付与
    const photosWithUrl = photos?.map((photo) => {
        const { data } = supabase.storage
            .from('kapi-photos')
            .getPublicUrl(photo.storage_path)
        return { ...photo, publicUrl: data.publicUrl }
    }) || []

    return (
        <div className="min-h-screen bg-slate-50 p-8 dark:bg-slate-950">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* ヘッダー部分 */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">管理者画面 🛠️</h1>

                    <div className="flex gap-2">
                        {/* ログアウトボタンを追加 */}
                        <LogoutButton />

                        <Link href="/admin/upload">
                            <Button className="gap-2">
                                <PlusCircle className="w-4 h-4" />
                                写真を追加
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* 写真リストコンポーネント */}
                <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                    <h2 className="text-sm font-bold text-slate-500 mb-4 dark:text-slate-100">投稿済み写真 ({photosWithUrl.length})</h2>
                    <PhotoList photos={photosWithUrl} />
                </div>

            </div>
        </div>
    )
}