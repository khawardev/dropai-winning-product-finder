'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Search,
  Bookmark,
  Library,
  BarChart3,
  Settings,
  Bell,
  Menu,
  X,
  Zap,
  SearchIcon,
  LogOut,
} from 'lucide-react'
import { Spinner, ButtonSpinner } from '@/components/Spinner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import AIChatAssistant from '@/components/AIChatAssistant'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Logo } from '@/components/Logo'
import { useSession, signOut } from '@/lib/auth-client'

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Product Finder', icon: Search, href: '/dashboard/dropai' },
  { name: 'Saved Products', icon: Bookmark, href: '/dashboard/saved' },
  { name: 'Supplier Library', icon: Library, href: '/dashboard/suppliers' },
  { name: 'Reports', icon: BarChart3, href: '/dashboard/reports' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = useSession()

  const userName = session?.user?.name || 'User'
  const userEmail = session?.user?.email || 'User'
  const userInitials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand-blue/30">
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-card/50 border-r border-border transition-all duration-300 z-50 backdrop-blur-xl",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center ">
            <Logo
              showText={sidebarOpen}
            />
          </div>

          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                    isActive
                      ? "bg-linear-to-r from-brand-blue/10 to-brand-cyan/10 text-brand-blue border border-brand-blue/20"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
                  )}
                >
                  <item.icon className={cn("size-5 shrink-0 transition-colors", isActive ? "text-brand-blue" : "text-muted-foreground group-hover:text-foreground")} />
                  {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-border space-y-2">
            <Button
              variant="ghost"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center justify-start gap-3 w-full"
            >
              {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              {sidebarOpen && <span className="text-sm font-medium">Collapse</span>}
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center justify-start gap-3 w-full hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-5" />
              {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      <main
        className={cn(
          "transition-all duration-300 min-h-screen",
          sidebarOpen ? "pl-64" : "pl-20"
        )}
      >
        <header className="h-16 border-b gap-4 border-border bg-background/50 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
          <Input
            placeholder="Search products, suppliers..."
            icon={<SearchIcon className="size-4" />}
          />

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="h-8 w-px bg-border mx-1"></div>
            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="text-right hidden sm:block">
                {isPending ? (
                  <Spinner />
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground leading-none">{userName}</p>
                    <p className="text-sm text-muted-foreground mt-1">{userEmail}</p>
                  </>
                )}
              </div>
              <div className="size-10 rounded-xl bg-linear-to-br from-brand-blue/10 to-brand-cyan/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue font-medium shadow-sm transition-transform group-hover:scale-105">
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 pb-24">
          {children}
        </div>

        <AIChatAssistant />
      </main>
    </div>
  )
}
