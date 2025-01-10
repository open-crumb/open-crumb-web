"use client";

import {
	selectIngredientErrors,
	useStore,
	type ID,
} from "@/ui/calculators/batch/ui-state";
import SourdoughStarterEditor from "@/ui/calculators/batch/SourdoughStarterEditor";
import RawIngredientEditor from "@/ui/calculators/batch/RawIngredientEditor";
import assertUnreachable from "@/lib/assertUnreachable";
import BigaEditor from "./BigaEditor";
import PoolishEditor from "./PoolishEditor";
import ScaldEditor from "./ScaldEditor";
import { useShallow } from "zustand/shallow";

type Props = {
	id: ID;
};

export default function Ingredient({ id }: Props) {
	const ingredient = useStore((state) => state.ingredientsByID[id]);
	const setSourdoughStarter = useStore((state) => state.setSourdoughStarter);
	const setPoolish = useStore((state) => state.setPoolish);
	const setBiga = useStore((state) => state.setBiga);
	const setScald = useStore((state) => state.setScald);
	const setRawIngredient = useStore((state) => state.setRawIngredient);
	const deleteIngredient = useStore((state) => state.deleteIngredient);
	const errors = useStore(
		useShallow((state) => selectIngredientErrors(state, id)),
	);

	switch (ingredient.type) {
		case "SourdoughStarter":
			return (
				<SourdoughStarterEditor
					percent={ingredient.percent}
					onPercentChange={(percent) =>
						setSourdoughStarter({ id: ingredient.id, percent })
					}
					isPercentValid={!errors.includes("PercentInvalidError")}
					hydrationPercent={ingredient.hydrationPercent}
					onHydrationPercentChange={(hydrationPercent) =>
						setSourdoughStarter({
							id: ingredient.id,
							hydrationPercent,
						})
					}
					isHydrationPercentValid={
						!errors.includes("HydrationPercentInvalidError")
					}
					onDelete={() => deleteIngredient(ingredient.id)}
				/>
			);
		case "Biga":
			return (
				<BigaEditor
					percent={ingredient.percent}
					onPercentChange={(percent) =>
						setBiga({
							id: ingredient.id,
							percent,
						})
					}
					isPercentValid={!errors.includes("PercentInvalidError")}
					hydrationPercent={ingredient.hydrationPercent}
					onHydrationPercentChange={(hydrationPercent) =>
						setBiga({
							id: ingredient.id,
							hydrationPercent,
						})
					}
					isHydrationPercentValid={
						!errors.includes("HydrationPercentInvalidError")
					}
					yeastPercent={ingredient.yeastPercent}
					onYeastPercentChange={(yeastPercent) =>
						setBiga({
							id: ingredient.id,
							yeastPercent,
						})
					}
					isYeastPercentValid={!errors.includes("YeastPercentInvalidError")}
					onDelete={() => deleteIngredient(ingredient.id)}
				/>
			);
		case "Poolish":
			return (
				<PoolishEditor
					percent={ingredient.percent}
					onPercentChange={(percent) =>
						setPoolish({
							id: ingredient.id,
							percent,
						})
					}
					isPercentValid={!errors.includes("PercentInvalidError")}
					hydrationPercent={ingredient.hydrationPercent}
					onHydrationPercentChange={(hydrationPercent) =>
						setPoolish({
							id: ingredient.id,
							hydrationPercent,
						})
					}
					isHydrationPercentValid={
						!errors.includes("HydrationPercentInvalidError")
					}
					yeastPercent={ingredient.yeastPercent}
					onYeastPercentChange={(yeastPercent) =>
						setPoolish({
							id: ingredient.id,
							yeastPercent,
						})
					}
					isYeastPercentValid={!errors.includes("YeastPercentInvalidError")}
					onDelete={() => deleteIngredient(ingredient.id)}
				/>
			);
		case "Scald":
			return (
				<ScaldEditor
					percent={ingredient.percent}
					onPercentChange={(percent) =>
						setScald({
							id: ingredient.id,
							percent,
						})
					}
					isPercentValid={!errors.includes("PercentInvalidError")}
					hydrationPercent={ingredient.hydrationPercent}
					onHydrationPercentChange={(hydrationPercent) =>
						setScald({
							id: ingredient.id,
							hydrationPercent,
						})
					}
					isHydrationPercentValid={
						!errors.includes("HydrationPercentInvalidError")
					}
					onDelete={() => deleteIngredient(ingredient.id)}
				/>
			);
		case "RawIngredient":
			return (
				<RawIngredientEditor
					name={ingredient.name}
					onNameChange={(name) => setRawIngredient({ id: ingredient.id, name })}
					isNameValid={!errors.includes("NameInvalidError")}
					percent={ingredient.percent}
					onPercentChange={(percent) =>
						setRawIngredient({ id: ingredient.id, percent })
					}
					isPercentValid={!errors.includes("PercentInvalidError")}
					onDelete={() => deleteIngredient(ingredient.id)}
				/>
			);
		default:
			assertUnreachable(ingredient);
	}
}
