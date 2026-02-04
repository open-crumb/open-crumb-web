"use client";

import { Input } from "@/ui/design/input";
import { useId } from "react";
import { Button } from "@/ui/design/button";
import {
	CollapsedIngredientContent,
	ExpandableIngredientContainer,
	ExpandableIngredientContent,
	ExpandableIngredientLabel,
	IngredientContainer,
	IngredientInput,
	IngredientLabel,
} from "@/ui/calculators/batch/IngredientLayout";
import { Badge } from "@/ui/design/badge";

type Props = {
	percent: string;
	onPercentChange: (percent: string) => void;
	isPercentValid: boolean;
	hydrationPercent: string;
	onHydrationPercentChange: (percent: string) => void;
	isHydrationPercentValid: boolean;
	onDelete: () => void;
};

export default function SourdoughStarterEditor({
	percent,
	onPercentChange,
	isPercentValid,
	hydrationPercent,
	onHydrationPercentChange,
	isHydrationPercentValid,
	onDelete,
}: Props) {
	const hydrationPercentInputID = useId();

	return (
		<ExpandableIngredientContainer>
			<IngredientContainer>
				<ExpandableIngredientLabel
					isValid={isPercentValid && isHydrationPercentValid}
				>
					Sourdough Starter
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
				<div className="mt-md flex justify-end">
					<Button variant="destructive" onClick={() => onDelete()}>
						Delete
					</Button>
				</div>
			</ExpandableIngredientContent>
		</ExpandableIngredientContainer>
	);
}
