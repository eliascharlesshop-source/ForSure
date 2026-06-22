import type React from 'react'
import '@/app/globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import UnifiedNav from '@/components/unified-nav'
import { ConditionalFooter } from '@/components/conditional-footer'
import { ScrollToAnchor } from '@/components/scroll-to-anchor'
import { AuthProvider } from '@/contexts/auth-context'
import { PageLoaderWrapper } from '@/components/page-loader-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ForSure - File Structure Definition Language',
  description:
    'Define, document, and generate project structures with a powerful language and CLI tool.',
  generator: 'v0.dev',
  icons: {
    icon: '/fs-logo.png',
    apple: '/fs-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange={false}
            storageKey="forsure-theme"
          >
            <PageLoaderWrapper />
            <ScrollToAnchor />
            <div className="flex min-h-screen flex-col">
              <UnifiedNav context="public" />
              <div className="p-[5px] flex-1 flex flex-col">
                {children}
              </div>
              <ConditionalFooter />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
