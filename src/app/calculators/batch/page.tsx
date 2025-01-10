import BatchCalculator from "@/ui/calculators/batch/BatchCalculator";
import { Metadata } from "next";

export default function BatchCalculatorPage() {
	return <BatchCalculator />;
}

export const metadata: Metadata = {
	title: "Bread Batch Calculator",
	description:
		"Calculate ingredient weights based on baker's percent for a batch of dough.",
	keywords: [
		"Sourdough Calculator",
		"Bread Calculator",
		"Dough Batch Calculator",
		"Baker's Percent Calculator",
	],
};
