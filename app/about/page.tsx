import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Star, Fish } from "lucide-react"
import BlurImage from "@/components/ui/BlurImage"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#fdfcf8] p-8 flex dark:bg-slate-950 items-center justify-center">
            <Card className="max-w-3xl w-full bg-white dark:bg-slate-900 shadow-xl border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
                <div className="flex flex-col md:flex-row">

                    {/* 左側: プロフィール画像エリア */}
                    <div className="w-full md:w-1/2 relative h-64 md:h-auto bg-orange-50 dark:bg-orange-900/20">
                        <BlurImage
                            src="/kapi-profile.jpg"
                            alt="Kapi Profile"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* 右側: テキスト情報エリア */}
                    <CardContent className="w-full md:w-1/2 p-8 space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-rounded mb-2">
                                Kapi <span className="text-sm text-slate-400 font-normal">(カピ)</span>
                            </h1>
                            <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-100 hover:bg-orange-200">
                                看板猫
                            </Badge>
                        </div>

                        <div className="space-y-4 text-slate-600 dark:text-slate-400 font-rounded">
                            <p>
                                のんびり屋でマイペースな性格。<br />
                                日当たりの良い窓際がお気に入りの場所です。<br />
                                たまに見せる変なポーズで家族を笑わせてくれます。
                            </p>

                            <div className="space-y-2">
                                <h3 className="font-bold text-slate-700 dark:text-slate-100 flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-red-400" /> Loves
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">チュール</span>
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">ダンボール箱</span>
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">お昼寝</span>
                                </div>
                            </div>
                        </div>

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