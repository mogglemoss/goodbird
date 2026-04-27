import { BirdSilhouette } from "./BirdSilhouette";
import { cn } from "@/lib/cn";

interface Props {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: { wrap: "gap-0", bird: "h-5 w-auto", text: "text-xl -ms-0.5" },
  md: { wrap: "gap-0", bird: "h-7 w-auto", text: "text-2xl -ms-0.5" },
  lg: { wrap: "gap-0", bird: "h-10 w-auto", text: "text-4xl -ms-1" },
};

export function Wordmark({ size = "sm", className }: Props) {
  const s = SIZES[size];
  return (
    <div
      className={cn(
        "inline-flex items-baseline text-(--color-moss-700)",
        s.wrap,
        className,
      )}
      aria-label="goodbird"
    >
      <BirdSilhouette className={cn("translate-y-[3px]", s.bird)} title="" />
      <span className={cn("font-display font-medium leading-none tracking-tight", s.text)}>
        goodbird
      </span>
    </div>
  );
}
