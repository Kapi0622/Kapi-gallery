"use client"

import { useState, useMemo, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { fetchMorePhotos } from "@/app/actions"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, MapPin, Filter, Tag, PlayCircle, X, Grid } from "lucide-react" // Gridアイコン追加
import { Loader2 } from "lucide-react"


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogTrigger, // 追加
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate, cn } from "@/lib/utils"
import BlurImage from "@/components/ui/BlurImage"
import LikeButton from "./LikeButton"

type Photo = {
    id: string
    storage_path: string
    width: number
    height: number
    location_note: string | null
    title: string | null
    tags: string[] | null
    created_at: string
    taken_at: string
    publicUrl: string
    likes_count: number
    media_type: "image" | "video"
}

// ★設定: 最初に見せるタグの数
const VISIBLE_TAGS_LIMIT = 9

export default function PhotoGallery({ photos: initialPhotos }: { photos: Photo[] }) {
    // 表示する写真リスト（初期データで初期化）
    const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
    const [page, setPage] = useState(1) // 現在何ページ目まで読んだか
    const [hasMore, setHasMore] = useState(true) // まだ続きがあるか
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    // 画面下端を検知するフック
    const { ref, inView } = useInView({
        rootMargin: "200px", // 底に着く200px手前で検知
    })

    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
    const [activeTag, setActiveTag] = useState<string>("All")
    const [isTagModalOpen, setIsTagModalOpen] = useState(false)

    const loadMore = async () => {
        setIsLoadingMore(true)
        const nextPage = page + 1

        // Server Actionを呼ぶ
        const newPhotos = await fetchMorePhotos(nextPage)

        if (newPhotos.length === 0) {
            setHasMore(false) // もうデータがない
        } else {
            // 既存リストの後ろにくっつける
            // (重複を防ぐためにIDでチェックしても良いが、今回は簡易的に結合)
            setPhotos((prev) => [...prev, ...newPhotos])
            setPage(nextPage)
        }
        setIsLoadingMore(false)
    }

    // ▼▼▼ 追加: スクロール検知で次のデータを読み込む ▼▼▼
    useEffect(() => {
        // 条件: 底が見えた AND まだ続きがある AND 読み込み中でない AND フィルタリングしていない(All)
        if (inView && hasMore && !isLoadingMore && activeTag === "All") {
            loadMore()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView, hasMore, isLoadingMore, activeTag])

    // タグ生成ロジック
    const allTags = useMemo(() => {
        const tags = new Set<string>(["All"])
        photos.forEach(photo => {
            photo.tags?.forEach(tag => tags.add(tag))
        })
        return Array.from(tags)
    }, [photos])

    // フィルタリングロジック
    const filteredPhotos = useMemo(() => {
        if (activeTag === "All") return photos
        return photos.filter(photo => photo.tags?.includes(activeTag))
    }, [photos, activeTag])

    // 表示するタグと、隠れているタグの計算
    const visibleTags = allTags.slice(0, VISIBLE_TAGS_LIMIT)
    const hiddenTagsCount = Math.max(0, allTags.length - VISIBLE_TAGS_LIMIT)

    return (
        <>
            <div className="w-full max-w-6xl mx-auto px-4 space-y-8">

                {/* ▼ フィルターエリア (制限付き表示) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 px-2 no-scrollbar scroll-smooth mask-linear-gradient pr-12">
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 flex items-center mr-2 shrink-0">
                        <Filter className="w-4 h-4 text-orange-400" />
                    </div>

                    {/* 制限内のタグを表示 */}
                    {visibleTags.map((tag) => (
                        <TagButton
                            key={tag}
                            tag={tag}
                            isActive={activeTag === tag}
                            onClick={() => setActiveTag(tag)}
                        />
                    ))}

                    {/* ▼▼▼ 「もっと見る」ボタン (タグが多い時だけ表示) ▼▼▼ */}
                    {hiddenTagsCount > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsTagModalOpen(true)}
                            className="rounded-full border-dashed border-slate-300 text-slate-500 hover:text-orange-500 hover:border-orange-300 font-bold shrink-0 ml-2"
                        >
                            <Grid className="w-3 h-3 mr-1" />
                            +{hiddenTagsCount} もっと見る
                        </Button>
                    )}
                </div>

                {/* ▼ 写真グリッド (変更なし) */}
                <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 px-2">
                    <AnimatePresence mode="popLayout">
                        {filteredPhotos.map((photo, index) => (
                            <motion.div
                                key={photo.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, type: "spring", damping: 15 }}
                                whileHover={{ scale: 1.03, rotate: index % 2 === 0 ? 1 : -1, zIndex: 10 }}
                                className="relative break-inside-avoid rounded-xl cursor-pointer group"
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                <div className="bg-white dark:bg-slate-800 p-2.5 rounded-2xl shadow-md hover:shadow-xl dark:shadow-slate-900/50 transition-all border border-slate-100 dark:border-slate-700/50 overflow-hidden relative">
                                    <div className="relative rounded-lg overflow-hidden aspect-auto bg-slate-100 dark:bg-slate-900">
                                        {photo.media_type === "video" ? (
                                            <>
                                                <video
                                                    src={photo.publicUrl}
                                                    width={photo.width}
                                                    height={photo.height}
                                                    className="w-full h-auto object-cover"
                                                    muted loop playsInline autoPlay
                                                />
                                                <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded-full backdrop-blur-sm">
                                                    <PlayCircle className="w-5 h-5" />
                                                </div>
                                            </>
                                        ) : (
                                            <BlurImage
                                                src={photo.publicUrl}
                                                alt={photo.location_note || "photo"}
                                                width={photo.width}
                                                height={photo.height}
                                                className="w-full h-auto"
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                            />
                                        )}
                                        {/* タイトルオーバーレイ */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                                            <div className="text-white drop-shadow-md font-rounded">
                                                <p className="font-bold text-sm line-clamp-1">
                                                    {photo.title || "No Title"}
                                                </p>
                                                <p className="text-[10px] opacity-80 flex items-center gap-1 mt-0.5">
                                                    <Calendar className="w-3 h-3" /> {formatDate(photo.taken_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 right-4 z-20 scale-90 group-hover:scale-100 transition-transform">
                                        <LikeButton photoId={photo.id} initialLikes={photo.likes_count || 0} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* 読み込み中のローディング表示 & 検知用エリア */}
                {activeTag === "All" && hasMore && (
                    <div ref={ref} className="py-10 flex justify-center w-full">
                        {isLoadingMore && (
                            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
                        )}
                    </div>
                )}

                {/* データ切れの表示 */}
                {activeTag === "All" && !hasMore && photos.length > 0 && (
                    <p className="text-center text-slate-400 text-sm py-10 font-rounded">
                        すべて読み込みました 🐾
                    </p>
                )}

                {/* 0枚時の表示 */}
                {filteredPhotos.length === 0 && (
                    <div className="text-center py-32 text-slate-400 font-rounded bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 mx-auto max-w-md">
                        <p className="text-xl">😿</p>
                        <p className="mt-2">該当する写真がありません</p>
                        <Button variant="link" onClick={() => setActiveTag("All")} className="text-orange-500">
                            すべての写真を表示
                        </Button>
                    </div>
                )}
            </div>

            {/* タグ一覧モーダル */}
            <Dialog open={isTagModalOpen} onOpenChange={setIsTagModalOpen}>
                <DialogContent className="max-w-2xl bg-white dark:bg-slate-950 font-rounded rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Tag className="w-5 h-5 text-orange-400" />
                            タグで探す ({allTags.length - 1})
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-6">
                        <div className="flex flex-wrap gap-3">
                            {allTags.map((tag) => (
                                <TagButton
                                    key={tag}
                                    tag={tag}
                                    isActive={activeTag === tag}
                                    onClick={() => {
                                        setActiveTag(tag)
                                        setIsTagModalOpen(false) // 選択したら閉じる
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 -mx-6 -mb-6 p-4 rounded-b-3xl border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <Button variant="outline" onClick={() => setIsTagModalOpen(false)}>閉じる</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ▼ モーダル (縦型レイアウト統一版) */}
            <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
                {/* 変更1: 幅を max-w-6xl から max-w-lg (縦長カードサイズ) に変更 */}
                {/* 変更2: 高さを h-[90vh] に固定 */}
                <DialogContent className="max-w-lg w-[95vw] h-[90vh] p-0 overflow-hidden bg-[#fdfcf8] dark:bg-slate-950 border-[6px] border-orange-100 dark:border-slate-800 rounded-[2rem] shadow-2xl flex flex-col">

                    {/* コンテンツエリア (常に縦並び flex-col) */}
                    <div className="flex flex-col h-full">

                        {/* 上部: 画像エリア (高さの55%〜60%を使用) */}
                        <div className="relative w-full h-[55%] bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] shrink-0">
                            {selectedPhoto && (
                                // ▼▼▼ 修正: ここのクラス名を変更 (flexなどを削除し、サイズを明示) ▼▼▼ 
                                <div className="relative w-full h-full p-4">
                                    {selectedPhoto.media_type === "video" ? (
                                        <video
                                            src={selectedPhoto.publicUrl}
                                            className="w-full h-full object-contain drop-shadow-lg"
                                            controls autoPlay playsInline
                                        />
                                    ) : (
                                        <BlurImage
                                            src={selectedPhoto.publicUrl}
                                            alt="view"
                                            fill
                                            className="object-contain drop-shadow-lg w-full h-full"
                                        />
                                    )}
                                </div>
                            )}
                            {/* 閉じるボタン (画像の右上に配置 / PCでも表示する) */}
                            <DialogClose className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md z-50 transition-colors">
                                <X className="w-5 h-5" />
                            </DialogClose>
                        </div>

                        {/* 下部: 情報エリア (残りの高さを使用 / スクロール可能) */}
                        <div className="w-full h-[45%] bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 flex flex-col gap-5 overflow-y-auto relative grow">

                            <DialogHeader className="text-left space-y-2 shrink-0">
                                <Badge variant="outline" className="w-fit border-orange-300 text-orange-500 dark:border-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20">
                                    {selectedPhoto?.media_type === 'video' ? '🎬 Movie' : '📷 Photo'}
                                </Badge>
                                <div>
                                    <DialogTitle className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 font-rounded tracking-tight leading-tight">
                                        {selectedPhoto?.title || "No Title"}
                                    </DialogTitle>
                                    <p className="text-xs md:text-sm text-slate-400 font-bold mt-1">Kapi&apos;s Moment 🐾</p>
                                </div>
                            </DialogHeader>

                            {selectedPhoto && (
                                <div className="space-y-6 font-rounded">
                                    <div className="flex flex-col gap-3">
                                        <InfoItem icon={Calendar} label="撮影日" value={formatDate(selectedPhoto.taken_at)} />
                                        {selectedPhoto.location_note && (
                                            <InfoItem icon={MapPin} label="場所・メモ" value={selectedPhoto.location_note} />
                                        )}
                                    </div>
                                    {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                                        <div className="space-y-2">
                                            <span className="text-xs font-bold text-slate-400 ml-1">TAGS</span>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedPhoto.tags.map(tag => (
                                                    <Badge key={tag} variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-600 transition-colors px-3 py-1 text-sm border-transparent border-2 hover:border-orange-200 cursor-default">
                                                        #{tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 下部固定エリア (いいねボタンなど) */}
                            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Love it? 👉</span>
                                    <LikeButton
                                        photoId={selectedPhoto?.id || ""}
                                        initialLikes={selectedPhoto?.likes_count || 0}
                                        className="border-2 border-orange-100 dark:border-slate-700 bg-orange-50/50 dark:bg-slate-800/50"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

// タグボタンコンポーネント (共通化)
function TagButton({ tag, isActive, onClick }: { tag: string, isActive: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2 flex items-center gap-1.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 font-rounded shrink-0",
                isActive
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-300 dark:hover:border-orange-700 hover:text-orange-600 dark:hover:text-orange-400"
            )}
        >
            {tag !== "All" && <Tag className="w-3 h-3 opacity-70" />}
            {tag === "All" ? "すべて" : tag}
        </button>
    )
}

// InfoItemコンポーネント (変更なし)
function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50">
            <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm text-orange-400 shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{value}</p>
            </div>
        </div>
    )
}