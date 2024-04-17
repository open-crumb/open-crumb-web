'use client';

import Heading from '@/ui/design/Heading';
import { useRecipeList } from '@/ui/core/recipes/data/hooks';
import Link from 'next/link';

export default function RecipeListBlock() {
  const recipes = useRecipeList();

  return (
    <div>
      <Heading level="2">Recipes</Heading>
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <Link href={`/recipes/${recipe.id}`}>{recipe.title}</Link>
        </div>
      ))}
    </div>
  );
}
