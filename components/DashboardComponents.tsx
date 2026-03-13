"use client"

import * as React from "react"
import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip"
import { Badge } from "@/components/ui/Badge"
import { Spinner } from "@/components/Spinner"

interface MetricCardProps {
  label: string
  value: React.ReactNode
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
          <Card className={cn("overflow-hidden", className)}>
            <CardContent >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                {trend && (
                  <Badge
                    variant={up === true ? "emerald" : up === false ? "destructive" : "secondary"}
                    shape="pill"
                    className="text-sm font-medium"
                  >
                    {up === true ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : up === false ? (
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                    ) : null}
                    {trend}
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">{label}</p>
                <h3 className="text-2xl font-medium text-foreground mt-1 tracking-tight">{value}</h3>
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
      <Spinner />
    </div>
  )
}
