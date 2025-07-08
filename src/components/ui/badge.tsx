import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        active:"border-transparent bg-[#BFF1D3] text-[#008236] shadow hover:bg-[#EAF0E9]/80",
        inactive:" border-transparent bg-[#DCDCDE] text-[#3F3F47] shadow hover:bg-[#DCDCDE]/80",
        suspended:" border-transparent bg-[#BFEEE9] text-[#00786F] shadow hover:bg-[#BFEEE9]/80",
        pending:" border-transparent bg-[#FFF1CC] text-[#BB4D00] shadow hover:bg-[#FFF1CC]/80",
        blacklisted:" border-transparent bg-[#FECACD] text-[#C10007] shadow hover:bg-[#FECACD]/80",
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
