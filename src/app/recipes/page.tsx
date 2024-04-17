import RecipesBlock from '@/ui/core/recipes/RecipeListBlock';
import { RecipeListBlockProvider } from '@/ui/core/recipes/data/hooks';

export default function RecipeListPage() {
  return (
    <RecipeListBlockProvider>
      <RecipesBlock />
    </RecipeListBlockProvider>
  );
}
