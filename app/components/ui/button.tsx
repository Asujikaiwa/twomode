import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "~/lib/cn";

const button = cva(
  // min-h-11 is 44px — the WCAG 2.1 AA touch target floor, applied to every
  // size so a "small" button never becomes untappable on a phone.
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-maker text-white hover:bg-maker/90",
        checker: "bg-checker text-white hover:bg-checker/90",
        outline:
          "border border-border-strong bg-ground text-ink hover:bg-surface hover:border-maker",
        ghost: "text-ink-2 hover:bg-surface hover:text-ink",
      },
      size: {
        sm: "px-3 text-sm",
        md: "px-5 text-sm",
        lg: "px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof button> & {
    /** Render as a child element (e.g. a <Link>) while keeping button styles. */
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(button({ variant, size }), className)} {...props} />;
}

export { button as buttonVariants };
