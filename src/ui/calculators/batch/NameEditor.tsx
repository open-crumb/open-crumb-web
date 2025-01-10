import { Input } from "@/ui/design/input";
import { Label } from "@/ui/design/label";

type Props = {
	name: string;
	onNameChange: (name: string) => void;
};

export default function NameEditor({ name, onNameChange }: Props) {
	return (
		<Label>
			Recipe Name
			<Input
				className="mt-sm"
				value={name}
				onChange={(event) => onNameChange(event.target.value)}
			/>
		</Label>
	);
}
