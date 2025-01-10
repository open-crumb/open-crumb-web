"use client";

import {
	selectCanAddPreFerment,
	selectCanAddScald,
	selectCanProceed,
	selectIsDoughWeightValid,
	selectIsFlourWeightValid,
	selectIsScaleValid,
	selectIsSaltPercentValid,
	selectIsTargetHydrationPercentValid,
	selectPreFermentID,
	selectRawIngredientIDs,
	selectScaldID,
	useStore,
} from "@/ui/calculators/batch/ui-state";
import NameEditor from "@/ui/calculators/batch/NameEditor";
import TargetHydrationPercentEditor from "@/ui/calculators/batch/TargetHydrationPercentEditor";
import SaltPercentEditor from "@/ui/calculators/batch/SaltPercentEditor";
import Ingredient from "@/ui/calculators/batch/Ingredient";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/ui/design/dropdown-menu";
import { Button } from "@/ui/design/button";
import { useShallow } from "zustand/shallow";
import ModeEditor from "@/ui/calculators/batch/ModeEditor";
import ScaleEditor from "@/ui/calculators/batch/ScaleEditor";

export default function BatchCalculatorEditor() {
	const name = useStore((state) => state.name);
	const setName = useStore((state) => state.setName);
	const targetHydrationPercent = useStore(
		(state) => state.targetHydrationPercent,
	);
	const isTargetHydrationPercentValid = useStore(
		selectIsTargetHydrationPercentValid,
	);
	const setTargetHydrationPercent = useStore(
		(state) => state.setTargetHydrationPercent,
	);
	const saltPercent = useStore((state) => state.saltPercent);
	const isSaltPercentValid = useStore(selectIsSaltPercentValid);
	const setSaltPercent = useStore((state) => state.setSaltPercent);
	const preFermentID = useStore(selectPreFermentID);
	const scaldID = useStore(selectScaldID);
	const ingredientIDs = useStore(useShallow(selectRawIngredientIDs));
	const canAddPreFerment = useStore(selectCanAddPreFerment);
	const canAddScald = useStore(selectCanAddScald);
	const addSourdoughStarter = useStore((state) => state.addSourdoughStarter);
	const addPoolish = useStore((state) => state.addPoolish);
	const addBiga = useStore((state) => state.addBiga);
	const addScald = useStore((state) => state.addScald);
	const addRawIngredient = useStore((state) => state.addRawIngredient);
	const mode = useStore((state) => state.mode);
	const setMode = useStore((state) => state.setMode);
	const doughWeight = useStore((state) => state.doughWeight);
	const isDoughWeightValid = useStore(selectIsDoughWeightValid);
	const setDoughWeight = useStore((state) => state.setDoughWeight);
	const flourWeight = useStore((state) => state.flourWeight);
	const isFlourWeightValid = useStore(selectIsFlourWeightValid);
	const setFlourWeight = useStore((state) => state.setFlourWeight);
	const scale = useStore((state) => state.scale);
	const isScaleValid = useStore(selectIsScaleValid);
	const setScale = useStore((state) => state.setScale);
	const canProceed = useStore(selectCanProceed);
	const setStep = useStore((state) => state.setStep);

	return (
		<div className="flex flex-col gap-md">
			<NameEditor name={name} onNameChange={setName} />
			<TargetHydrationPercentEditor
				percent={targetHydrationPercent}
				onPercentChange={setTargetHydrationPercent}
				isValid={isTargetHydrationPercentValid}
			/>
			<SaltPercentEditor
				percent={saltPercent}
				onPercentChange={setSaltPercent}
				isValid={isSaltPercentValid}
			/>
			{preFermentID && <Ingredient id={preFermentID} />}
			{scaldID && <Ingredient id={scaldID} />}
			{ingredientIDs.map((id) => (
				<Ingredient key={id} id={id} />
			))}
			<div className="flex justify-end">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button>Add</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{canAddPreFerment && (
							<DropdownMenuItem onSelect={() => addSourdoughStarter()}>
								Sourdough Starter
							</DropdownMenuItem>
						)}
						{canAddPreFerment && (
							<DropdownMenuItem onSelect={() => addPoolish()}>
								Poolish
							</DropdownMenuItem>
						)}
						{canAddPreFerment && (
							<DropdownMenuItem onSelect={() => addBiga()}>
								Biga
							</DropdownMenuItem>
						)}
						{canAddScald && (
							<DropdownMenuItem onSelect={() => addScald()}>
								Scald
							</DropdownMenuItem>
						)}
						<DropdownMenuItem onSelect={() => addRawIngredient()}>
							Ingredient
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<ModeEditor
				mode={mode}
				onModeChange={setMode}
				doughWeight={doughWeight}
				onDoughWeightChange={setDoughWeight}
				isDoughWeightValid={isDoughWeightValid}
				flourWeight={flourWeight}
				onFlourWeightChange={setFlourWeight}
				isFlourWeightValid={isFlourWeightValid}
			/>
			<ScaleEditor
				scale={scale}
				onScaleChange={setScale}
				isValid={isScaleValid}
			/>
			<div className="flex justify-end">
				<Button disabled={!canProceed} onClick={() => setStep("RESULT")}>
					Next
				</Button>
			</div>
		</div>
	);
}
