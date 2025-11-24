import { createClient } from "@/utils/supabase/server"
import PhotoGallery from "@/components/PhotoGallery"
import { Sparkles, PawPrint } from "lucide-react" // アイコン追加

// キャッシュを無効化して常に最新データを取得
export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient()

  // 1. データベースから写真一覧を取得
  const { data: photos, error } = await supabase
    .from('photos')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false }) // サブのソート条件
    .limit(12)

  if (error) {
    console.error("Supabase Error:", error)
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-500 font-rounded">
        <p>データの読み込みに失敗しました😿</p>
      </div>
    )
  }

  // 2. 画像/動画の表示用URLを生成
  const photosWithUrl = photos?.map((photo: any) => {
    const { data } = supabase.storage
      .from('kapi-photos')
      .getPublicUrl(photo.storage_path)

    return {
      ...photo,
      media_type: photo.media_type || 'image',
      likes_count: photo.likes_count || 0,
      tags: photo.tags || [],
      publicUrl: data.publicUrl
    }
  }) || []

  return (
    // ▼ 背景にドット柄を適用
    <main className="min-h-screen bg-[#fdfcf8] dark:bg-slate-950 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:20px_20px] dark:bg-[radial-gradient(#1f2937_1.5px,transparent_1.5px)] transition-colors duration-300 pb-20">

      {/* ▼ ヒーローエリアをリデザイン */}
      <section className="pt-12 pb-6 px-4">
        <div className="max-w-3xl mx-auto text-center relative">

          {/* 装飾アイコン */}
          <div className="absolute -top-4 -left-4 text-orange-200 dark:text-orange-900/30 animate-pulse hidden md:block">
            <Sparkles size={40} />
          </div>
          <div className="absolute top-0 -right-2 text-orange-300 dark:text-orange-800/40 rotate-12 hidden md:block">
            <PawPrint size={30} />
          </div>

          {/* タイトルカード */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/60 dark:border-slate-800/60 shadow-sm inline-block relative">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-slate-100 tracking-tight font-rounded mb-3">
              Kapi Gallery <span className="text-orange-400 inline-block animate-bounce">.</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base font-rounded max-w-md mx-auto leading-relaxed font-medium">
              のんびり屋の猫「カピ」の日常アーカイブ。<br />
              気まぐれに更新しています🐾
            </p>
          </div>
        </div>
      </section>

      {/* ギャラリー本体 */}
      <PhotoGallery photos={photosWithUrl} />

    </main>
  )
}