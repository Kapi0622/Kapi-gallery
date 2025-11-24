"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Loader2 } from "lucide-react"
import { updatePhoto } from "./actions"
import Image from "next/image"

type Photo = {
    id: string
    storage_path: string
    publicUrl: string
    location_note: string | null
    tags: string[] | null
    created_at: string // 並び順用
}

export default function EditPhotoDialog({ photo }: { photo: Photo }) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [preview, setPreview] = useState(photo.publicUrl) // プレビュー用

    // フォーム送信ハンドラ
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        // IDを追加
        formData.append('id', photo.id)

        const result = await updatePhoto(formData)

        if (result?.error) {
            alert(result.error)
        } else {
            setOpen(false) // 成功したら閉じる
        }
        setIsLoading(false)
    }

    // 画像変更時のプレビュー
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setPreview(URL.createObjectURL(file))
        }
    }

    // 日付入力用に "YYYY-MM-DDThh:mm" 形式に変換
    const defaultDate = new Date(photo.created_at).toISOString().slice(0, 16)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4 text-slate-600" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900">
                <DialogHeader>
                    <DialogTitle>写真を編集 📝</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {/* 画像プレビュー & 変更 */}
                    <div className="flex flex-col items-center gap-4 dark:bg-slate-900 dark:border-slate-800" >
                        <div className="relative w-full h-48 bg-slate-100 rounded-md overflow-hidden border border-slate-200 dark:border-slate-800">
                            <Image src={preview} alt="preview" fill className="object-contain" />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="file" className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs py-2 px-4 rounded block text-center transition-colors dark:bg-slate-800 dark:text-slate-100">
                                画像を差し替える (選択しなければ元のまま)
                            </Label>
                            <Input id="file" name="file" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </div>
                    </div>

                    {/* メタデータ入力 */}
                    <div className="grid gap-2">
                        <Label htmlFor="location">撮影場所 / メモ</Label>
                        <Input id="location" name="location" defaultValue={photo.location_note || ""} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="tags">タグ (カンマ区切り)</Label>
                        <Input id="tags" name="tags" defaultValue={photo.tags?.join(", ") || ""} />
                    </div>

                    {/* 並び順 (日付) 変更 */}
                    <div className="grid gap-2">
                        <Label htmlFor="date">表示日時 (並び順)</Label>
                        <Input
                            id="date"
                            name="date"
                            type="datetime-local"
                            defaultValue={defaultDate}
                        />
                        <p className="text-[10px] text-slate-400">※新しい日時ほど上に表示されます</p>
                    </div>

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "変更を保存"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}