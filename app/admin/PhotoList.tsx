"use client"

import Image from "next/image"
import { useState } from "react"
import { deletePhoto } from "./actions"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"

type Photo = {
    id: string
    storage_path: string
    publicUrl: string
    location_note: string | null
}

export default function PhotoList({ photos }: { photos: Photo[] }) {
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleDelete = async (id: string, path: string) => {
        // 簡易的な確認ダイアログ
        if (!confirm("本当にこの写真を削除しますか？\n（元に戻せません！）")) return

        setDeletingId(id)
        const result = await deletePhoto(id, path)

        if (result.error) {
            alert(result.error)
            setDeletingId(null)
        }
        // 成功した場合はServer ActionのrevalidatePathにより自動で画面が更新される
    }

    if (photos.length === 0) {
        return <p className="text-slate-500 text-center py-10">まだ写真がありません</p>
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
                <div key={photo.id} className="relative group bg-white rounded-lg shadow-sm border overflow-hidden">
                    {/* 画像表示 */}
                    <div className="aspect-square relative">
                        <Image
                            src={photo.publicUrl}
                            alt="admin preview"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* 下部の情報エリア */}
                    <div className="p-2 flex justify-between items-center bg-white">
                        <span className="text-xs text-slate-500 truncate flex-1">
                            {photo.location_note || "No title"}
                        </span>

                        {/* 削除ボタン */}
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            disabled={deletingId === photo.id}
                            onClick={() => handleDelete(photo.id, photo.storage_path)}
                        >
                            {deletingId === photo.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}