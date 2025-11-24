"use client"

import { useState, useEffect } from "react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Button } from "@/components/ui/button"
import { Trash2, Loader2, GripVertical, Save } from "lucide-react"
import EditPhotoDialog from "./EditPhotoDialog"
import { deletePhoto, updatePhotoOrder } from "./actions"
import BlurImage from "@/components/ui/BlurImage"

// 型定義 (PhotoListと同じ)
type Photo = {
    id: string
    storage_path: string
    publicUrl: string
    location_note: string | null
    title: string | null
    tags: string[] | null
    created_at: string
    sort_order: number // ⬅️ 追加
}

export default function SortablePhotoList({ photos: initialPhotos }: { photos: Photo[] }) {
    const [photos, setPhotos] = useState(initialPhotos)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false) // 変更があるかどうかのフラグ

    // センサー設定 (マウス、タッチ、キーボード操作の検知)
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // 初期データが更新されたらStateも更新 (これがないと外部からの更新が反映されない)
    useEffect(() => {
        setPhotos(initialPhotos)
        setHasChanges(false)
    }, [initialPhotos])

    // ドラッグ終了時の処理
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            setPhotos((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id)
                const newIndex = items.findIndex(item => item.id === over?.id)
                return arrayMove(items, oldIndex, newIndex)
            })
            setHasChanges(true) // 変更フラグをON
        }
    }

    // 保存ボタンを押した時の処理
    const handleSaveOrder = async () => {
        setIsSaving(true)
        // 新しい順番で sort_order を採番しなおす (上から 0, 1, 2...)
        const updates = photos.map((photo, index) => ({
            id: photo.id,
            sort_order: index,
        }))

        const result = await updatePhotoOrder(updates)
        if (result?.error) {
            alert(result.error)
        } else {
            setHasChanges(false) // 保存できたらフラグをOFF
        }
        setIsSaving(false)
    }

    // 削除処理 (PhotoListから移植)
    const handleDelete = async (id: string, path: string) => {
        if (!confirm("本当にこの写真を削除しますか？\n（元に戻せません！）")) return
        setDeletingId(id)
        const result = await deletePhoto(id, path)
        if (result.error) {
            alert(result.error)
            setDeletingId(null)
        }
    }

    if (photos.length === 0) {
        return <p className="text-slate-500 text-center py-10 font-rounded">まだ写真がありません😿</p>
    }

    return (
        <div className="space-y-4">
            {/* 保存ボタン (変更がある時だけ表示) */}
            {hasChanges && (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm font-bold text-orange-600 dark:text-orange-400 font-rounded">
                        ⚠️ 並び順が変更されています
                    </p>
                    <Button onClick={handleSaveOrder} disabled={isSaving} size="sm" className="gap-2 font-bold">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        並び順を保存
                    </Button>
                </div>
            )}

            {/* ドラッグ&ドロップ領域 */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={photos} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {photos.map((photo) => (
                            <SortableItem
                                key={photo.id}
                                photo={photo}
                                deletingId={deletingId}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}

// ドラッグ可能な個別のカードコンポーネント
function SortableItem({ photo, deletingId, onDelete }: { photo: Photo, deletingId: string | null, onDelete: (id: string, path: string) => void }) {
    // dnd-kitのフック (ドラッグ機能を提供)
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: photo.id })

    // ドラッグ中のスタイル (少し浮かせて透明にする)
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} className="relative group bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 overflow-hidden">

            {/* ▼▼▼ ドラッグハンドル (ここをつかむ) ▼▼▼ */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 left-2 z-20 bg-white/80 dark:bg-slate-900/80 p-1.5 rounded-md cursor-grab active:cursor-grabbing shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <GripVertical className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>

            {/* 画像表示 */}
            <div className="aspect-square relative bg-slate-100 dark:bg-slate-900">
                <BlurImage
                    src={photo.publicUrl}
                    alt="admin preview"
                    fill
                    className="object-cover"
                />
            </div>

            {/* 下部の情報エリア */}
            <div className="p-2 flex flex-col gap-1 bg-white dark:bg-slate-800 border-t dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                    {photo.title || "No Title"}
                </span>

                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex-1">
                        {photo.location_note || "-"}
                    </span>
                    <div className="flex items-center gap-1">
                        <EditPhotoDialog photo={photo} />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-7 w-7 shrink-0"
                            disabled={deletingId === photo.id}
                            onClick={() => onDelete(photo.id, photo.storage_path)}
                        >
                            {deletingId === photo.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <Trash2 className="h-3 w-3" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}