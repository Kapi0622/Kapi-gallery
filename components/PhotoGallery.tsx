"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Calendar, MapPin, X } from "lucide-react" // アイコン

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

// 写真データの型定義
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
}

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
    // 選択中の写真を管理するState
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

    return (
        <>
            <div className="w-full max-w-6xl mx-auto px-4 py-8">
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {photos.map((photo, index) => (
                        <motion.div
                            key={photo.id}
                            layoutId={`photo-${photo.id}`} // アニメーションの連携用ID
                            className="relative break-inside-avoid rounded-xl overflow-hidden cursor-pointer group"

                            // アニメーション設定
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}

                            // クリックで選択
                            onClick={() => setSelectedPhoto(photo)}
                        >
                            <Image
                                src={photo.publicUrl}
                                alt={photo.location_note || "カピちゃんの写真"}
                                width={photo.width}
                                height={photo.height}
                                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, 33vw"
                            />

                            {/* ホバー時の黒グラデーション */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <p className="text-white text-xs font-bold truncate">
                                    {formatDate(photo.taken_at)}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 拡大表示用モーダル */}
            <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
                <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-slate-50/95 backdrop-blur-md border-none">

                    <div className="flex flex-col md:flex-row h-[80vh] md:h-auto">
                        {/* 左側（スマホでは上）：画像エリア */}
                        <div className="relative w-full md:w-2/3 h-1/2 md:h-[80vh] bg-black/5 flex items-center justify-center p-4">
                            {selectedPhoto && (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={selectedPhoto.publicUrl}
                                        alt="Expanded view"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            )}
                        </div>

                        {/* 右側（スマホでは下）：情報エリア */}
                        <div className="w-full md:w-1/3 p-6 flex flex-col gap-6 overflow-y-auto bg-white">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-slate-800">
                                    Kapi&apos;s Photo 🐾
                                </DialogTitle>
                                <DialogDescription>
                                    カピちゃんの日常の1コマ
                                </DialogDescription>
                            </DialogHeader>

                            {selectedPhoto && (
                                <div className="space-y-6">
                                    {/* 情報リスト */}
                                    <div className="space-y-3 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span>{formatDate(selectedPhoto.taken_at)}</span>
                                        </div>

                                        {selectedPhoto.location_note && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                <span>{selectedPhoto.location_note}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* タグエリア */}
                                    {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedPhoto.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="px-3 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200">
                                                    #{tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    {/* 将来的にここに「いいねボタン」や「コメント」が入ります */}
                                    {/* <div className="pt-4 border-t">
                      <Button variant="outline" size="sm">❤️ いいね！</Button>
                  </div> */}
                                </div>
                            )}

                            {/* 閉じるボタン（スマホで見やすい位置に配置） */}
                            <div className="mt-auto md:hidden">
                                <DialogClose asChild>
                                    <button className="w-full py-3 bg-slate-100 rounded-lg text-slate-600 font-bold">
                                        閉じる
                                    </button>
                                </DialogClose>
                            </div>
                        </div>
                    </div>

                </DialogContent>
            </Dialog>
        </>
    )
}