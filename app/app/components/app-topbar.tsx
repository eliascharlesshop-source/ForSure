'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/forsure-button'
import { usePathname, useRouter } from 'next/navigation'
import {
  Share2,
  Github,
  Cloud,
  Tag,
  ChevronRight,
  Menu,
  X,
  Plus,
  Palette,
  Code,
  ChevronDown,
  Bell,
  Settings,
  User,
  LogOut,
  LayoutDashboard,
  FolderOpen,
  BookTemplate,
  FileText,
  Sparkles,
  Check,
  ExternalLink,
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
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/forsure-badge'
import { useTopbar } from './topbar-provider'

// Nav link definition
const NAV_LINKS = [
  { label: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { label: 'Projects', href: '/projects', icon: FolderOpen },
  { label: 'Templates', href: '/templates', icon: BookTemplate },
  { label: 'Docs', href: '/docs', icon: FileText },
  { label: 'AI Features', href: '/ai-features', icon: Sparkles },
]

const APP_VERSION = 'v1.0.0'

export function AppTopbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const { mode, onModeChange, onNewProject } = useTopbar()

  // --- Action handlers ---
  const handleShare = () => {
    const shareUrl = window.location.href
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    })
  }

  const handleGitHub = () => {
    window.open('https://github.com/eliascharlesshop-source/ForSure', '_blank', 'noopener,noreferrer')
  }

  const handleDeploy = () => {
    window.open('https://vercel.com/new', '_blank', 'noopener,noreferrer')
  }

  const handleLogout = async () => {
    await logout()
    router.push('/login')
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

  const userInitials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <TooltipProvider delayDuration={300}>
      <div className="sticky top-0 z-30 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-14 items-center justify-between px-3 sm:px-4 md:px-5 gap-2">

          {/* ── Left: Logo + Breadcrumb ── */}
          <div className="flex items-center gap-3 min-w-0 shrink-0">
            <Link href="/" className="flex items-center gap-1.5 group shrink-0">
              <Image
                src="/fs-logo.png"
                alt="ForSure Logo"
                width={28}
                height={28}
                className="h-7 w-7 group-hover:opacity-80 transition-opacity"
              />
              <span className="font-semibold text-sm hidden sm:inline-block text-foreground group-hover:text-primary transition-colors">
                ForSure
              </span>
            </Link>

            {/* Breadcrumbs — desktop only */}
            <nav aria-label="Breadcrumb" className="hidden xl:flex items-center text-sm">
              {breadcrumbs.map((crumb, i) => (
                <div key={i} className="flex items-center">
                  {i > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 mx-1 text-muted-foreground/60" />
                  )}
                  <Link
                    href={crumb.href}
                    className={`px-1 transition-colors ${
                      i === breadcrumbs.length - 1
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {crumb.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* ── Center: Primary Nav Links (desktop) ── */}
          <nav aria-label="App navigation" className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
              const isActive = href === '/app'
                ? pathname === '/app'
                : pathname?.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* ── Right: Actions ── */}
          <div className="hidden lg:flex items-center gap-1 shrink-0">
            {/* Mode toggle */}
            {onModeChange && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                    {mode === 'design' ? (
                      <><Palette className="h-3.5 w-3.5" /> Design</>
                    ) : (
                      <><Code className="h-3.5 w-3.5" /> Dev</>
                    )}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onModeChange('design')}>
                    <Palette className="h-4 w-4 mr-2" /> Design Mode
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onModeChange('dev')}>
                    <Code className="h-4 w-4 mr-2" /> Dev Mode
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* New Project */}
            {onNewProject && (
              <Button variant="default" size="sm" className="h-8 gap-1.5 text-xs" onClick={onNewProject}>
                <Plus className="h-3.5 w-3.5" />
                New Project
              </Button>
            )}

            <div className="w-px h-5 bg-border/60 mx-1" />

            {/* Share — copies current URL */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleShare}
                  aria-label="Copy page link"
                >
                  {shareCopied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{shareCopied ? 'Copied!' : 'Copy link'}</TooltipContent>
            </Tooltip>

            {/* GitHub */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleGitHub}
                  aria-label="Open GitHub repository"
                >
                  <Github className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>GitHub repository</TooltipContent>
            </Tooltip>

            {/* Deploy */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleDeploy}
                  aria-label="Deploy to Vercel"
                >
                  <Cloud className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Deploy to Vercel</TooltipContent>
            </Tooltip>

            {/* Version badge */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 gap-1 text-xs" aria-label="App version">
                  <Tag className="h-3.5 w-3.5" />
                  <span className="text-muted-foreground">{APP_VERSION}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Current version</TooltipContent>
            </Tooltip>

            {/* Notifications */}
            <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative" aria-label="Notifications">
                      <Bell className="h-4 w-4" />
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notifications
                  <Badge variant="secondary" className="text-xs">3 new</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[
                  { title: 'Project saved', desc: 'Your project was auto-saved', time: '2m ago' },
                  { title: 'AI suggestion ready', desc: 'New file structure suggestions available', time: '10m ago' },
                  { title: 'Template updated', desc: 'React starter template has been updated', time: '1h ago' },
                ].map((n, i) => (
                  <DropdownMenuItem key={i} className="flex flex-col items-start gap-0.5 py-2.5 cursor-pointer">
                    <span className="font-medium text-sm">{n.title}</span>
                    <span className="text-xs text-muted-foreground">{n.desc}</span>
                    <span className="text-xs text-muted-foreground/60">{n.time}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/app/account" className="text-xs text-center w-full justify-center text-muted-foreground">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-5 bg-border/60 mx-1" />

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar_url || '/placeholder.svg'} alt={user?.name || 'User'} />
                    <AvatarFallback className="text-xs font-medium bg-primary text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60" align="end" forceMount>
                <DropdownMenuLabel className="font-normal pb-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar_url || '/placeholder.svg'} alt={user?.name || 'User'} />
                      <AvatarFallback className="text-xs font-medium bg-primary text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-semibold leading-none truncate">{user?.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate mt-0.5">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/app" className="cursor-pointer">
                      <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/app/account" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" /> My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/app/settings" className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" /> Settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/docs" className="cursor-pointer">
                      <FileText className="h-4 w-4 mr-2" /> Documentation
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://github.com/eliascharlesshop-source/ForSure" target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center">
                      <Github className="h-4 w-4 mr-2" /> GitHub
                      <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* ── Mobile: hamburger + user avatar ── */}
          <div className="lg:hidden flex items-center gap-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar_url || '/placeholder.svg'} alt={user?.name || 'User'} />
                    <AvatarFallback className="text-xs font-medium bg-primary text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/app/account" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" /> My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/app/settings" className="cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              className="p-1.5 hover:bg-secondary rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile expanded menu ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/40 bg-card">
            <div className="px-3 py-3 space-y-3">
              {/* Nav links */}
              <nav className="flex flex-col gap-0.5">
                {NAV_LINKS.map(({ label, href, icon: Icon }) => {
                  const isActive = href === '/app' ? pathname === '/app' : pathname?.startsWith(href)
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  )
                })}
              </nav>

              <div className="h-px bg-border/40" />

              {/* Mode + New Project */}
              <div className="flex gap-2 flex-wrap">
                {onModeChange && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 gap-1.5">
                        {mode === 'design' ? <><Palette className="h-3.5 w-3.5" /> Design</> : <><Code className="h-3.5 w-3.5" /> Dev</>}
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => onModeChange('design')}>
                        <Palette className="h-4 w-4 mr-2" /> Design Mode
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onModeChange('dev')}>
                        <Code className="h-4 w-4 mr-2" /> Dev Mode
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {onNewProject && (
                  <Button variant="default" size="sm" className="h-9 gap-1.5" onClick={() => { onNewProject(); setMobileMenuOpen(false) }}>
                    <Plus className="h-3.5 w-3.5" /> New Project
                  </Button>
                )}
              </div>

              {/* Quick actions row */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={handleShare}>
                  {shareCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Share2 className="h-3.5 w-3.5" />}
                  {shareCopied ? 'Copied!' : 'Share'}
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={handleGitHub}>
                  <Github className="h-3.5 w-3.5" /> GitHub
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={handleDeploy}>
                  <Cloud className="h-3.5 w-3.5" /> Deploy
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                  <Tag className="h-3.5 w-3.5" /> {APP_VERSION}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
