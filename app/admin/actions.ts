'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

export async function deletePhoto(photoId: string, storagePath: string) {
    const supabase = await createClient()

    // 1. まず画像ファイル自体を削除 (Storage)
    const { error: storageError } = await supabase.storage
        .from('kapi-photos')
        .remove([storagePath])

    if (storageError) {
        console.error('Storage削除エラー:', storageError)
        return { error: '画像の削除に失敗しました' }
    }

    // 2. 次にデータベースの情報を削除 (Table)
    const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId)

    if (dbError) {
        console.error('DB削除エラー:', dbError)
        return { error: 'データの削除に失敗しました' }
    }

    // 3. 画面を更新
    revalidatePath('/admin')
    revalidatePath('/')

    return { success: true }
}

// 更新用のアクション
export async function updatePhoto(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const location = formData.get('location') as string
    const tagsString = formData.get('tags') as string
    const dateStr = formData.get('date') as string // 並び順変更用（日付）
    const newFile = formData.get('file') as File | null

    const tags = tagsString.split(',').map(t => t.trim()).filter(t => t)
    const targetDate = dateStr ? new Date(dateStr).toISOString() : new Date().toISOString()

    let updateData: any = {
        title: title,
        location_note: location,
        tags: tags,
        created_at: targetDate, // これで並び順をコントロール
    }

    // 画像の差し替えがある場合
    if (newFile && newFile.size > 0) {
        // 1. 古い画像のパスを取得して削除（容量節約のため）
        const { data: oldData } = await supabase
            .from('photos')
            .select('storage_path')
            .eq('id', id)
            .single()

        if (oldData?.storage_path) {
            await supabase.storage.from('kapi-photos').remove([oldData.storage_path])
        }

        // 2. 新しい画像をアップロード
        const fileExt = newFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('kapi-photos')
            .upload(fileName, newFile)

        if (uploadError) return { error: '画像のアップロードに失敗しました' }

        // 3. 画像サイズを取得（クライアント側でやるのが確実ですが、簡易的に更新データに含める）
        // ※本来はここでサイズ再計算が必要ですが、今回は簡易実装としてパスだけ更新します
        updateData.storage_path = fileName
    }

    // DB更新
    const { error } = await supabase
        .from('photos')
        .update(updateData)
        .eq('id', id)

    if (error) {
        console.error(error)
        return { error: '更新に失敗しました' }
    }

    revalidatePath('/admin')
    revalidatePath('/')

    return { success: true }
}