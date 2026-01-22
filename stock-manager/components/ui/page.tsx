
import * as React from "react"

import { cn } from "@/lib/utils"

function Page({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page"
      className={cn("space-y-6 p-6", className)}
      {...props}
    />
  )
}

function PageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
}

function PageTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="page-title"
      className={cn("text-2xl font-bold tracking-tight", className)}
      {...props}
    />
  )
}

function PageDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export { Page, PageDescription, PageHeader, PageTitle }
