"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, MapPin, Filter, Tag, PlayCircle, X, Grid } from "lucide-react" // Gridアイコン追加

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

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
    const [activeTag, setActiveTag] = useState<string>("All")
    const [isTagModalOpen, setIsTagModalOpen] = useState(false) // タグ一覧モーダル用

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

            {/* ▼▼▼ 追加: タグ一覧モーダル ▼▼▼ */}
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
            {/* ▲▲▲ 追加ここまで ▲▲▲ */}


            {/* ▼ 写真詳細モーダル (変更なし) */}
            <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
                <DialogContent className="max-w-6xl w-[95vw] p-0 overflow-hidden bg-[#fdfcf8] dark:bg-slate-950 border-[6px] border-orange-100 dark:border-slate-800 rounded-[2rem] shadow-2xl">
                    <div className="flex flex-col md:flex-row h-[85vh] md:h-[80vh]">
                        <div className="relative w-full md:w-1/2 h-1/2 md:h-full bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]">
                            {selectedPhoto && (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    {selectedPhoto.media_type === "video" ? (
                                        <video
                                            src={selectedPhoto.publicUrl}
                                            className="w-full h-full object-contain"
                                            controls autoPlay playsInline
                                        />
                                    ) : (
                                        <BlurImage src={selectedPhoto.publicUrl} alt="view" fill className="object-contain" />
                                    )}
                                </div>
                            )}
                            <DialogClose className="absolute top-4 right-4 md:hidden bg-black/50 text-white p-2 rounded-full backdrop-blur-md z-50">
                                <X className="w-5 h-5" />
                            </DialogClose>
                        </div>

                        <div className="w-full md:w-1/2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 md:p-8 flex flex-col gap-6 overflow-y-auto relative">
                            <DialogHeader className="text-left space-y-4">
                                <Badge variant="outline" className="w-fit mb-2 border-orange-300 text-orange-500 dark:border-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20">
                                    {selectedPhoto?.media_type === 'video' ? '🎬 Movie' : '📷 Photo'}
                                </Badge>
                                <div>
                                    <DialogTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-rounded tracking-tight leading-tight">
                                        {selectedPhoto?.title || "No Title"}
                                    </DialogTitle>
                                    <p className="text-sm text-slate-400 font-bold mt-1">Kapi&apos;s Moment 🐾</p>
                                </div>
                            </DialogHeader>

                            {selectedPhoto && (
                                <div className="space-y-6 font-rounded flex-1">
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

                            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md -mx-6 -mb-6 p-6 md:rounded-br-[2rem]">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Love it? 👉</span>
                                    <LikeButton
                                        photoId={selectedPhoto?.id || ""}
                                        initialLikes={selectedPhoto?.likes_count || 0}
                                        className="border-2 border-orange-100 dark:border-slate-700 bg-orange-50/50 dark:bg-slate-800/50"
                                    />
                                </div>
                                <DialogClose asChild>
                                    <Button variant="ghost" className="hidden md:flex font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800">
                                        Close <X className="w-4 h-4 ml-2" />
                                    </Button>
                                </DialogClose>
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