import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'off',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }],
  webServer: process.env.CI
    ? undefined
    : [
        {
          command: 'npm run start --workspace=@telemart/api',
          url: 'http://localhost:3001/api/v1/health',
          reuseExistingServer: true,
          timeout: 120_000,
        },
        {
          command: 'npm run dev --workspace=@telemart/web',
          url: 'http://localhost:3000',
          reuseExistingServer: true,
          timeout: 120_000,
        },
      ],
});
