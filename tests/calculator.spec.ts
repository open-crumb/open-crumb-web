import { test, expect } from '@playwright/test';

test('calculator page loads', async ({ page }) => {
  await page.goto('/calculator');

  await expect(page).toHaveTitle(/Calculator/);
});

test('modifying inputs by dough weight', async ({ page }) => {
  await page.goto('/calculator');

  await page.getByLabel('Dough Weight').fill('1000');
  await expect(page.getByLabel('Total Flour')).toHaveValue('549');
  await expect(page.getByLabel('Hydration Weight')).toHaveValue('439');
  await expect(page.getByLabel('Salt Weight')).toHaveValue('11');

  await page.getByLabel('Hydration', { exact: true }).fill('85');
  await expect(page.getByLabel('Hydration Weight')).toHaveValue('455');
  await expect(page.getByLabel('Total Flour')).toHaveValue('535');

  await page.getByLabel('Hydration Weight').fill('424');
  await expect(page.getByLabel('Hydration', { exact: true })).toHaveValue('75');
  await expect(page.getByLabel('Total Flour')).toHaveValue('565');

  await page.getByLabel('Salt', { exact: true }).fill('3');
  await expect(page.getByLabel('Salt Weight')).toHaveValue('17');
  await expect(page.getByLabel('Total Flour')).toHaveValue('562');
  await expect(page.getByLabel('Hydration Weight')).toHaveValue('422');

  await page.getByLabel('Salt Weight').fill('11');
  await expect(page.getByLabel('Salt', { exact: true })).toHaveValue('2');
  await expect(page.getByLabel('Total Flour')).toHaveValue('565');
  await expect(page.getByLabel('Hydration Weight')).toHaveValue('424');
});

test('modifying inputs by flour weight', async ({ page }) => {
  await page.goto('/calculator');

  await page.getByLabel('Total Flour').fill('500');
  await expect(page.getByLabel('Hydration Weight')).toHaveValue('400');
  await expect(page.getByLabel('Salt Weight')).toHaveValue('10');
  await expect(page.getByLabel('Dough Weight')).toHaveValue('910');

  await page.getByLabel('Hydration', { exact: true }).fill('85');
  await expect(page.getByLabel('Hydration Weight')).toHaveValue('425');
  await expect(page.getByLabel('Dough Weight')).toHaveValue('935');

  await page.getByLabel('Hydration Weight').fill('375');
  await expect(page.getByLabel('Hydration', { exact: true })).toHaveValue('75');
  await expect(page.getByLabel('Dough Weight')).toHaveValue('885');

  await page.getByLabel('Salt', { exact: true }).fill('3');
  await expect(page.getByLabel('Salt Weight')).toHaveValue('15');
  await expect(page.getByLabel('Dough Weight')).toHaveValue('890');

  await page.getByLabel('Salt Weight').fill('10');
  await expect(page.getByLabel('Salt', { exact: true })).toHaveValue('2');
  await expect(page.getByLabel('Dough Weight')).toHaveValue('885');
});

test('adding ingredients', async ({ page }) => {
  await page.goto('/calculator');

  await page.getByLabel('Total Flour').fill('500');
  await page.getByText('Add Ingredient').click();
  await page.getByRole('menuitem', { name: 'Flour' }).click();
  await expect(page.getByRole('heading', { name: 'Flours' })).toBeVisible();

  await page.getByLabel('Ingredient Name').fill('Bread Flour');
  await expect(page.getByLabel('Ingredient Percent')).toHaveValue('100');
  await expect(page.getByLabel('Ingredient Weight')).toHaveValue('500');

  await page.getByLabel('Ingredient Percent').fill('50');
  await expect(page.getByLabel('Ingredient Weight')).toHaveValue('250');
  await expect(page.getByLabel('Dough Weight')).toHaveValue('910');

  await page.getByText('Add Ingredient').click();
  await page.getByRole('menuitem', { name: 'Liquid' }).click();
  await expect(page.getByRole('heading', { name: 'Liquids' })).toBeVisible();

  await page.getByLabel('Ingredient Name').nth(1).fill('Water');
  await expect(page.getByLabel('Ingredient Percent').nth(1)).toHaveValue('80');
  await expect(page.getByLabel('Ingredient Weight').nth(1)).toHaveValue('400');

  await page.getByLabel('Ingredient Weight').nth(1).fill('350');
  await expect(page.getByLabel('Ingredient Percent').nth(1)).toHaveValue('70');
  await expect(page.getByLabel('Dough Weight')).toHaveValue('910');

  await page.getByText('Add Ingredient').click();
  await page.getByRole('menuitem', { name: 'Other' }).click();
  await expect(page.getByRole('heading', { name: 'Other' })).toBeVisible();

  await page.getByLabel('Ingredient Name').nth(2).fill('Walnuts');
  await expect(page.getByLabel('Ingredient Percent').nth(2)).toHaveValue('');
  await expect(page.getByLabel('Ingredient Weight').nth(2)).toHaveValue('');
  await expect(page.getByLabel('Dough Weight')).toHaveValue('910');

  await page.getByLabel('Ingredient Percent').nth(2).fill('20');
  await expect(page.getByLabel('Ingredient Weight').nth(2)).toHaveValue('100');
  await expect(page.getByLabel('Dough Weight')).toHaveValue('1010');

  await page.getByLabel('Ingredient Weight').nth(2).fill('50');
  await expect(page.getByLabel('Ingredient Percent').nth(2)).toHaveValue('10');
  await expect(page.getByLabel('Dough Weight')).toHaveValue('960');

  await page.getByLabel('Dough Weight').fill('800');
  await expect(page.getByLabel('Ingredient Weight').nth(2)).toHaveValue('42');
});

test('deleting an ingredient', async ({ page }) => {
  await page.goto('/calculator');

  await page.getByLabel('Total Flour').fill('500');
  await page.getByText('Add Ingredient').click();
  await page.getByRole('menuitem', { name: 'Other' }).click();

  await page.getByLabel('Ingredient Percent').fill('20');
  await expect(page.getByLabel('Dough Weight')).toHaveValue('1010');

  await page.getByLabel('Delete Ingredient').click();
  await expect(page.getByLabel('Dough Weight')).toHaveValue('910');

  await page.getByLabel('Dough Weight').fill('1000');
  await page.getByText('Add Ingredient').click();
  await page.getByRole('menuitem', { name: 'Other' }).click();

  await page.getByLabel('Ingredient Percent').fill('20');
  await expect(page.getByLabel('Dough Weight')).toHaveValue('1000');
  await expect(page.getByLabel('Total Flour')).toHaveValue('495');

  await page.getByLabel('Delete Ingredient').click();
  await expect(page.getByLabel('Total Flour')).toHaveValue('549');
});

test('adding a levain', async ({ page }) => {
  await page.goto('/calculator');

  await page.getByLabel('Total Flour').fill('500');
  await page.getByText('Add Ingredient').click();
  await page.getByRole('menuitem', { name: 'Levain' }).click();
  await expect(page.getByLabel('Levain', { exact: true })).toHaveValue('20');
  await expect(page.getByLabel('Levain Weight')).toHaveValue('100');
  await expect(page.getByLabel('Ingredient Name').nth(0)).toHaveValue('Flour');
  await expect(page.getByLabel('Ingredient Percent').nth(0)).toHaveValue('10');
  await expect(page.getByLabel('Ingredient Name').nth(1)).toHaveValue('Water');
  await expect(page.getByLabel('Ingredient Percent').nth(1)).toHaveValue('10');

  await page.getByLabel('Levain', { exact: true }).fill('10');
  await expect(page.getByLabel('Levain Weight')).toHaveValue('50');
  await expect(page.getByLabel('Dough Weight')).toHaveValue('910');

  await page.getByText('Add Ingredient').nth(1).click();
  await page.getByRole('menuitem', { name: 'Other' }).click();

  await page.getByLabel('Ingredient Name').nth(2).fill('Sugar');
  await page.getByLabel('Ingredient Percent').nth(2).fill('4');
  await expect(page.getByLabel('Ingredient Weight').nth(2)).toHaveValue('20');
  await expect(page.getByLabel('Dough Weight')).toHaveValue('930');
});
