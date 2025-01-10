import { Input } from "@/ui/design/input";
import {
	CollapsedIngredientContent,
	ExpandableIngredientContainer,
	ExpandableIngredientContent,
	ExpandableIngredientLabel,
	IngredientContainer,
	IngredientInput,
	IngredientLabel,
} from "@/ui/calculators/batch/IngredientLayout";
import { useId } from "react";
import { Button } from "@/ui/design/button";
import { Badge } from "@/ui/design/badge";

type Props = {
	percent: string;
	onPercentChange: (percent: string) => void;
	isPercentValid: boolean;
	hydrationPercent: string;
	onHydrationPercentChange: (percent: string) => void;
	isHydrationPercentValid: boolean;
	yeastPercent: string;
	onYeastPercentChange: (percent: string) => void;
	isYeastPercentValid: boolean;
	onDelete: () => void;
};

export default function PoolishEditor({
	percent,
	onPercentChange,
	isPercentValid,
	hydrationPercent,
	onHydrationPercentChange,
	isHydrationPercentValid,
	yeastPercent,
	onYeastPercentChange,
	isYeastPercentValid,
	onDelete,
}: Props) {
	const hydrationPercentInputID = useId();
	const yeastPercentInputID = useId();

	return (
		<ExpandableIngredientContainer>
			<IngredientContainer>
				<ExpandableIngredientLabel
					isValid={
						isPercentValid && isHydrationPercentValid && isYeastPercentValid
					}
				>
					Poolish
				</ExpandableIngredientLabel>
				<IngredientInput>
					<Input
						className="text-right"
						type="number"
						value={percent}
						onChange={(event) => onPercentChange(event.target.value)}
						isValid={isPercentValid}
						min="0"
						after="%"
					/>
				</IngredientInput>
			</IngredientContainer>
			{hydrationPercent && (
				<CollapsedIngredientContent>
					<Badge>{hydrationPercent}% Hydration</Badge>
				</CollapsedIngredientContent>
			)}
			<ExpandableIngredientContent>
				<IngredientContainer>
					<IngredientLabel htmlFor={hydrationPercentInputID}>
						Hydration
					</IngredientLabel>
					<IngredientInput>
						<Input
							id={hydrationPercentInputID}
							className="text-right"
							type="number"
							value={hydrationPercent}
							onChange={(event) => onHydrationPercentChange(event.target.value)}
							isValid={isHydrationPercentValid}
							min="0"
							after="%"
						/>
					</IngredientInput>
				</IngredientContainer>
				<IngredientContainer className="mt-md">
					<IngredientLabel htmlFor={yeastPercentInputID}>Yeast</IngredientLabel>
					<IngredientInput>
						<Input
							id={yeastPercentInputID}
							className="text-right"
							type="number"
							value={yeastPercent}
							onChange={(event) => onYeastPercentChange(event.target.value)}
							isValid={isYeastPercentValid}
							min="0"
							after="%"
						/>
					</IngredientInput>
				</IngredientContainer>
				<div className="flex justify-end mt-md">
					<Button variant="destructive" onClick={() => onDelete()}>
						Delete
					</Button>
				</div>
			</ExpandableIngredientContent>
		</ExpandableIngredientContainer>
	);
}
