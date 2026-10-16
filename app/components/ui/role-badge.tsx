import { cn } from "~/lib/cn";

/**
 * Maker and Checker are the product's central distinction, so they get a
 * dedicated component rather than ad-hoc styling.
 *
 * The label text is always rendered — colour alone must never be the only
 * carrier of meaning, or the distinction disappears for colour-blind users.
 */
export function RoleBadge({
  role,
  label,
  className,
}: {
  role: "maker" | "checker";
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-display inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        role === "maker" ? "bg-maker-soft text-maker" : "bg-checker-soft text-checker",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          role === "maker" ? "bg-maker" : "bg-checker",
        )}
      />
      {label}
    </span>
  );
}
