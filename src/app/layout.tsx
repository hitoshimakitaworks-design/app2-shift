import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { I18nProvider } from '@/lib/i18n'
import { CookieBanner } from '@/components/CookieBanner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'シフト表自動作成ツール | 無料・飲食店・カフェ向け',
  description: '無料で使えるシフト自動作成ツール。スタッフの希望休を入力するだけで月間シフト表を自動生成。飲食店・カフェ・美容室向け。Free shift schedule generator.',
  openGraph: {
    title: 'シフト表自動作成ツール | 無料',
    description: 'スタッフの希望休を入力するだけでシフト表を自動生成',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 font-sans">
        <I18nProvider>
          {children}
          <CookieBanner />
        </I18nProvider>
      </body>
    </html>
  )
}
