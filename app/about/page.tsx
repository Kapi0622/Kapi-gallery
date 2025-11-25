import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Star, Fish, Sparkles, PawPrint } from "lucide-react"
import BlurImage from "@/components/ui/BlurImage"

export default function AboutPage() {
    return (
        // 背景にドット柄を適用
        <div className="min-h-screen pt-28 pb-12 px-4 md:px-8 flex items-center justify-center bg-[#fdfcf8] dark:bg-slate-950 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:20px_20px] dark:bg-[radial-gradient(#1f2937_1.5px,transparent_1.5px)]">

            <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* 左側: 写真エリア (ポラロイド風に傾ける) */}
                <div className="relative group order-2 md:order-1">
                    {/* 背景の装飾 (テープや落書き風) */}
                    <div className="absolute -inset-4 bg-orange-200/50 dark:bg-orange-900/30 rounded-[2rem] rotate-6 scale-95 blur-sm transition-transform group-hover:rotate-3 group-hover:scale-100 duration-500" />

                    <div className="relative bg-white dark:bg-slate-800 p-3 pb-12 rounded-xl shadow-xl transform -rotate-3 transition-transform duration-500 group-hover:rotate-0 border border-slate-100 dark:border-slate-700">
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900">
                            <BlurImage
                                src="/kapi-profile.jpg"
                                alt="Kapi Profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* 写真の下の手書き風キャプション */}
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                            <p className="font-rounded font-bold text-slate-400 dark:text-slate-500 text-sm tracking-widest flex items-center justify-center gap-2">
                                <Sparkles className="w-3 h-3" /> BEST SHOT <Sparkles className="w-3 h-3" />
                            </p>
                        </div>

                        {/* 右上のピン留め風アイコン */}
                        <div className="absolute -top-3 -right-3 bg-orange-400 text-white p-2 rounded-full shadow-lg transform rotate-12">
                            <PawPrint className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* 右側: プロフィールテキストエリア */}
                <Card className="order-1 md:order-2 border-0 shadow-none bg-transparent">
                    <CardContent className="p-0 space-y-6">

                        {/* タイトル */}
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 text-xs font-bold mb-2">
                                <Star className="w-3 h-3 fill-current" />
                                PROFILE
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 font-rounded tracking-tight">
                                Kapi <span className="text-lg text-slate-400 font-normal ml-2">(カピ)</span>
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-300 font-rounded font-medium leading-relaxed">
                                我が家のアイドルです。<br />
                                毎日気ままに過ごしています。
                            </p>
                        </div>

                        {/* 詳細データ (カード風に並べる) */}
                        <div className="grid grid-cols-2 gap-3">
                            <InfoCard label="性格" value="ビビり / マイペース" />
                            <InfoCard label="誕生日" value="2017年6月22日 (8歳)" />
                            <InfoCard label="特技" value="長時間のお昼寝 / 脱走" />
                            <InfoCard label="チャームポイント" value="しっぽの白いリング模様" />
                        </div>

                        {/* 好きなものリスト */}
                        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm p-5 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm">
                            <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 mb-3 font-rounded">
                                <Heart className="w-4 h-4 text-red-400 fill-red-400" /> Loves
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {["チュール", "ダンボール箱", "ひなたぼっこ", "お外の散歩", "脱走"].map((item) => (
                                    <Badge
                                        key={item}
                                        variant="secondary"
                                        className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 py-1.5 hover:scale-105 transition-transform cursor-default"
                                    >
                                        {item}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end text-slate-300 dark:text-slate-700">
                            <Fish className="w-8 h-8 rotate-12" />
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// 小さな情報カードコンポーネント
function InfoCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200 font-rounded">{value}</div>
        </div>
    )
}