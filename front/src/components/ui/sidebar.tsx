import * as React from "react"
import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}>({
  isOpen: true,
  setIsOpen: () => null,
})

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = React.useContext(SidebarContext)

  return (
    <div
      className={cn(
        "fixed left-4 top-4 z-40 h-[calc(100vh-32px)] w-60 -translate-x-full rounded-2xl border border-gray-800/50 bg-gray-900/95 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm transition-all duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
    >
      {children}
    </div>
  )
}

export function SidebarHeader({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex h-14 items-center border-b border-gray-800/50 px-6", className)}>
      {children}
    </div>
  )
}

export function SidebarContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-auto px-4 py-4 text-gray-100", className)}>
      {children}
    </div>
  )
}

export function SidebarFooter({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-t border-gray-800/50 p-4", className)}>
      {children}
    </div>
  )
}

export function SidebarGroup({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1", className)}>
      {children}
    </div>
  )
}

export function SidebarTrigger() {
  const { isOpen, setIsOpen } = React.useContext(SidebarContext)

  return (
    <button
      className="fixed left-6 top-6 z-50 rounded-xl bg-gray-800 p-2 text-gray-100 shadow-[0_4px_12px_rgb(0,0,0,0.1)] transition-all duration-200 hover:bg-gray-700 hover:shadow-[0_4px_16px_rgb(0,0,0,0.15)]"
      onClick={() => setIsOpen(!isOpen)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  )
} 