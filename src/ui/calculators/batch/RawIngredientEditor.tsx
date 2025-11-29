import { Input } from "@/ui/design/input";
import {
	ExpandableIngredientContainer,
	ExpandableIngredientContent,
	ExpandableIngredientLabel,
	IngredientContainer,
	IngredientInput,
	IngredientLabel,
} from "@/ui/calculators/batch/IngredientLayout";
import { Button } from "@/ui/design/button";

type Props = {
	name: string;
	onNameChange: (name: string) => void;
	isNameValid: boolean;
	percent: string;
	onPercentChange: (percent: string) => void;
	isPercentValid: boolean;
	onDelete: () => void;
};

export default function RawIngredientEditor({
	name,
	onNameChange,
	isNameValid,
	percent,
	onPercentChange,
	isPercentValid,
	onDelete,
}: Props) {
	return (
		<ExpandableIngredientContainer>
			<IngredientContainer>
				<ExpandableIngredientLabel>
					<Input
						placeholder="Name"
						value={name}
						onChange={(event) => onNameChange(event.target.value)}
						isValid={isNameValid}
					/>
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
			<ExpandableIngredientContent>
				<div className="mt-md flex justify-end">
					<Button variant="destructive" onClick={() => onDelete()}>
						Delete
					</Button>
				</div>
			</ExpandableIngredientContent>
		</ExpandableIngredientContainer>
	);
}
