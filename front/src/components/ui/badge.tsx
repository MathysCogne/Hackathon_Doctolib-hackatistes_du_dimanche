import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        vital: "bg-rose-100 text-rose-900 border border-rose-200 hover:bg-rose-200/80",
        high: "bg-amber-100 text-amber-900 border border-amber-200 hover:bg-amber-200/80",
        medium: "bg-indigo-100 text-indigo-900 border border-indigo-200 hover:bg-indigo-200/80",
        low: "bg-emerald-100 text-emerald-900 border border-emerald-200 hover:bg-emerald-200/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Optional custom className to be merged with the default styles
   */
  className?: string;
  /**
   * The variant of the badge which determines its color scheme
   */
  variant?: "default" | "vital" | "high" | "medium" | "low" | "outline";
}

/**
 * Badge component for displaying status, labels, or other short information
 * @param props - The badge props including variant and className
 * @returns A styled badge component
 */
export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

Badge.displayName = "Badge";
