import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-md ',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow',
        muted: 'bg-muted text-muted-foreground hover:bg-muted/80',
        ghost: 'hover:bg-accent/50 hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        glass:
          'bg-white/80 backdrop-blur-sm border border-white/20 text-foreground shadow-sm hover:bg-white/90 hover:shadow-md',
        glassColored:
          'bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary hover:bg-primary/20 hover:shadow-md',
        gradient:
          'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow hover:shadow-lg ',
        modern:
          'bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:translate-y-[-2px] active:translate-y-0 active:shadow-sm',
        soft: 'bg-primary/10 text-primary hover:bg-primary/20',
        bordered:
          'border-2 border-primary bg-transparent text-primary shadow-sm hover:bg-primary/10',
        elevated:
          'bg-white text-slate-800 shadow-md hover:shadow-lg  transition-all',
        transparent: 'bg-transparent text-current hover:bg-black/5',
        accent: 'bg-accent text-accent-foreground shadow-sm hover:bg-accent/90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-md px-8 text-base',
        xl: 'h-14 rounded-md px-10 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
      rounded: {
        default: 'rounded-md',
        full: 'rounded-full',
        none: 'rounded-none',
        sm: 'rounded-sm',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
