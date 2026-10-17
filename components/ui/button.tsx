import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonStyles = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-sm border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-[background-color,border-color,color,transform] duration-250 ease-luxe select-none active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      // Uppercase labels are reserved for the three solid/outlined actions.
      variant: {
        default:
          'bg-primary text-primary-foreground uppercase tracking-[0.12em] text-[0.8125rem] hover:bg-primary/85',
        outline:
          'border-primary bg-transparent text-foreground uppercase tracking-[0.12em] text-[0.8125rem] hover:bg-primary hover:text-primary-foreground aria-expanded:bg-primary aria-expanded:text-primary-foreground',
        secondary:
          'bg-secondary text-secondary-foreground uppercase tracking-[0.12em] text-[0.8125rem] hover:bg-secondary/85 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'text-foreground hover:bg-muted aria-expanded:bg-muted',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:outline-destructive',
        link: 'link-inline text-foreground',
      },
      size: {
        default:
          'h-11 gap-2 px-6 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5',
        xs: "h-8 gap-1.5 px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-9 gap-1.5 px-4 text-[0.8125rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-[3.25rem] gap-2.5 px-8 has-data-[icon=inline-end]:pr-7 has-data-[icon=inline-start]:pl-7',
        icon: 'size-11',
        'icon-xs': "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        'icon-sm': 'size-9',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

/** cva не розв’язує конфлікти класів (border-transparent vs border-primary), тому пропускаємо результат через cn. */
const buttonVariants = (props?: Parameters<typeof buttonStyles>[0]) => cn(buttonStyles(props))

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
