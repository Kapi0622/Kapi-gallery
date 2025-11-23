import { createClient } from "@/utils/supabase/server"
import PhotoGallery from "@/components/PhotoGallery"

// データの再取得頻度 (0 = 毎回取得 / 60 = 60秒キャッシュ)
// 開発中は0にしておくとアップロードがすぐ反映されます
export const revalidate = 0;

export default async function Home() {
  // 1. データベースから写真一覧を取得
  const supabase = await createClient()
  const { data: photos, error } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false }) // 新しい順

  if (error) {
    console.error("Error fetching photos:", error)
    return <div>Error loading photos...</div>
  }

  // 2. 画像の表示用URLを生成してデータに追加
  const photosWithUrl = photos?.map((photo) => {
    const { data } = supabase.storage
      .from('kapi-photos')
      .getPublicUrl(photo.storage_path)
    
    return {
      ...photo,
      publicUrl: data.publicUrl
    }
  }) || []

  return (
    <main className="min-h-screen bg-[#fdfcf8]"> {/* 背景色を統一 */}
      
      {/* ヒーローエリア的な部分 */}
      <section className="pt-20 pb-10 text-center space-y-4 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight font-rounded">
          Kapi Gallery <span className="text-orange-400 inline-block animate-bounce">.</span>
        </h1>
        <p className="text-slate-500 text-sm md:text-base font-rounded max-w-md mx-auto leading-relaxed">
          のんびり屋の猫「カピ」の日常を切り取ったフォトアーカイブ。<br/>
          気まぐれに更新しています🐾
        </p>
      </section>

      {/* ギャラリー本体 */}
      <PhotoGallery photos={photosWithUrl} />
      
    </main>
  )
}