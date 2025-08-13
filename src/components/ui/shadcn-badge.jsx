import * as React from "react";
import { cn } from "../../../lib/utils";

const Badge = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          {
            "border-transparent bg-primary text-primary-foreground":
              variant === "default",
            "border-transparent bg-secondary text-secondary-foreground":
              variant === "secondary",
            "border-transparent bg-destructive text-destructive-foreground":
              variant === "destructive",
            "border-transparent bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100":
              variant === "success",
            "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100":
              variant === "warning",
            "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100":
              variant === "info",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
