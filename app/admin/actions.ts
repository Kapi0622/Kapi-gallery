'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

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