"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// 外部ライブラリの型定義に合わせるためのラッパー
export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}