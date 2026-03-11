"use client"

import * as React from "react"
import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip"

interface MetricCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
  up?: boolean
  description?: string
  className?: string
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  up,
  description,
  className,
}: MetricCardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={cn("bg-card border-border overflow-hidden", className)}>
            <CardContent >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                {trend && (
                  <div
                    className={cn(
                      "flex items-center text-xs font-medium px-2 py-1 rounded-full",
                      up === true
                        ? "bg-emerald-500/10 text-emerald-500"
                        : up === false
                        ? "bg-rose-500/10 text-rose-500"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {up === true ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : up === false ? (
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                    ) : null}
                    {trend}
                  </div>
                )}
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">{label}</p>
                <h3 className="text-2xl font-bold text-foreground mt-1 font-mono">{value}</h3>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        {description && (
          <TooltipContent>
            <p>{description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}
