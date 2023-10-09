import './globals.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from './components/organisms/Header'
import { Footer } from './components/organisms/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NextBlogApp',
  description: 'BlogApp with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
