"use client";

import { useStore } from "@/ui/calculators/batch/ui-state";
import BatchCalculatorEditor from "./BatchCalculatorEditor";
import BatchCalculatorResult from "./BatchCalculatorResult";
import assertUnreachable from "@/lib/assertUnreachable";

export default function BatchCalculator() {
	const step = useStore((state) => state.step);

	switch (step) {
		case "EDIT":
			return <BatchCalculatorEditor />;
		case "RESULT":
			return <BatchCalculatorResult />;
		default:
			assertUnreachable(step);
	}
}
