import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import '@ant-design/v5-patch-for-react-19'
import { AntdProvider } from './providers'
import { AppLayout } from '@/components/AppLayout'
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ARM - Автоматизированное рабочее место",
  description: "Система автоматизированного рабочего места",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AntdProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </AntdProvider>
      </body>
    </html>
  )
}
