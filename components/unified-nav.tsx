'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/forsure-button'
import { ModeToggle } from '@/components/mode-toggle'
import { Menu, X, Terminal, Code, FileText, Package, Share2, Github, Cloud, GitFork, Tag, ChevronRight } from 'lucide-react'
import ScrollProgress from '@/components/scroll-progress'
import { MegaMenu } from '@/components/mega-menu'
import { useTheme } from 'next-themes'
import { UserNav } from '@/components/user-nav'
import { useAuth } from '@/contexts/auth-context'
import { usePathname } from 'next/navigation'
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

type NavContext = 'public' | 'app' | 'docs'

interface UnifiedNavProps {
  context: NavContext
  mode?: 'design' | 'dev'
  onModeChange?: (mode: 'design' | 'dev') => void
}

export default function UnifiedNav({ context, mode = 'design', onModeChange }: UnifiedNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { isAuthenticated, user } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate breadcrumbs for app context
  const generateBreadcrumbs = () => {
    if (!pathname || pathname === '/app') return [{ label: 'Dashboard', href: '/app' }]
    const paths = pathname.split('/').filter(Boolean)
    let currentPath = ''
    return paths.map((path, i) => {
      currentPath += `/${path}`
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
      return { label: i === 0 ? 'Dashboard' : label, href: currentPath }
    })
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {context === 'public' && <ScrollProgress />}

      <div className="container flex h-16 items-center px-4">
        {/* Left Section - Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              {context === 'public' && (
                <div
                  className={`absolute inset-0 rounded-full blur-lg ${
                    mounted && isDark ? 'bg-primary/15' : 'bg-primary/10'
                  } scale-125`}
                />
              )}
              <Image
                src="/fs-logo.png"
                alt="ForSure Logo"
                width={40}
                height={40}
                className="h-10 w-10"
                style={
                  context === 'public'
                    ? {
                        filter:
                          mounted && isDark
                            ? 'drop-shadow(0 0 8px rgba(140, 255, 230, 0.25))'
                            : 'drop-shadow(0 0 6px rgba(140, 255, 230, 0.15))',
                      }
                    : {}
                }
              />
            </div>
            <span
              className={`font-bold text-2xl ${
                mounted && isDark ? 'text-primary' : 'text-secondary'
              }`}
            >
              ForSure
            </span>
          </Link>
        </div>

        {/* Center Section - Breadcrumbs (app context only) */}
        {context === 'app' && (
          <div className="hidden md:flex items-center flex-1">
            <nav className="flex items-center text-sm">
              {breadcrumbs.map((crumb, i) => (
                <div key={i} className="flex items-center">
                  {i > 0 && (
                    <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}

        {/* Navigation / Right Section */}
        {context === 'public' && (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 mx-8">
              <Link href="/cli" className="flex items-center gap-1 group mr-4">
                <Terminal className="h-4 w-4 group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">CLI</span>
              </Link>
              <Link href="/language" className="flex items-center gap-1 group mr-4">
                <Code className="h-4 w-4 group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">Language</span>
              </Link>
              <Link href="/docs" className="flex items-center gap-1 group mr-4">
                <FileText className="h-4 w-4 group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">Documentation</span>
              </Link>
              <Link href="/components" className="flex items-center gap-1 group mr-4">
                <Package className="h-4 w-4 group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">Components</span>
              </Link>
            </nav>
            
            {/* Right Section - Theme & Auth (pushed to far right) */}
            <div className="hidden">
              <div className="h-6 w-px bg-border"></div>
              <ModeToggle className="mx-2" />
              {isAuthenticated ? (
                <UserNav className="ml-2" />
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Log in</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="default" size="sm">Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </>
        )}

        {context === 'app' && (
          <div className="flex items-center gap-1 ml-auto md:gap-2">
            <Button variant="ghost" size="icon" title="Share">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="GitHub">
              <Github className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Deploy to Vercel">
              <Cloud className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Fork Chat">
              <GitFork className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Version">
              <Tag className="h-4 w-4" />
            </Button>
            <div className="pl-1 border-l ml-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || '/placeholder.svg'} alt={user?.name || 'User'} />
                      <AvatarFallback>
                        {user?.name
                          ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                          : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email || 'user@example.com'}</p>
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
        )}

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 ml-auto"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
          <nav className="container flex flex-col py-4 gap-4 px-[5px]">
            {context === 'public' && (
              <>
                <Link href="/cli" className="px-4 py-2 flex items-center group" onClick={() => setIsMenuOpen(false)}>
                  <Terminal className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">CLI</span>
                </Link>
                <Link href="/language" className="px-4 py-2 flex items-center group" onClick={() => setIsMenuOpen(false)}>
                  <Code className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">Language</span>
                </Link>
                <Link href="/docs" className="px-4 py-2 flex items-center group" onClick={() => setIsMenuOpen(false)}>
                  <FileText className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">Documentation</span>
                </Link>
                <Link href="/components" className="px-4 py-2 flex items-center group" onClick={() => setIsMenuOpen(false)}>
                  <Package className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">Components</span>
                </Link>
                <div className="px-4 py-2">
                  <MegaMenu
                    mode={mode}
                    onModeChange={onModeChange || (() => {})}
                  />
                </div>
                <div className="flex items-center gap-4 px-4">
                  {isAuthenticated ? (
                    <Link href="/account" className="px-4 py-2 text-sm font-medium flex items-center" onClick={() => setIsMenuOpen(false)}>
                      My Account
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" className="px-4 py-2 text-sm font-medium flex items-center" onClick={() => setIsMenuOpen(false)}>
                        Log in
                      </Link>
                      <Link href="/register" className="px-4 py-2 text-sm font-medium flex items-center" onClick={() => setIsMenuOpen(false)}>
                        Sign up
                      </Link>
                    </>
                  )}
                  <ModeToggle />
                </div>
              </>
            )}

            {context === 'app' && (
              <>
                <div className="flex flex-wrap gap-2 px-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Share</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Github className="h-3.5 w-3.5" />
                    <span>GitHub</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Cloud className="h-3.5 w-3.5" />
                    <span>Deploy</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <GitFork className="h-3.5 w-3.5" />
                    <span>Fork</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    <span>Version</span>
                  </Button>
                </div>
                <div className="pt-2 border-t px-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || '/placeholder.svg'} alt={user?.name || 'User'} />
                      <AvatarFallback>
                        {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
