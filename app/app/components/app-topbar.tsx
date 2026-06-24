'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/forsure-button'
import { usePathname } from 'next/navigation'
import {
  Share2,
  Github,
  Cloud,
  GitFork,
  Tag,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AppTopbar() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    if (!pathname || pathname === '/app')
      return [{ label: 'Dashboard', href: '/app' }]

    const paths = pathname.split('/').filter(Boolean)
    let currentPath = ''

    return paths.map((path, i) => {
      currentPath += `/${path}`
      const label =
        path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
      return {
        label: i === 0 ? 'Dashboard' : label,
        href: currentPath,
      }
    })
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div className="sticky top-0 z-30 border-b bg-background">
      <div className="flex h-12 items-center justify-between px-3 sm:px-4">
        {/* Left side - Logo and breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <Link href="/" className="flex items-center gap-1.5 flex-shrink-0">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8">
              <Image
                src="/fs-logo.png"
                alt="ForSure Logo"
                width={32}
                height={32}
                className="h-7 w-7 sm:h-8 sm:w-8"
              />
            </div>
            <span className="font-semibold text-sm sm:text-base hidden sm:inline-block">
              ForSure
            </span>
          </Link>

          <div className="hidden lg:flex items-center">
            <nav className="flex items-center text-xs sm:text-sm">
              {breadcrumbs.map((crumb, i) => (
                <div key={i} className="flex items-center">
                  {i > 0 && (
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mx-1 text-muted-foreground" />
                  )}
                  <Link href={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {crumb.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden ml-auto mr-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        {/* Right side - Action buttons (desktop) */}
        <div className="hidden lg:flex items-center gap-0.5">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Share">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="GitHub">
            <Github className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Deploy to Vercel">
            <Cloud className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Fork Chat">
            <GitFork className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Version">
            <Tag className="h-4 w-4" />
          </Button>

          <div className="pl-1 ml-1 border-l">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full p-0"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.avatar || '/placeholder.svg'}
                      alt={user?.name || 'User'}
                    />
                    <AvatarFallback className="text-xs">
                      {user?.name
                        ? user.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/app/account" className="cursor-pointer">
                    <span>My Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/app/settings" className="cursor-pointer">
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* User avatar for mobile */}
        <div className="lg:hidden ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full p-0"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.avatar || '/placeholder.svg'}
                    alt={user?.name || 'User'}
                  />
                  <AvatarFallback className="text-xs">
                    {user?.name
                      ? user.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()
                      : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/app/account" className="cursor-pointer">
                  <span>My Account</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/app/settings" className="cursor-pointer">
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t">
          <div className="px-3 py-2 space-y-2">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 h-8 text-xs"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 h-8 text-xs"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 h-8 text-xs"
              >
                <Cloud className="h-3.5 w-3.5" />
                <span>Deploy</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 h-8 text-xs"
              >
                <GitFork className="h-3.5 w-3.5" />
                <span>Fork</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 h-8 text-xs"
              >
                <Tag className="h-3.5 w-3.5" />
                <span>Version</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
