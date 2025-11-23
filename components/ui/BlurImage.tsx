"use client"

import Image, { ImageProps } from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function BlurImage({ className, ...props }: ImageProps) {
    const [isLoading, setLoading] = useState(true)

    return (
        <div className={cn("overflow-hidden bg-slate-200", className)}>
            <Image
                {...props}
                className={cn(
                    // 基本スタイル
                    "duration-700 ease-in-out",
                    // 読み込み中(isLoading=true) は グレースケール ＋ ぼかし
                    isLoading
                        ? "scale-110 blur-2xl grayscale"
                        : "scale-100 blur-0 grayscale-0",
                    className
                )}
                // 読み込み完了時に発火
                onLoadingComplete={() => setLoading(false)}
            />
        </div>
    )
}