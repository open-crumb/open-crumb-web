import { useLogbookIngredient } from '@/ui/core/logbook/LogbookContext';

type Props = {
  id: string;
};

export default function LogbookIngredient(props: Props) {
  const ingredient = useLogbookIngredient(props.id);

  return <>{ingredient.entity.text}</>;
}
