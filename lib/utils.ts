import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | null) {
  if (!dateString) return ""
  
  // Dateオブジェクトに変換
  const date = new Date(dateString)
  
  // 無効な日付の場合は空文字を返す
  if (isNaN(date.getTime())) return ""

  // 強制的に "yyyy/MM/dd" または "yyyy年M月d日" 形式にする
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}