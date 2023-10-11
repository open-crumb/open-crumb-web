import { test, expect } from '@playwright/test';

test('Calculator Page', async ({ page }) => {
  await page.goto('http://localhost:3000/calculator');

  await expect(page).toHaveTitle(/Calculator/);
});
