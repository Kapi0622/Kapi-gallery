"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react" // 読み込みアイコン

export default function UploadPage() {
    const supabase = createClient()
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)

    // メタデータ入力用
    const [location, setLocation] = useState("")
    const [tags, setTags] = useState("")

    // 画像が選択された時の処理
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        const selectedFile = e.target.files[0]
        setFile(selectedFile)

        // プレビュー用URL作成
        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)
    }

    // 画像のサイズ(width, height)を取得するヘルパー関数
    const getImageDimensions = (src: string): Promise<{ w: number; h: number }> => {
        return new Promise((resolve) => {
            const img = new Image()
            img.onload = () => resolve({ w: img.width, h: img.height })
            img.src = src
        })
    }

    // アップロード実行
    const handleUpload = async () => {
        if (!file || !preview) return
        setUploading(true)

        try {
            // 1. ファイル名をユニークにする (例: 123456789-kapi.jpg)
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const storagePath = `${fileName}`

            // 2. Supabase Storageにアップロード
            const { error: uploadError } = await supabase.storage
                .from('kapi-photos')
                .upload(storagePath, file)

            if (uploadError) throw uploadError

            // 3. 画像サイズの取得
            const { w, h } = await getImageDimensions(preview)

            // 4. データベース(photosテーブル)に情報を保存
            const { error: dbError } = await supabase
                .from('photos')
                .insert({
                    storage_path: storagePath,
                    width: w,
                    height: h,
                    location_note: location,
                    tags: tags.split(',').map(t => t.trim()).filter(t => t), // カンマ区切りを配列に
                    taken_at: new Date().toISOString(), // とりあえず現在時刻
                })

            if (dbError) throw dbError

            alert("アップロード完了しました！😺")

            // フォームリセット
            setFile(null)
            setPreview(null)
            setLocation("")
            setTags("")

        } catch (error) {
            console.error(error)
            alert("エラーが発生しました😭")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8 flex justify-center items-start">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-xl text-center">カピの写真を追加 📸</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                    {/* 画像選択エリア */}
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="picture">画像ファイル</Label>
                        <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
                    </div>

                    {/* プレビュー表示 */}
                    {preview && (
                        <div className="relative rounded-md overflow-hidden border border-slate-200 bg-slate-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={preview} alt="Preview" className="w-full h-auto object-contain max-h-64" />
                        </div>
                    )}

                    {/* メタデータ入力 */}
                    <div className="space-y-2">
                        <Label>撮影場所 / 一言メモ</Label>
                        <Input
                            placeholder="例：リビングのソファーにて"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>タグ (カンマ区切り)</Label>
                        <Input
                            placeholder="寝顔, おもちゃ, 2024冬"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>

                    {/* 送信ボタン */}
                    <Button
                        className="w-full font-bold"
                        onClick={handleUpload}
                        disabled={!file || uploading}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> アップロード中...
                            </>
                        ) : (
                            "この写真を保存する"
                        )}
                    </Button>

                </CardContent>
            </Card>
        </div>
    )
}