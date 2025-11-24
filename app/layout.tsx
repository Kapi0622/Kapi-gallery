import type { Metadata } from "next";
// 1. フォントをインポート
import { M_PLUS_Rounded_1c } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"

// 2. フォントの設定 (太さなどを指定)
const mPlus = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400", "700"], // 通常と太字
  variable: "--font-m-plus", // Tailwindで使うための変数名
});

export const metadata: Metadata = {
  // 1. ベースURLの設定 (本番公開後に実際のドメインに書き換えます)
  // Vercelのドメインが決まったらここを書き換えてください
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),

  title: {
    default: "Kapi Gallery 🐾",
    template: "%s | Kapi Gallery", // 子ページでは "About | Kapi Gallery" のようになります
  },
  description: "のんびり屋の猫「カピ」の日常を切り取ったフォトアーカイブ。",

  // 2. OGP設定 (LINE, Facebook, Discordなど)
  openGraph: {
    title: "Kapi Gallery 🐾",
    description: "カピの写真を見て癒やされませんか？",
    url: "/",
    siteName: "Kapi Gallery",
    locale: "ja_JP",
    type: "website",
  },

  // 3. Twitter Card設定 (X)
  twitter: {
    card: "summary_large_image", // 大きな画像で表示
    title: "Kapi Gallery 🐾",
    description: "のんびり屋の猫「カピ」の日常アーカイブ。",
    // creator: "@your_twitter_id", // 必要であれば
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐾</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${mPlus.variable} antialiased font-rounded 
        bg-[#fdfcf8] dark:bg-slate-950 
        text-slate-700 dark:text-slate-200 
        transition-colors duration-300`}>
        
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Footer />
        </ThemeProvider>

      </body>
    </html>
  );
}