import { Input } from '@/ui/design/input';

type Props = {
  title: string;
  onTitleChange: (title: string) => void;
};

export default function RecipeTitleEditor(props: Props) {
  return (
    <Input value={props.title} onChange={props.onTitleChange} variant="title" />
  );
}
