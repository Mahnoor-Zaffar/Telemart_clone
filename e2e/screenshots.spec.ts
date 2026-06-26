import { test } from '@playwright/test';
import path from 'path';

const OUT = path.join(__dirname, '../docs/screenshots');

test.describe('Portfolio screenshots', () => {
  test('capture home, PLP, PDP, cart, admin', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(OUT, 'home.png'), fullPage: false });

    await page.goto('/en/mobiles/smartphones');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(OUT, 'plp.png'), fullPage: false });

    await page.locator('a[href*="/product/"]').first().click();
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(OUT, 'pdp.png'), fullPage: false });

    await page.getByTestId('add-to-cart').click();
    await page.goto('/en/cart');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(OUT, 'cart.png'), fullPage: false });

    await page.goto('/en/account/login');
    await page.getByPlaceholder(/email/i).fill('admin@telemart.local');
    await page.getByPlaceholder(/password/i).fill('admin123');
    await page.getByRole('button', { name: /login/i }).click();
    await page.goto('/en/admin');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(OUT, 'admin.png'), fullPage: false });
  });
});
