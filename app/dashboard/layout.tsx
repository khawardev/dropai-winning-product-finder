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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import AIChatAssistant from '@/components/AIChatAssistant'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useSession, signOut } from '@/lib/auth-client'

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Product Finder', icon: Search, href: '/dashboard/finder' },
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
    <div className="min-h-screen bg-background text-foreground">
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 z-50",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-1 ">
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <img src="https://i.ibb.co/fJSBXLF/714d2bd0-4e86-4ac9-8720-9bdae9ab297b-removalai-preview.png" alt="DropAI Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
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
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground")} />
                  {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              {sidebarOpen && <span className="text-sm font-medium">Collapse</span>}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors mt-1"
            >
              <LogOut className="w-5 h-5" />
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
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex-1 max-w-md relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search products, suppliers..." 
              className="pl-10 bg-muted/50 border-border text-sm h-9"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
            </Button>
            <div className="h-8 w-[1px] bg-border mx-2"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground leading-none">{userName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{session?.user?.email || ''}</p>
                  </>
                )}
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>

        <AIChatAssistant />
      </main>
    </div>
  )
}
