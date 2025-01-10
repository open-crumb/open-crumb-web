"use client";

import { type ModeUIInput } from "@/ui/calculators/batch/ui-state";
import { Input } from "@/ui/design/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/ui/design/select";
import {
	IngredientContainer,
	IngredientInput,
	IngredientLabel,
} from "@/ui/calculators/batch/IngredientLayout";

type Props = {
	mode: ModeUIInput;
	onModeChange: (mode: ModeUIInput) => void;
	doughWeight: string;
	onDoughWeightChange: (doughWeight: string) => void;
	isDoughWeightValid: boolean;
	flourWeight: string;
	onFlourWeightChange: (flourWeight: string) => void;
	isFlourWeightValid: boolean;
};

export default function ModeEditor({
	mode,
	onModeChange,
	doughWeight,
	onDoughWeightChange,
	isDoughWeightValid,
	flourWeight,
	onFlourWeightChange,
	isFlourWeightValid,
}: Props) {
	return (
		<IngredientContainer>
			<IngredientLabel>
				<Select
					value={mode}
					onValueChange={(value) => onModeChange(value as ModeUIInput)}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="BY_DOUGH_WEIGHT">Dough Weight</SelectItem>
						<SelectItem value="BY_FLOUR_WEIGHT">Flour Weight</SelectItem>
					</SelectContent>
				</Select>
			</IngredientLabel>
			<IngredientInput>
				{mode === "BY_DOUGH_WEIGHT" && (
					<Input
						className="text-right"
						value={doughWeight}
						onChange={(event) => onDoughWeightChange(event.target.value)}
						isValid={isDoughWeightValid}
						min="0"
						after="g"
					/>
				)}
				{mode === "BY_FLOUR_WEIGHT" && (
					<Input
						className="text-right"
						value={flourWeight}
						onChange={(event) => onFlourWeightChange(event.target.value)}
						isValid={isFlourWeightValid}
						min="0"
						after="g"
					/>
				)}
			</IngredientInput>
		</IngredientContainer>
	);
}
