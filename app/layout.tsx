import type React from 'react'
import '@/app/globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { NavWrapper } from '@/components/nav-wrapper'
import { ConditionalFooter } from '@/components/conditional-footer'
import { ScrollToAnchor } from '@/components/scroll-to-anchor'
import { AuthProvider } from '@/contexts/auth-context'
import { SubscriptionProvider } from '@/contexts/subscription-context'

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
          <SubscriptionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange={false}
            storageKey="forsure-theme"
          >
            <ScrollToAnchor />
            <div className="flex min-h-screen flex-col">
              <NavWrapper />
              <div className="p-[5px] flex-1 flex flex-col">
                {children}
              </div>
              <ConditionalFooter />
            </div>
          </ThemeProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
