"use client";

import { type ChangeEventHandler } from "react";
import {
	type ModeOptionUIInput,
	selectPreFerementIDs,
	useDispatch,
	useSelector,
} from "@/ui/core/calculators/batch/state";
import { Input, InputContainer, InputSlot } from "@/ui/design/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/ui/design/dropdown-menu";
import { Button } from "@/ui/design/button";
import { MoreVerticalIcon } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/ui/design/select";
import { Label } from "@/ui/design/label";
import createID from "@/lib/state-management/create-id";
import PreFermentIngredientEditor from "./PreFermentIngredientEditor";

export default function RecipeEditor() {
	const name = useSelector((state) => state.recipe.name);
	const preFermentIDs = useSelector(selectPreFerementIDs);
	const hydrationPercent = useSelector(
		(state) => state.recipe.hydrationPercent,
	);
	const mode = useSelector((state) => state.options.mode);
	const doughWeight = useSelector((state) => state.options.doughWeight);
	const flourWeight = useSelector((state) => state.options.flourWeight);
	const multiplier = useSelector((state) => state.options.multiplier);
	const dispatch = useDispatch();

	const handleNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		dispatch({
			type: "RECIPE_CHANGED",
			payload: { name: event.target.value },
		});
	};

	const handleAddPreFerment = () => {
		dispatch({
			type: "ADD_PRE_FERMENT_INGREDIENT",
			payload: { id: createID() },
		});
	};

	const handleHydrationPercentChange: ChangeEventHandler<HTMLInputElement> = (
		event,
	) => {
		dispatch({
			type: "RECIPE_CHANGED",
			payload: { hydrationPercent: event.target.value },
		});
	};

	const handleModeChange = (value: string) => {
		dispatch({
			type: "OPTIONS_CHANGED",
			payload: { mode: value as ModeOptionUIInput },
		});
	};

	const handleDoughWeightChange: ChangeEventHandler<HTMLInputElement> = (
		event,
	) => {
		dispatch({
			type: "OPTIONS_CHANGED",
			payload: { doughWeight: event.target.value },
		});
	};

	const handleFlourWeightChange: ChangeEventHandler<HTMLInputElement> = (
		event,
	) => {
		dispatch({
			type: "OPTIONS_CHANGED",
			payload: { flourWeight: event.target.value },
		});
	};

	const handleMultiplierChange: ChangeEventHandler<HTMLInputElement> = (
		event,
	) => {
		dispatch({
			type: "OPTIONS_CHANGED",
			payload: { multiplier: event.target.value },
		});
	};

	return (
		<div className="grid gap-md">
			<div className="flex gap-md">
				<Input
					className="flex-1"
					placeholder="Recipe Name"
					value={name}
					onChange={handleNameChange}
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="icon">
							<MoreVerticalIcon className="w-4 h-4" />
							<span className="sr-only">Actions</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={handleAddPreFerment}>
							Add Pre-Ferment
						</DropdownMenuItem>
						<DropdownMenuItem>Add Flour</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<Label>
				Hydration
				<InputContainer className="mt-2">
					<Input
						type="number"
						className="pr-8"
						value={hydrationPercent}
						onChange={handleHydrationPercentChange}
					/>
					<InputSlot className="right-3" aria-label="percent">
						%
					</InputSlot>
				</InputContainer>
			</Label>
			{preFermentIDs.length > 0 && <h2>Pre-Ferments</h2>}
			{preFermentIDs.map((id) => (
				<PreFermentIngredientEditor id={id} />
			))}
			<h2>Options</h2>
			<div>
				<Select value={mode} onValueChange={handleModeChange}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="BY_DOUGH_WEIGHT">By Dough Weight</SelectItem>
						<SelectItem value="BY_FLOUR_WEIGHT">By Flour Weight</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="flex gap-md">
				{mode === "BY_DOUGH_WEIGHT" && (
					<Label className="flex-[2]">
						Dough Weight
						<InputContainer className="mt-sm">
							<Input
								className="pr-8"
								type="number"
								min="0"
								value={doughWeight}
								onChange={handleDoughWeightChange}
							/>
							<InputSlot className="right-4" aria-label="grams">
								g
							</InputSlot>
						</InputContainer>
					</Label>
				)}
				{mode === "BY_FLOUR_WEIGHT" && (
					<Label className="flex-[2]">
						Flour Weight
						<InputContainer className="mt-sm">
							<Input
								className="pr-8"
								type="number"
								min="0"
								value={flourWeight}
								onChange={handleFlourWeightChange}
							/>
							<InputSlot className="right-4" aria-label="grams">
								g
							</InputSlot>
						</InputContainer>
					</Label>
				)}
				<Label className="flex-[1]">
					Multiplier
					<Input
						className="mt-sm"
						type="number"
						min="1"
						value={multiplier}
						onChange={handleMultiplierChange}
					/>
				</Label>
			</div>
			<div className="flex justify-end">
				<Button>Calculate</Button>
			</div>
		</div>
	);
}
