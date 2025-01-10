"use client";

import { Input } from "@/ui/design/input";
import { useId } from "react";
import {
	IngredientContainer,
	IngredientInput,
	IngredientLabel,
} from "@/ui/calculators/batch/IngredientLayout";

type Props = {
	percent: string;
	onPercentChange: (percent: string) => void;
	isValid: boolean;
};

export default function SaltPercentEditor({
	percent,
	onPercentChange,
	isValid,
}: Props) {
	const inputID = useId();

	return (
		<IngredientContainer>
			<IngredientLabel htmlFor={inputID} isValid={isValid}>
				Salt
			</IngredientLabel>
			<IngredientInput>
				<Input
					id={inputID}
					className="text-right"
					type="number"
					value={percent}
					onChange={(event) => onPercentChange(event.target.value)}
					isValid={isValid}
					min="0"
					after="%"
				/>
			</IngredientInput>
		</IngredientContainer>
	);
}
