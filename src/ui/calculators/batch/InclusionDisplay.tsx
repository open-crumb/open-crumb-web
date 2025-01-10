import { Column, Row } from "@/ui/calculators/batch/RowLayout";
import { Badge } from "@/ui/design/badge";

type Props = {
	name: string;
	weight: number;
	hydrationPercent: number;
	flourWeight: number;
	liquidWeight: number;
	ingredients: Array<{
		id: string;
		name: string;
		weight: number;
	}>;
};

export default function InclusionDisplay({
	name,
	weight,
	hydrationPercent,
	flourWeight,
	liquidWeight,
	ingredients,
}: Props) {
	const gramFormatter = new Intl.NumberFormat("en-US", {
		style: "unit",
		unit: "gram",
	});
	const percentFormatter = new Intl.NumberFormat("en-US", {
		style: "unit",
		unit: "percent",
	});

	return (
		<>
			<Row>
				<Column size="3/4">{name}</Column>
				<Column size="1/4" className="text-right">
					{gramFormatter.format(weight)}
				</Column>
			</Row>
			<Row>
				<Column size="3/4" className="pl-md">
					Flour
				</Column>
				<Column size="1/4" className="text-right">
					{gramFormatter.format(flourWeight)}
				</Column>
			</Row>
			<Row>
				<Column size="3/4" className="pl-md">
					Water
					<Badge className="ml-md">
						{percentFormatter.format(hydrationPercent)} H
					</Badge>
				</Column>
				<Column size="1/4" className="text-right">
					{gramFormatter.format(liquidWeight)}
				</Column>
			</Row>
			{ingredients.map((ingredient) => (
				<Row key={ingredient.id}>
					<Column size="3/4" className="pl-md">
						{ingredient.name}
					</Column>
					<Column size="1/4" className="text-right">
						{gramFormatter.format(ingredient.weight)}
					</Column>
				</Row>
			))}
		</>
	);
}
