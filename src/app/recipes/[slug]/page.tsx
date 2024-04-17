import RecipeBlock from '@/ui/core/recipes/RecipeBlock';
import { RecipeBlockProvider } from '@/ui/core/recipes/data/hooks';

type Props = {
  params: {
    slug: string;
  };
};

export default function RecipePage(props: Props) {
  return (
    <RecipeBlockProvider>
      <RecipeBlock id={props.params.slug} />
    </RecipeBlockProvider>
  );
}
