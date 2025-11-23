import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#fdfcf8]">
            {/* ヘッダー分の余白 */}
            <div className="h-16" />

            <div className="container mx-auto px-4 py-12 space-y-8">
                {/* タイトル部分のスケルトン */}
                <div className="space-y-4 flex flex-col items-center">
                    <Skeleton className="h-12 w-3/4 md:w-1/2 rounded-full" />
                    <Skeleton className="h-4 w-64 rounded-full" />
                </div>

                {/* ギャラリー部分のスケルトン (Masonry風にランダムな高さで配置) */}
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="break-inside-avoid">
                            <Skeleton
                                className="w-full rounded-xl bg-slate-200"
                                // 高さをランダム風に変えてMasonryっぽく見せる
                                style={{ height: `${Math.floor(Math.random() * 200) + 150}px` }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}