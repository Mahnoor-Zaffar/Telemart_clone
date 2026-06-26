import { test, expect } from '@playwright/test';

test('guest buy flow — browse, add to cart, checkout COD', async ({ page }) => {
  await page.goto('/en/mobiles/smartphones');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  const productLink = page.locator('a[href*="/product/"]').first();
  await productLink.click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.getByTestId('add-to-cart').click();

  await page.goto('/en/cart');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/cart/i);

  await page.getByRole('link', { name: /checkout|proceed/i }).click();

  await page.getByPlaceholder(/full name/i).fill('E2E Test User');
  await page.getByPlaceholder(/phone/i).first().fill('03009998877');
  await page.getByPlaceholder(/email/i).fill('e2e@test.local');
  await page.getByPlaceholder(/area/i).fill('Gulberg');
  await page.getByPlaceholder(/street/i).fill('12 Test Road');

  await page.getByRole('button', { name: /continue/i }).first().click();
  await page.getByRole('button', { name: /continue/i }).first().click();
  await page.getByRole('button', { name: /place order/i }).click();

  await expect(page).toHaveURL(/checkout\/success/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/order/i);
});
