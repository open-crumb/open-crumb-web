import { test, expect } from '@playwright/test';

test('Logbook Entry Page', async ({ page }) => {
  await page.goto('/logbook/le.1');

  await expect(page).toHaveTitle(/Classic Sourdough/);
  await expect(
    page.getByRole('heading', { name: 'Prepare Levain' }),
  ).toBeVisible();
});
