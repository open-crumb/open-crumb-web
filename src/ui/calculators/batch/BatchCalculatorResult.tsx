"use client";

import { selectResult, useStore } from "@/ui/calculators/batch/ui-state";
import { Button } from "@/ui/design/button";
import { Column, Row } from "@/ui/calculators/batch/RowLayout";
import { Separator } from "@/ui/design/separator";
import { Fragment } from "react";
import InclusionDisplay from "./InclusionDisplay";

export default function BatchCalculatorResult() {
	const state = useStore();
	const setStep = useStore((state) => state.setStep);
	const result = selectResult(state);
	const gramFormatter = new Intl.NumberFormat("en-US", {
		style: "unit",
		unit: "gram",
	});
	const percentFormatter = new Intl.NumberFormat("en-US", {
		style: "unit",
		unit: "percent",
	});

	return (
		<div className="flex flex-col gap-md">
			<h2 className="font-semibold text-lg">{result.name}</h2>
			<Row>
				<Column size="3/4">Portion</Column>
				<Column size="1/4" className="text-right">
					{gramFormatter.format(result.portion)}
				</Column>
			</Row>
			<Row>
				<Column size="3/4">Hydration</Column>
				<Column size="1/4" className="text-right">
					{percentFormatter.format(result.totalHydrationPercent)}
				</Column>
			</Row>
			<Row>
				<Column size="3/4">Scale</Column>
				<Column size="1/4" className="text-right">
					{result.scale}
					<span className="ml-1 text-muted-foreground">×</span>
				</Column>
			</Row>
			<Separator />
			<Row>
				<Column size="3/4">Flour</Column>
				<Column size="1/4" className="text-right">
					{gramFormatter.format(result.flourWeight)}
				</Column>
			</Row>
			<Row>
				<Column size="3/4">Water</Column>
				<Column size="1/4" className="text-right">
					{gramFormatter.format(result.liquidWeight)}
				</Column>
			</Row>
			{result.ingredients.map((ingredient) => (
				<Row key={ingredient.id}>
					<Column size="3/4">{ingredient.name}</Column>
					<Column size="1/4" className="text-right">
						{gramFormatter.format(ingredient.weight)}
					</Column>
				</Row>
			))}
			{result.inclusionDoughs.map((dough) => (
				<Fragment key={dough.id}>
					<Separator />
					<InclusionDisplay
						name={dough.name}
						weight={dough.weight}
						hydrationPercent={dough.hydrationPercent}
						flourWeight={dough.flourWeight}
						liquidWeight={dough.liquidWeight}
						ingredients={dough.ingredients}
					/>
				</Fragment>
			))}
			<div className="flex justify-end mt-md">
				<Button onClick={() => setStep("EDIT")}>Back</Button>
			</div>
		</div>
	);
}
