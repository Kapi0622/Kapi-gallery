"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PawPrint } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { cn } from "@/lib/utils"

type Props = {
    photoId: string
    initialLikes: number
    className?: string
}

export default function LikeButton({ photoId, initialLikes, className }: Props) {
    const [likes, setLikes] = useState(initialLikes)
    const [isLiked, setIsLiked] = useState(false) // 自分が押したかどうかのフラグ
    const supabase = createClient()

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation() // 親の「モーダルを開くクリック」を邪魔しないように止める

        // 1. 楽観的UI更新 (サーバーの返事を待たずに画面の数字を増やす)
        setLikes((prev) => prev + 1)
        setIsLiked(true)

        // 2. 裏側でSupabaseの関数(increment_likes)を呼ぶ
        const { error } = await supabase.rpc('increment_likes', { row_id: photoId })

        if (error) {
            console.error("Like error:", error)
            // エラーなら元に戻す
            setLikes((prev) => prev - 1)
            setIsLiked(false)
        }
    }

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.8 }}
            onClick={handleLike}
            className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md transition-colors",
                isLiked
                    ? "bg-orange-500/90 text-white"
                    : "bg-white/80 text-slate-600 hover:bg-white",
                className
            )}
        >
            {/* 肉球アイコンのアニメーション */}
            <motion.div
                animate={isLiked ? { rotate: [0, -20, 20, 0] } : {}}
                transition={{ duration: 0.4 }}
            >
                <PawPrint className={cn("w-4 h-4", isLiked && "fill-current")} />
            </motion.div>

            {/* 数字のカウントアップ演出 */}
            <div className="text-sm font-bold font-rounded min-w-[1rem] text-center">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={likes} // keyが変わるとアニメーションが発火する
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        className="block"
                    >
                        {likes}
                    </motion.span>
                </AnimatePresence>
            </div>
        </motion.button>
    )
}