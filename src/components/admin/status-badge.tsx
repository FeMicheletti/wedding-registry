type StatusBadgeVariant = | "pending" | "approved" | "confirmed" | "canceled" | "available" | "completed";

type StatusBadgeProps = {
	label: string;
	variant: StatusBadgeVariant;
};

const variants: Record<StatusBadgeVariant, string> = {
	pending: "border-amber-200 bg-amber-50 text-amber-700",
	approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
	confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
	canceled: "border-red-200 bg-red-50 text-red-700",
	available: "border-blue-200 bg-blue-50 text-blue-700",
	completed: "border-violet-200 bg-violet-50 text-violet-700"
};

export function StatusBadge({ label, variant }: StatusBadgeProps) {
	return (
		<span className={`inline-flex items-centerrounded-full borderpx-2.5 py-1text-xs font-medium${variants[variant]}`}>
			{label}
		</span>
	);
}