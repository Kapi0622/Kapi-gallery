"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, UploadCloud, ClipboardPaste } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// 画像サイズ取得
const getImageDimensions = (src: string): Promise<{ w: number; h: number }> => {
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve({ w: img.width, h: img.height })
        img.src = src
    })
}

// 動画サイズ取得
const getVideoDimensions = (src: string): Promise<{ w: number; h: number }> => {
    return new Promise((resolve) => {
        const video = document.createElement("video")
        video.preload = "metadata"
        video.onloadedmetadata = () => {
            resolve({ w: video.videoWidth, h: video.videoHeight })
        }
        video.src = src
    })
}

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [fileType, setFileType] = useState<"image" | "video">("image")
    const [uploading, setUploading] = useState(false)

    // メタデータ State
    const [title, setTitle] = useState("")
    const [location, setLocation] = useState("")
    const [tags, setTags] = useState("")

    const [suggestedTags, setSuggestedTags] = useState<string[]>([])

    // ▼▼▼ 追加: 撮影日時のState (初期値は現在時刻) ▼▼▼
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()) // ローカルタイムゾーン補正
    const defaultDate = now.toISOString().slice(0, 16)
    const [capturedAt, setCapturedAt] = useState(defaultDate)

    const supabase = createClient()

    useEffect(() => {
        const fetchTags = async () => {
            const { data, error } = await supabase.rpc('get_unique_tags')
            if (!error && data) {
                setSuggestedTags(data.map((t: any) => t.tag || t)) // 返り値の型に合わせて調整
            }
        }
        fetchTags()
    }, [])

    const toggleTag = (tagToToggle: string) => {
        // 現在の入力値を配列に変換
        const currentTags = tags.split(',').map(t => t.trim()).filter(t => t)

        let newTags: string[]
        if (currentTags.includes(tagToToggle)) {
            // 既にあるなら削除 (OFF)
            newTags = currentTags.filter(t => t !== tagToToggle)
        } else {
            // ないなら追加 (ON)
            newTags = [...currentTags, tagToToggle]
        }

        // 文字列に戻してセット
        setTags(newTags.join(', '))
    }

    // ▼▼▼ 追加: ファイル処理の共通関数 (選択 or ペースト) ▼▼▼
    const processFile = (selectedFile: File) => {
        // 容量チェック (50MB制限)
        if (selectedFile.size > 50 * 1024 * 1024) {
            alert("ファイルサイズが大きすぎます😿\n50MB以下のファイルを選択してください。")
            return
        }

        setFile(selectedFile)

        // ファイルタイプ判定
        const type = selectedFile.type.startsWith("video/") ? "video" : "image"
        setFileType(type)

        // プレビュー用URL生成
        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)
    }

    // ファイル選択時の処理
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        processFile(e.target.files[0])
    }

    // ▼▼▼ 追加: ペースト(Ctrl+V)の検知 ▼▼▼
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items
            if (!items) return

            for (const item of items) {
                if (item.type.indexOf("image") !== -1) {
                    const blob = item.getAsFile()
                    if (blob) {
                        processFile(blob)
                        e.preventDefault() // デフォルトのペースト動作を防ぐ
                    }
                }
            }
        }
        window.addEventListener("paste", handlePaste)
        return () => window.removeEventListener("paste", handlePaste)
    }, [])

    // アップロード実行
    const handleUpload = async () => {
        if (!file || !preview) return
        setUploading(true)

        try {
            // 1. ファイル名をユニークにする
            const fileExt = file.name.split('.').pop() || "jpg" // 拡張子がない場合はjpgと仮定
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const storagePath = fileName

            // 2. Supabase Storageにアップロード
            const { error: uploadError } = await supabase.storage
                .from('kapi-photos')
                .upload(storagePath, file)

            if (uploadError) throw uploadError

            // 3. サイズ取得
            let w = 0
            let h = 0
            if (fileType === "video") {
                const dims = await getVideoDimensions(preview)
                w = dims.w
                h = dims.h
            } else {
                const dims = await getImageDimensions(preview)
                w = dims.w
                h = dims.h
            }

            // 4. データベースに保存
            // 日付はユーザー指定のものを使用 (created_atも過去の日付にすることで並び順を制御)
            const targetDate = new Date(capturedAt).toISOString()

            const { error: dbError } = await supabase
                .from('photos')
                .insert({
                    storage_path: storagePath,
                    width: w,
                    height: h,
                    title: title,
                    location_note: location,
                    tags: tags.split(',').map(t => t.trim()).filter(t => t),
                    media_type: fileType,
                    taken_at: targetDate,   // ⬅️ 指定した撮影日
                    created_at: targetDate, // ⬅️ 並び順もその日付にする
                })

            if (dbError) throw dbError

            alert("アップロード完了しました！😺")

            // フォームリセット
            setFile(null)
            setPreview(null)
            setTitle("")
            setLocation("")
            setTags("")
            // 日付は現在時刻に戻すか、連続投稿のためにそのままにするか選べますが、一旦リセットしません

        } catch (error) {
            console.error(error)
            alert("エラーが発生しました😭")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 flex justify-center items-start transition-colors">
            <Card className="w-full max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-xl text-center text-slate-800 dark:text-slate-100 font-rounded">
                        写真・動画を追加 📸
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* ファイル選択エリア */}
                    <div className="grid w-full max-w-sm items-center gap-2">
                        <Label htmlFor="picture" className="text-slate-600 dark:text-slate-300">
                            ファイルを選択 or ペースト(Ctrl+V)
                        </Label>
                        <div className="relative group cursor-pointer">
                            <Input
                                id="picture"
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                className="cursor-pointer file:bg-orange-50 file:text-orange-600 file:border-0 file:rounded-md file:px-2 file:font-bold hover:file:bg-orange-100 dark:file:bg-orange-900/30"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400">
                            ※「画像をコピー」して、ここで Ctrl+V できます
                        </p>
                    </div>

                    {/* プレビュー表示エリア */}
                    <div className="min-h-[150px] flex items-center justify-center rounded-md border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 overflow-hidden relative">
                        {preview ? (
                            fileType === "video" ? (
                                <video src={preview} controls className="w-full h-auto max-h-64 object-contain" />
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={preview} alt="Preview" className="w-full h-auto max-h-64 object-contain" />
                            )
                        ) : (
                            <div className="text-slate-300 flex flex-col items-center gap-2 pointer-events-none">
                                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full">
                                    <ClipboardPaste className="w-6 h-6 text-slate-400" />
                                </div>
                                <span className="text-xs font-bold">ここにペースト (Ctrl+V)</span>
                            </div>
                        )}
                    </div>

                    {/* 入力フォーム群 */}
                    <div className="space-y-4">

                        {/* 撮影日時 (New!) */}
                        <div className="space-y-2">
                            <Label className="text-slate-600 dark:text-slate-300">撮影日時 (過去の日付もOK)</Label>
                            <Input
                                type="datetime-local"
                                value={capturedAt}
                                onChange={(e) => setCapturedAt(e.target.value)}
                                className="dark:bg-slate-800 dark:border-slate-700 font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-600 dark:text-slate-300">タイトル</Label>
                            <Input
                                placeholder="例：お昼寝中のカピ"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="dark:bg-slate-800 dark:border-slate-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-600 dark:text-slate-300">撮影場所 / 一言メモ</Label>
                            <Input
                                placeholder="例：リビングにて"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="dark:bg-slate-800 dark:border-slate-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-600 dark:text-slate-300">タグ (カンマ区切り)</Label>
                            <Input
                                placeholder="動画, 遊び, 2025"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="dark:bg-slate-800 dark:border-slate-700"
                            />
                        </div>

                        {/* ▼▼▼ 追加: タグ選択パレット ▼▼▼ */}
                        {suggestedTags.length > 0 && (
                            <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                <p className="text-xs text-slate-500 mb-2 font-bold">既存のタグから選択:</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestedTags.map(tag => {
                                        // 入力欄に含まれているかチェック
                                        const isActive = tags.split(',').map(t => t.trim()).includes(tag)

                                        return (
                                            <Badge
                                                key={tag}
                                                variant={isActive ? "default" : "outline"}
                                                className={cn(
                                                    "cursor-pointer hover:opacity-80 transition-all",
                                                    isActive
                                                        ? "bg-orange-500 hover:bg-orange-600 border-orange-500 text-white"
                                                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-orange-400"
                                                )}
                                                onClick={() => toggleTag(tag)}
                                            >
                                                {tag}
                                            </Badge>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 送信ボタン */}
                    <Button
                        className="w-full font-bold bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={handleUpload}
                        disabled={!file || uploading}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> アップロード中...
                            </>
                        ) : (
                            "この内容で保存する"
                        )}
                    </Button>

                </CardContent>
            </Card>
        </div>
    )
}