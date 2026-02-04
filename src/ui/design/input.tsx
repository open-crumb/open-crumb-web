import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	isValid?: boolean;
	ref?: React.RefObject<HTMLInputElement>;
	after?: React.ReactNode;
};

export function Input({
	isValid = true,
	className,
	after,
	...props
}: InputProps) {
	return (
		<div className={cn("relative")}>
			<input
				className={cn(
					"bg-background ring-offset-background placeholder:text-muted-foreground h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
					{
						"border-input": isValid,
						"focus-visible:ring-ring": isValid,
						"border-destructive": !isValid,
						"focus-visible:ring-destructive": !isValid,
						"pr-6": after,
					},
					className,
				)}
				{...props}
			/>
			{after && (
				<div className="text-muted-foreground absolute top-[50%] right-2 -translate-y-[50%]">
					{after}
				</div>
			)}
		</div>
	);
}
