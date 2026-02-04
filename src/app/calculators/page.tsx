import { Link } from "@/ui/design/link";

export default function CalculatorsPage() {
	return (
		<>
			<h1 className="mb-md text-lg font-semibold">Calculators</h1>
			<ul>
				<li>
					<Link href="/calculators/batch">Batch Calculator</Link>
				</li>
			</ul>
		</>
	);
}
