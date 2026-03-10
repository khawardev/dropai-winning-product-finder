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
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import AIChatAssistant from '@/components/AIChatAssistant'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useSession, signOut } from '@/lib/auth-client'

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Product Finder', icon: Search, href: '/dashboard/dropai' },
  // { name: 'Saved Products', icon: Bookmark, href: '/dashboard/saved' },
  // { name: 'Supplier Library', icon: Library, href: '/dashboard/suppliers' },
  // { name: 'Reports', icon: BarChart3, href: '/dashboard/reports' },
  // { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = useSession()

  const userName = session?.user?.name || 'User'
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
          <div className="p-6 flex items-center ">
            <div className="size-9 flex items-center justify-center shrink-0">
              <img 
                src="https://i.ibb.co/fJSBXLF/714d2bd0-4e86-4ac9-8720-9bdae9ab297b-removalai-preview.png" 
                alt="DropAI Logo" 
                className="w-full h-full object-contain transition-transform group-hover:scale-110" 
              />
            </div>
            {sidebarOpen && <span className="text-xl font-bold text-foreground tracking-tight">DropAI</span>}
          </div>

          <nav className="flex-1 px-3 space-y-1 mt-4">
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

          <div className="p-4 border-t border-border space-y-1">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all group"
            >
              {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              {sidebarOpen && <span className="text-sm font-medium">Collapse</span>}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all group"
            >
              <LogOut className="size-5" />
              {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      <main 
        className={cn(
          "transition-all duration-300 min-h-screen",
          sidebarOpen ? "pl-64" : "pl-20"
        )}
      >
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex-1 max-w-md relative group">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
            <Input 
              placeholder="Search products, suppliers..." 
              className="pl-10 h-10 bg-muted/30 border-border hover:border-brand-blue/30 focus-visible:ring-1 focus-visible:ring-brand-blue/50 focus-visible:border-brand-blue text-sm rounded-xl transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all">
              <Bell className="size-5" />
              <span className="absolute top-2.5 right-2.5 size-2 bg-brand-cyan rounded-full border-2 border-background animate-pulse"></span>
            </Button>
            <div className="h-8 w-px bg-border mx-1"></div>
            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="text-right hidden sm:block">
                {isPending ? (
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <p className="text-sm font-semibold text-foreground leading-none">{userName}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-bold">Pro Plan</p>
                  </>
                )}
              </div>
              <div className="size-10 rounded-xl bg-linear-to-br from-brand-blue/10 to-brand-cyan/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue font-bold shadow-sm transition-transform group-hover:scale-105">
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
