import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',

  use: {
    baseURL: 'http://localhost:5173',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  snapshotPathTemplate: '{testDir}/snapshots/{projectName}/{testFilePath}/{arg}{ext}',

  // Vite dev server — reuse if already running locally, always start fresh in CI
  webServer: {
    command: 'npx vite --port 5173',
    url: 'http://localhost:5173/tests/fixture.html',
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
  },
});
