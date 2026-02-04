import { cn } from "@/lib/utils";

type RowProps = {
	className?: string;
	children: React.ReactNode;
};

export function Row({ className, children }: RowProps) {
	return (
		<div className={cn("gap-md flex items-center", className)}>{children}</div>
	);
}

type ColumnProps = {
	className?: string;
	size: "3/4" | "1/4";
	children: React.ReactNode;
};

export function Column({ className, size, children }: ColumnProps) {
	return (
		<div
			className={cn(
				{
					"flex-[75%]": size === "3/4",
					"flex-[25%]": size === "1/4",
				},
				className,
			)}
		>
			{children}
		</div>
	);
}
