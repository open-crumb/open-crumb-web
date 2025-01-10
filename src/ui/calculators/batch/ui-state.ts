import { create } from "zustand";
import { nanoid } from "nanoid";
import { arrayOmit } from "@/lib/array";
import { objectOmit } from "@/lib/object";
import assertUnreachable from "@/lib/assertUnreachable";
import {
	calculateDoughBatch,
	type CalculateDoughBatchResult,
} from "@/lib/calculators/dough";

export type ID = string;
export type Step = "EDIT" | "RESULT";
export type ModeUIInput = "BY_DOUGH_WEIGHT" | "BY_FLOUR_WEIGHT";

export type SourdoughStarterUIInput = {
	type: "SourdoughStarter";
	id: ID;
	percent: string;
	hydrationPercent: string;
};

export type PoolishUIInput = {
	type: "Poolish";
	id: ID;
	percent: string;
	hydrationPercent: string;
	yeastPercent: string;
};

export type BigaUIInput = {
	type: "Biga";
	id: ID;
	percent: string;
	hydrationPercent: string;
	yeastPercent: string;
};

export type ScaldUIInput = {
	type: "Scald";
	id: ID;
	percent: string;
	hydrationPercent: string;
};

export type RawIngredientUIInput = {
	type: "RawIngredient";
	id: ID;
	name: string;
	percent: string;
};

export type IngredientUIInput =
	| SourdoughStarterUIInput
	| BigaUIInput
	| PoolishUIInput
	| ScaldUIInput
	| RawIngredientUIInput;

export type State = {
	step: Step;
	name: string;
	targetHydrationPercent: string;
	saltPercent: string;
	ingredientIDs: ID[];
	ingredientsByID: Record<ID, IngredientUIInput>;
	mode: ModeUIInput;
	doughWeight: string;
	flourWeight: string;
	scale: string;
	setStep: (step: Step) => void;
	setName: (name: string) => void;
	setTargetHydrationPercent: (percent: string) => void;
	setSaltPercent: (percent: string) => void;
	setMode: (mode: ModeUIInput) => void;
	setDoughWeight: (weight: string) => void;
	setFlourWeight: (weight: string) => void;
	setScale: (Scale: string) => void;
	addSourdoughStarter: () => void;
	setSourdoughStarter: (options: {
		id: ID;
		percent?: string;
		hydrationPercent?: string;
	}) => void;
	addPoolish: () => void;
	setPoolish: (options: {
		id: ID;
		percent?: string;
		hydrationPercent?: string;
		yeastPercent?: string;
	}) => void;
	addBiga: () => void;
	setBiga: (options: {
		id: ID;
		percent?: string;
		hydrationPercent?: string;
		yeastPercent?: string;
	}) => void;
	addScald: () => void;
	setScald: (options: {
		id: ID;
		percent?: string;
		hydrationPercent?: string;
	}) => void;
	addRawIngredient: () => void;
	setRawIngredient: (options: {
		id: ID;
		name?: string;
		percent?: string;
	}) => void;
	deleteIngredient: (id: ID) => void;
};

export const useStore = create<State>((set) => ({
	step: "EDIT",
	name: "",
	targetHydrationPercent: "80",
	saltPercent: "2",
	ingredientIDs: [],
	ingredientsByID: {},
	mode: "BY_DOUGH_WEIGHT",
	doughWeight: "800",
	flourWeight: "500",
	scale: "1",
	setStep: (step) => set({ step }),
	setName: (name) => set({ name }),
	setTargetHydrationPercent: (percent) =>
		set({ targetHydrationPercent: percent }),
	setSaltPercent: (percent) => set({ saltPercent: percent }),
	setMode: (mode) => set({ mode }),
	setDoughWeight: (weight) => set({ doughWeight: weight }),
	setFlourWeight: (weight) => set({ flourWeight: weight }),
	setScale: (scale) => set({ scale }),
	addSourdoughStarter: () =>
		set((state) => {
			const id = nanoid();

			return {
				ingredientIDs: [...state.ingredientIDs, id],
				ingredientsByID: {
					...state.ingredientsByID,
					[id]: {
						type: "SourdoughStarter",
						id,
						percent: "20",
						hydrationPercent: "100",
					},
				},
			};
		}),
	setSourdoughStarter: (options) =>
		set((state) => {
			const ingredient = state.ingredientsByID[options.id];

			return {
				ingredientsByID: {
					...state.ingredientsByID,
					[options.id]:
						ingredient.type === "SourdoughStarter"
							? {
									...ingredient,
									...options,
								}
							: ingredient,
				},
			};
		}),
	addPoolish: () =>
		set((state) => {
			const id = nanoid();

			return {
				ingredientIDs: [...state.ingredientIDs, id],
				ingredientsByID: {
					...state.ingredientsByID,
					[id]: {
						type: "Poolish",
						id,
						percent: "40",
						hydrationPercent: "100",
						yeastPercent: "0.25",
					},
				},
			};
		}),
	setPoolish: (options) =>
		set((state) => {
			const ingredient = state.ingredientsByID[options.id];

			return {
				ingredientsByID: {
					...state.ingredientsByID,
					[options.id]:
						ingredient.type === "Poolish"
							? {
									...ingredient,
									...options,
								}
							: ingredient,
				},
			};
		}),
	addBiga: () =>
		set((state) => {
			const id = nanoid();

			return {
				ingredientIDs: [...state.ingredientIDs, id],
				ingredientsByID: {
					...state.ingredientsByID,
					[id]: {
						type: "Biga",
						id,
						percent: "50",
						hydrationPercent: "50",
						yeastPercent: "0.25",
					},
				},
			};
		}),
	setBiga: (options) =>
		set((state) => {
			const ingredient = state.ingredientsByID[options.id];

			return {
				ingredientsByID: {
					...state.ingredientsByID,
					[options.id]:
						ingredient.type === "Biga"
							? {
									...ingredient,
									...options,
								}
							: ingredient,
				},
			};
		}),
	addScald: () =>
		set((state) => {
			const id = nanoid();

			return {
				ingredientIDs: [...state.ingredientIDs, id],
				ingredientsByID: {
					...state.ingredientsByID,
					[id]: {
						type: "Scald",
						id,
						percent: "30",
						hydrationPercent: "400",
					},
				},
			};
		}),
	setScald: (options) =>
		set((state) => {
			const ingredient = state.ingredientsByID[options.id];

			return {
				ingredientsByID: {
					...state.ingredientsByID,
					[options.id]:
						ingredient.type === "Scald"
							? {
									...ingredient,
									...options,
								}
							: ingredient,
				},
			};
		}),
	addRawIngredient: () =>
		set((state) => {
			const id = nanoid();

			return {
				ingredientIDs: [...state.ingredientIDs, id],
				ingredientsByID: {
					...state.ingredientsByID,
					[id]: {
						type: "RawIngredient",
						id,
						name: "",
						percent: "",
					},
				},
			};
		}),
	setRawIngredient: (options) =>
		set((state) => {
			const ingredient = state.ingredientsByID[options.id];

			return {
				ingredientsByID: {
					...state.ingredientsByID,
					[options.id]:
						ingredient.type === "RawIngredient"
							? {
									...ingredient,
									...options,
								}
							: ingredient,
				},
			};
		}),
	deleteIngredient: (id) =>
		set((state) => ({
			ingredientIDs: arrayOmit(state.ingredientIDs, id),
			ingredientsByID: objectOmit(state.ingredientsByID, id),
		})),
}));

const preFerments = new Set(["SourdoughStarter", "Poolish", "Biga"]);

export function selectPreFermentID(state: State): ID | null {
	return (
		state.ingredientIDs.find((id) =>
			preFerments.has(state.ingredientsByID[id].type),
		) || null
	);
}

export function selectScaldID(state: State): ID | null {
	return (
		state.ingredientIDs.find(
			(id) => state.ingredientsByID[id].type === "Scald",
		) || null
	);
}

export function selectRawIngredientIDs(state: State): ID[] {
	return state.ingredientIDs.filter(
		(id) => state.ingredientsByID[id].type === "RawIngredient",
	);
}

export function selectCanAddPreFerment(state: State): boolean {
	return !state.ingredientIDs.some((id) =>
		preFerments.has(state.ingredientsByID[id].type),
	);
}

export function selectCanAddScald(state: State): boolean {
	return !state.ingredientIDs.some(
		(id) => state.ingredientsByID[id].type === "Scald",
	);
}

export function selectIsTargetHydrationPercentValid(state: State): boolean {
	return Number.isFinite(parseFloat(state.targetHydrationPercent));
}

export function selectIsSaltPercentValid(state: State): boolean {
	return Number.isFinite(parseFloat(state.saltPercent));
}

export function selectIsDoughWeightValid(state: State): boolean {
	return Number.isFinite(parseFloat(state.doughWeight));
}

export function selectIsFlourWeightValid(state: State): boolean {
	return Number.isFinite(parseFloat(state.flourWeight));
}

export function selectIsScaleValid(state: State): boolean {
	return Number.isFinite(parseFloat(state.scale));
}

type IngredientError =
	| "PercentInvalidError"
	| "HydrationPercentInvalidError"
	| "YeastPercentInvalidError"
	| "NameInvalidError";

export function selectIngredientErrors(
	state: State,
	id: ID,
): IngredientError[] {
	const ingredient = state.ingredientsByID[id];
	const errors: IngredientError[] = [];

	switch (ingredient.type) {
		case "SourdoughStarter":
			if (!Number.isFinite(parseFloat(ingredient.percent))) {
				errors.push("PercentInvalidError");
			}

			if (!Number.isFinite(parseFloat(ingredient.hydrationPercent))) {
				errors.push("HydrationPercentInvalidError");
			}

			break;
		case "Poolish":
			if (!Number.isFinite(parseFloat(ingredient.percent))) {
				errors.push("PercentInvalidError");
			}

			if (!Number.isFinite(parseFloat(ingredient.hydrationPercent))) {
				errors.push("HydrationPercentInvalidError");
			}

			if (!Number.isFinite(parseFloat(ingredient.yeastPercent))) {
				errors.push("YeastPercentInvalidError");
			}

			break;
		case "Biga":
			if (!Number.isFinite(parseFloat(ingredient.percent))) {
				errors.push("PercentInvalidError");
			}

			if (!Number.isFinite(parseFloat(ingredient.hydrationPercent))) {
				errors.push("HydrationPercentInvalidError");
			}

			if (!Number.isFinite(parseFloat(ingredient.yeastPercent))) {
				errors.push("YeastPercentInvalidError");
			}

			break;
		case "Scald":
			if (!Number.isFinite(parseFloat(ingredient.percent))) {
				errors.push("PercentInvalidError");
			}

			if (!Number.isFinite(parseFloat(ingredient.hydrationPercent))) {
				errors.push("HydrationPercentInvalidError");
			}

			break;
		case "RawIngredient":
			if (!ingredient.name) {
				errors.push("NameInvalidError");
			}

			if (!Number.isFinite(parseFloat(ingredient.percent))) {
				errors.push("PercentInvalidError");
			}

			break;
		default:
			assertUnreachable(ingredient);
	}

	return errors;
}

export function selectCanProceed(state: State): boolean {
	if (!selectIsTargetHydrationPercentValid(state)) {
		return false;
	}

	if (!selectIsSaltPercentValid(state)) {
		return false;
	}

	for (const id of state.ingredientIDs) {
		const errors = selectIngredientErrors(state, id);

		if (errors.length > 0) {
			return false;
		}
	}

	if (state.mode === "BY_DOUGH_WEIGHT" && !selectIsDoughWeightValid(state)) {
		return false;
	}

	if (state.mode === "BY_FLOUR_WEIGHT" && !selectIsFlourWeightValid(state)) {
		return false;
	}

	if (!selectIsScaleValid(state)) {
		return false;
	}

	return true;
}

type IngredientResult =
	| {
			type: "SourdoughStarter";
			id: ID;
			weight: number;
			flourWeight: number;
			waterWeight: number;
			hydrationPercent: number;
	  }
	| {
			type: "Poolish";
			id: ID;
			weight: number;
			flourWeight: number;
			waterWeight: number;
			yeastWeight: number;
			hydrationPercent: number;
	  }
	| {
			type: "Biga";
			id: ID;
			weight: number;
			flourWeight: number;
			waterWeight: number;
			yeastWeight: number;
			hydrationPercent: number;
	  }
	| {
			type: "Scald";
			id: ID;
			weight: number;
			flourWeight: number;
			waterWeight: number;
	  }
	| {
			type: "RawIngredient";
			id: ID;
			name: string;
			weight: number;
	  };

export function selectPreFerment(
	state: State,
): SourdoughStarterUIInput | PoolishUIInput | BigaUIInput | null {
	for (const id of state.ingredientIDs) {
		const ingredient = state.ingredientsByID[id];

		switch (ingredient.type) {
			case "SourdoughStarter":
			case "Poolish":
			case "Biga":
				return ingredient;
			default:
				continue;
		}
	}

	return null;
}

export function selectScald(state: State): ScaldUIInput | null {
	for (const id of state.ingredientIDs) {
		const ingredient = state.ingredientsByID[id];

		switch (ingredient.type) {
			case "Scald":
				return ingredient;
			default:
				continue;
		}
	}

	return null;
}

export function selectRawIngredients(state: State): RawIngredientUIInput[] {
	return state.ingredientIDs
		.map((id) => state.ingredientsByID[id])
		.filter((ingredient) => ingredient.type === "RawIngredient");
}

export function selectResult(state: State): CalculateDoughBatchResult {
	const scale = parseFloat(state.scale);
	const totalHydrationPercent = parseFloat(state.targetHydrationPercent);
	const preFerment = selectPreFerment(state);
	const scald = selectScald(state);
	const rawIngredients = selectRawIngredients(state);
	const inclusionDoughs = [
		...(preFerment
			? [
					{
						id: preFerment.id,
						name: (() => {
							switch (preFerment.type) {
								case "SourdoughStarter":
									return "Sourdough Starter";
								case "Biga":
									return "Biga";
								case "Poolish":
									return "Poolish";
								default:
									assertUnreachable(preFerment);
							}
						})(),
						percent: parseFloat(preFerment.percent),
						hydrationPercent: parseFloat(preFerment.hydrationPercent),
						ingredients: (() => {
							switch (preFerment.type) {
								case "SourdoughStarter":
									return [];
								case "Biga":
								case "Poolish":
									return [
										{
											id: nanoid(),
											name: "Yeast",
											percent: parseFloat(preFerment.yeastPercent),
										},
									];
								default:
									assertUnreachable(preFerment);
							}
						})(),
					},
				]
			: []),
		...(scald
			? [
					{
						id: scald.id,
						name: "Scald (Tangzhong)",
						percent: parseFloat(scald.percent),
						hydrationPercent: parseFloat(scald.hydrationPercent),
						ingredients: [],
					},
				]
			: []),
	];
	const ingredients = [
		{
			id: nanoid(),
			name: "Salt",
			percent: parseFloat(state.saltPercent),
		},
		...rawIngredients.map(({ id, name, percent }) => ({
			id,
			name,
			percent: parseFloat(percent),
		})),
	];

	return calculateDoughBatch(
		state.mode === "BY_DOUGH_WEIGHT"
			? {
					type: "BY_DOUGH_WEIGHT",
					name: state.name,
					doughWeight: parseFloat(state.doughWeight),
					scale,
					totalHydrationPercent,
					inclusionDoughs,
					ingredients,
				}
			: {
					type: "BY_FLOUR_WEIGHT",
					name: state.name,
					flourWeight: parseFloat(state.flourWeight),
					scale,
					totalHydrationPercent,
					inclusionDoughs,
					ingredients,
				},
	);
}
