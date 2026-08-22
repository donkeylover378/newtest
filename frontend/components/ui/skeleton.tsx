import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md bg-[var(--muted)]",
        "bg-[length:200%_100%] animate-shimmer",
        "bg-gradient-to-r from-[var(--muted)] via-[var(--border)] to-[var(--muted)]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
