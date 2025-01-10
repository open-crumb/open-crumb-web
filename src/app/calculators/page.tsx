import { Link } from "@/ui/design/link";

export default function CalculatorsPage() {
	return (
		<>
			<h1 className="font-semibold text-lg mb-md">Calculators</h1>
			<ul>
				<li>
					<Link href="/calculators/batch">Batch Calculator</Link>
				</li>
			</ul>
		</>
	);
}
