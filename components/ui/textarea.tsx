import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-sm border border-input bg-transparent px-3.5 py-2.5 text-base leading-relaxed text-foreground transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-muted-foreground hover:border-foreground/50 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
