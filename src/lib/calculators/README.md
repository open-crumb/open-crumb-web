# Derivations

Baker's math expresses ingredients as a percent of total flour in the recipe.
Bakers will often want a target dough weight for consistency, or to fit a
specific banneton size. Given a recipe in baker's percent and a target dough
weight, we can calculate the weights of each ingredient. We'll use the
following derivations:

```
DoughWeight = sum(...IngredientWeight[i])

IngredientWeight[i] = FlourWeight * IngredientPercent[i]

DoughWeight = sum(...(FlourWeight * IngredientPercent[i]))

DoughWeight = FlourWeight * sum(...IngredientPercent[i])

FlourWeight = DoughWeight / sum(...IngredientPercent[i])
```

Example, given dough weight and ingredient percents:

|              |      |
| ------------ | ---: |
| Dough Weight | 800g |
| Flour        | 100% |
| Water        |  80% |
| Salt         |   2% |
| Yeast        |   1% |

```
FlourWeight = DoughWeight / sum(...IngredientPercent[i])
FlourWeight = 800 / (100% + 80% + 2% + 1%)
FlourWeight = 800 / 183%
FlourWeight = 437
```

Now we can calculate our final recipe:

| Ingredient | Weight |             |
| ---------- | -----: | ----------- |
| Flour      |   437g |             |
| Water      |   350g | (437 × 80%) |
| Salt       |     9g | (437 × 2%)  |
| Yeast      |     4g | (437 × 1%)  |

## Inclusion Doughs

Pre-ferments and scalds are common inclusion doughs. They will include a portion
of the total flour and water and sometimes other ingredients, so we need to
account for that in our calculations. Let's sub the yeast in the above example
for 20% sourdough starter.

|              |      |
| ------------ | ---: |
| Dough Weight | 800g |
| Flour        |    ? |
| Water        |    ? |
| Salt         |   2% |
| Levain       |  20% |

Now what's the flour and water percent? It's going to depend on the hydration of
the levain.

Many bakers keep a liquid sourdough starter at 100% hydration. This
makes the math quite easy - 50% is flour and 50% is water.

Some bakers also use stiff levains, closer to 50% hydration. This is slightly
more difficult math - 66.7% is flour and 33.3% is water.

Some recipes call for a sweet levain which will have sugar. Poolish and Biga
have a small percent of yeast.

We'll need to generalize an algorithm for all of these factors.

Start by converting the baker's percent for the inclusion dough into parts.

**Levain**

This is a sweet levain at 100% hydration.

| Ingredient | Baker's % |
| ---------- | --------: |
| Flour      |      100% |
| Water      |      100% |
| Sugar      |       50% |

We know our recipe above includes 20% levain so we need to determine which
portions of that 20% are flour, water, or other ingredients.

```
IngredientPartPercent = IngredientBakersPercent / sum(...IngredientBakersPercent[i])
```

| Ingredient | Part % |             |
| ---------- | -----: | ----------- |
| Flour      |    40% | (100 / 250) |
| Water      |    40% | (100 / 250) |
| Sugar      |    20% | (50 / 250)  |

Now we can calculate which portion of the 20% of levain belongs to each
ingredient.

| Ingredient | Levain % |            |
| ---------- | -------: | ---------- |
| Flour      |       8% | (20 × 40%) |
| Water      |       8% | (20 × 40%) |
| Sugar      |       4% | (20 × 20%) |

That 4% sugar is now the baker's percent of sugar in the final recipe so we
need to add that to our formula for the total flour computation. We'll need to
take a target hydration to compute our total flour weight.

|                     |      |                             |
| ------------------- | ---: | --------------------------- |
| Dough Weight        | 800g |                             |
| Total Flour         | 100% | (92% main dough, 8% levain) |
| Target Hydration    |  80% | (72% main dough, 8% levain) |
| Salt                |   2% |                             |
| Sugar (from Levain) |   4% |                             |

Note: The flour and water percents from the levain aren't used because they're
included in the total flour and target hydration.

```
FlourWeight = DoughWeight / sum(...IngredientPercent[i])
FlourWeight = 800 / (100% + 80% + 2% + 4%)
FlourWeight = 800 / 186%
FlourWeight = 430
```

From here it's an easy process to calculate the weight of each ingredient.

**Totals**

| Ingredient  | Weight |             |
| ----------- | -----: | ----------- |
| Total Flour |   430g |             |
| Total Water |   344g | (430 × 80%) |

**Main Dough**

| Ingredient | Weight |             |
| ---------- | -----: | ----------- |
| Flour      |   396g | (430 × 92%) |
| Water      |   310g | (430 × 72%) |
| Salt       |     9g | (430 × 2%)  |
| Levain     |    86g | (430 × 20%) |

**Levain**

| Ingredient | Weight |            |
| ---------- | -----: | ---------- |
| Flour      |    34g | (430 × 8%) |
| Water      |    34g | (430 × 8%) |
| Sugar      |    17g | (430 × 4%) |
