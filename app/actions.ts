'use server'

import { createClient } from "@/utils/supabase/server"

// ページ番号(page)を受け取って、次の写真データを返す
export async function fetchMorePhotos(page: number) {
    const supabase = await createClient()
    const ITEM_PER_PAGE = 12 // 1回に読み込む枚数

    // 範囲を計算 (例: 2ページ目なら 12〜23番目を取得)
    const from = (page - 1) * ITEM_PER_PAGE
    const to = from + ITEM_PER_PAGE - 1

    const { data: photos } = await supabase
        .from('photos')
        .select('*')
        .order('sort_order', { ascending: true }) // 並び順を考慮
        .order('created_at', { ascending: false })
        .range(from, to) // 範囲指定

    // 画像URLを生成して返す
    const photosWithUrl = photos?.map((photo: any) => {
        const { data } = supabase.storage
            .from('kapi-photos')
            .getPublicUrl(photo.storage_path)

        return {
            ...photo,
            media_type: photo.media_type || 'image',
            likes_count: photo.likes_count || 0,
            tags: photo.tags || [],
            publicUrl: data.publicUrl
        }
    }) || []

    return photosWithUrl
}