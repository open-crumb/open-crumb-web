"use client";

import { Input } from "@/ui/design/input";
import {
	IngredientContainer,
	IngredientInput,
	IngredientLabel,
} from "./IngredientLayout";
import { XIcon } from "lucide-react";
import { useId } from "react";

type Props = {
	scale: string;
	onScaleChange: (multiplier: string) => void;
	isValid: boolean;
};

export default function ScaleEditor({ scale, onScaleChange, isValid }: Props) {
	const inputID = useId();

	return (
		<IngredientContainer>
			<IngredientLabel htmlFor={inputID} isValid={isValid}>
				Scale
			</IngredientLabel>
			<IngredientInput>
				<Input
					id={inputID}
					className="text-right"
					type="number"
					value={scale}
					onChange={(event) => onScaleChange(event.target.value)}
					isValid={isValid}
					min="1"
					after={<XIcon className="h-3 w-3" />}
				/>
			</IngredientInput>
		</IngredientContainer>
	);
}
