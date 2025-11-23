import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Star, Fish } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#fdfcf8] p-8 flex items-center justify-center">
            <Card className="max-w-2xl w-full bg-white shadow-xl border-slate-100 overflow-hidden">
                <div className="flex flex-col md:flex-row">

                    {/* 左側: プロフィール画像エリア */}
                    <div className="w-full md:w-1/2 relative h-64 md:h-auto bg-orange-50">
                        {/* ※ここにはお気に入りのカピちゃんの写真のパスを入れてください 
               （publicフォルダに画像を置くか、SupabaseのURLを使ってください） 
               とりあえずプレースホルダーを表示しておきます */}
                        <div className="absolute inset-0 flex items-center justify-center text-orange-200">
                            <span className="text-6xl">😺</span>
                        </div>
                        {/* 本番用コード例: 
            <Image 
              src="https://your-supabase-url.../kapi-profile.jpg" 
              alt="Kapi Profile" 
              fill 
              className="object-cover" 
            /> 
            */}
                    </div>

                    {/* 右側: テキスト情報エリア */}
                    <CardContent className="w-full md:w-1/2 p-8 space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 font-rounded mb-2">
                                Kapi <span className="text-sm text-slate-400 font-normal">(カピ)</span>
                            </h1>
                            <Badge variant="secondary" className="bg-orange-100 text-orange-600 hover:bg-orange-200">
                                看板猫
                            </Badge>
                        </div>

                        <div className="space-y-4 text-slate-600 font-rounded">
                            <p>
                                のんびり屋でマイペースな性格。<br />
                                日当たりの良い窓際がお気に入りの場所です。
                                たまに見せる変なポーズで家族を笑わせてくれます。
                            </p>

                            {/* 好きなものリスト */}
                            <div className="space-y-2">
                                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-red-400" /> Loves
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-slate-100 rounded text-xs">チュール</span>
                                    <span className="px-2 py-1 bg-slate-100 rounded text-xs">ダンボール箱</span>
                                    <span className="px-2 py-1 bg-slate-100 rounded text-xs">お昼寝</span>
                                </div>
                            </div>
                        </div>

                        {/* 装飾 */}
                        <div className="pt-4 flex gap-4 text-slate-300 justify-end">
                            <Fish className="w-6 h-6" />
                            <Star className="w-6 h-6" />
                        </div>

                    </CardContent>
                </div>
            </Card>
        </div>
    )
}