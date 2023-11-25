import { test, expect } from '@playwright/test';

test('Logbook Page', async ({ page }) => {
  await page.goto('/logbook');

  await expect(page).toHaveTitle(/Logbook/);
  await expect(
    page.getByRole('link', { name: 'Classic Sourdough' }),
  ).toBeVisible();
});
