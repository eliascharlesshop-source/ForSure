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
  Plus,
  Palette,
  Code,
  ChevronDown,
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
import { useTopbar } from './topbar-provider'

export function AppTopbar() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { mode, onModeChange, onNewProject } = useTopbar()

  // Button handlers
  const handleShare = () => {
    const shareUrl = window.location.href
    if (navigator.share) {
      navigator.share({
        title: 'ForSure Project',
        url: shareUrl,
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert('Link copied to clipboard!')
    }
  }

  const handleGitHub = () => {
    window.open('https://github.com', '_blank')
  }

  const handleDeploy = () => {
    window.open('https://vercel.com', '_blank')
  }

  const handleFork = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Fork ForSure Project',
        text: 'Check out this ForSure project',
        url: window.location.href,
      })
    } else {
      alert('Fork project functionality')
    }
  }

  const handleVersion = () => {
    alert('Current version: v1.0.0')
  }

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
    <div className="sticky top-0 z-30 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center justify-between px-3 sm:px-4 md:px-6">
        {/* Left side - Logo and breadcrumbs */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <Link href="/" className="flex items-center gap-1.5 flex-shrink-0 group">
            <div className="relative w-8 h-8">
              <Image
                src="/fs-logo.png"
                alt="ForSure Logo"
                width={32}
                height={32}
                className="h-8 w-8 group-hover:opacity-80 transition-opacity"
              />
            </div>
            <span className="font-semibold text-sm sm:text-base hidden sm:inline-block text-foreground group-hover:text-primary transition-colors">
              ForSure
            </span>
          </Link>

          <div className="hidden lg:flex items-center">
            <nav className="flex items-center text-sm">
              {breadcrumbs.map((crumb, i) => (
                <div key={i} className="flex items-center">
                  {i > 0 && (
                    <ChevronRight className="h-4 w-4 mx-1.5 text-muted-foreground" />
                  )}
                  <Link href={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors px-1">
                    {crumb.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-1.5 -mr-1.5 hover:bg-secondary rounded-md transition-colors"
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
        <div className="hidden lg:flex items-center gap-2">
          {/* Mode Selector */}
          {onModeChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  {mode === 'design' ? (
                    <>
                      <Palette className="h-4 w-4" />
                      <span className="hidden md:inline">Design</span>
                    </>
                  ) : (
                    <>
                      <Code className="h-4 w-4" />
                      <span className="hidden md:inline">Dev</span>
                    </>
                  )}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onModeChange('design')}>
                  <Palette className="h-4 w-4 mr-2" />
                  <span>Design Mode</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onModeChange('dev')}>
                  <Code className="h-4 w-4 mr-2" />
                  <span>Dev Mode</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* New Project Button */}
          {onNewProject && (
            <Button variant="default" size="sm" className="h-9 gap-2" onClick={onNewProject}>
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">New Project</span>
            </Button>
          )}

          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-secondary" title="Share" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-secondary" title="GitHub" onClick={handleGitHub}>
            <Github className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-secondary" title="Deploy to Vercel" onClick={handleDeploy}>
            <Cloud className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-secondary" title="Fork Chat" onClick={handleFork}>
            <GitFork className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-secondary" title="Version" onClick={handleVersion}>
            <Tag className="h-4 w-4" />
          </Button>

          <div className="pl-2 ml-2 border-l border-border/40">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full p-0 hover:bg-secondary"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user?.avatar || '/placeholder.svg'}
                      alt={user?.name || 'User'}
                    />
                    <AvatarFallback className="text-xs font-medium bg-primary text-primary-foreground">
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
                    <p className="text-sm font-semibold leading-none text-foreground">
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
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0 hover:bg-secondary"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user?.avatar || '/placeholder.svg'}
                    alt={user?.name || 'User'}
                  />
                  <AvatarFallback className="text-xs font-medium bg-primary text-primary-foreground">
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
                  <p className="text-sm font-semibold leading-none text-foreground">
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
        <div className="lg:hidden border-t border-border/40 bg-card">
          <div className="px-3 sm:px-4 py-3 space-y-3">
            {/* Mode selector and New Project for mobile */}
            <div className="flex gap-2 flex-wrap">
              {onModeChange && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 flex-1 sm:flex-initial">
                      {mode === 'design' ? (
                        <>
                          <Palette className="h-4 w-4 mr-1.5" />
                          <span className="text-xs">Design</span>
                        </>
                      ) : (
                        <>
                          <Code className="h-4 w-4 mr-1.5" />
                          <span className="text-xs">Dev</span>
                        </>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => onModeChange('design')}>
                      <Palette className="h-4 w-4 mr-2" />
                      <span>Design Mode</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onModeChange('dev')}>
                      <Code className="h-4 w-4 mr-2" />
                      <span>Dev Mode</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {onNewProject && (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="h-9 gap-1.5 flex-1 sm:flex-initial" 
                  onClick={() => {
                    onNewProject()
                    setMobileMenuOpen(false)
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-xs">New Project</span>
                </Button>
              )}
            </div>

            {/* Other action buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 h-9 text-xs font-medium"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 h-9 text-xs font-medium"
                onClick={handleGitHub}
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 h-9 text-xs font-medium"
                onClick={handleDeploy}
              >
                <Cloud className="h-4 w-4" />
                <span>Deploy</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 h-9 text-xs font-medium"
                onClick={handleFork}
              >
                <GitFork className="h-4 w-4" />
                <span>Fork</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 h-9 text-xs font-medium"
                onClick={handleVersion}
              >
                <Tag className="h-4 w-4" />
                <span>Version</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
