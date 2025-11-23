"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import BlurImage from "@/components/ui/BlurImage"
import { Calendar, MapPin, X, Filter } from "lucide-react"
import LikeButton from "./LikeButton"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

type Photo = {
    id: string
    storage_path: string
    width: number
    height: number
    location_note: string | null
    tags: string[] | null
    created_at: string
    taken_at: string
    publicUrl: string
    likes_count: number
}

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
    const [activeTag, setActiveTag] = useState<string>("All")

    // 1. 写真リストから重複しないタグ一覧を生成
    const allTags = useMemo(() => {
        const tags = new Set<string>(["All"])
        photos.forEach(photo => {
            photo.tags?.forEach(tag => tags.add(tag))
        })
        return Array.from(tags)
    }, [photos])

    // 2. 選択中のタグで写真をフィルタリング
    const filteredPhotos = useMemo(() => {
        if (activeTag === "All") return photos
        return photos.filter(photo => photo.tags?.includes(activeTag))
    }, [photos, activeTag])

    return (
        <>
            <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">

                {/* ▼ タグフィルターエリア (横スクロール対応) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
                    <Filter className="w-5 h-5 text-slate-400 shrink-0 mr-2" />

                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            className={`
                px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap
                ${activeTag === tag
                                    ? "bg-orange-400 text-white shadow-md scale-105"
                                    : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"}
              `}
                        >
                            {tag === "All" ? "すべて" : `#${tag}`}
                        </button>
                    ))}
                </div>

                {/* ▼ 写真グリッド */}
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredPhotos.map((photo, index) => (
                            <motion.div
                                key={photo.id}
                                layout // レイアウト変更時のアニメーション
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}

                                className="relative break-inside-avoid rounded-xl overflow-hidden cursor-pointer group bg-slate-100"
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                <BlurImage
                                    src={photo.publicUrl}
                                    alt={photo.location_note || "photo"}
                                    width={photo.width}
                                    height={photo.height}
                                    className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                                <div className="absolute bottom-3 right-3 z-10">
                                    <LikeButton
                                        photoId={photo.id}
                                        initialLikes={photo.likes_count || 0}
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                    <p className="text-white text-xs font-bold drop-shadow-md">
                                        {formatDate(photo.taken_at)}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* 写真が0枚になった時の表示 */}
                {filteredPhotos.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        該当する写真がありません😿
                    </div>
                )}
            </div>

            {/* 拡大モーダル (前回と同じですが念のため記述) */}
            <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
                <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-slate-50/95 backdrop-blur-md border-none">
                    <div className="flex flex-col md:flex-row h-[80vh] md:h-auto">
                        <div className="relative w-full md:w-2/3 h-1/2 md:h-[80vh] bg-black/5 flex items-center justify-center p-4">
                            {selectedPhoto && (
                                <div className="relative w-full h-full">
                                    <BlurImage src={selectedPhoto.publicUrl} alt="view" fill className="object-contain" />
                                </div>
                            )}
                        </div>
                        <div className="w-full md:w-1/3 p-6 flex flex-col gap-6 overflow-y-auto bg-white">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-slate-800 font-rounded">Kapi&apos;s Photo 🐾</DialogTitle>
                                <DialogDescription>カピちゃんの日常</DialogDescription>
                            </DialogHeader>
                            {selectedPhoto && (
                                <div className="space-y-6">
                                    <div className="space-y-3 text-sm text-slate-600 font-rounded">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-orange-400" />
                                            <span>{formatDate(selectedPhoto.taken_at)}</span>
                                        </div>
                                        {selectedPhoto.location_note && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-orange-400" />
                                                <span>{selectedPhoto.location_note}</span>
                                            </div>
                                        )}
                                    </div>
                                    {selectedPhoto.tags && (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedPhoto.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="bg-orange-50 text-orange-600 hover:bg-orange-100">#{tag}</Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="mt-auto md:hidden">
                                <Button className="w-full" onClick={() => setSelectedPhoto(null)}>閉じる</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}