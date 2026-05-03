import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "outline" | "teal" | "ghost";

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const PillButton = forwardRef<HTMLButtonElement, PillButtonProps>(
  ({ className, variant = "outline", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center px-7 py-3 rounded-full text-sm font-medium tracking-wide transition-all active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none";

    const variants: Record<Variant, string> = {
      outline:
        "border border-foreground/80 text-foreground hover:bg-foreground hover:text-background",
      teal: "bg-teal text-background hover:brightness-110 glow-teal",
      ghost: "text-muted-foreground hover:text-foreground",
    };

    return (
      <button ref={ref} className={cn(base, variants[variant], className)} {...props} />
    );
  }
);
PillButton.displayName = "PillButton";
