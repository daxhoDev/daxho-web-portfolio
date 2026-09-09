import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'list' : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    // `astro preview` no está soportado con el adapter de Vercel: el build sale
    // en formato de funciones serverless, no en algo que Astro pueda servir.
    // Se usa el servidor de desarrollo, que sirve el mismo HTML y el mismo JS.
    command: 'pnpm exec astro dev --port 4321',
    url: `http://localhost:${PORT}/styleguide`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
