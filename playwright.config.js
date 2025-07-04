// +// This file configures Playwright for testing the Wogaa website.
// File: playwright.config.js
// This file configures Playwright for testing the Wogaa website.
// It sets the test directory, timeout, base URL, and browser settings for both desktop and mobile environments.
// It also specifies the use of headless mode, screenshot capture on failure, and video recording   

import './helpers/loadEnv.js'; // Load environment variables from .env file

import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  testIgnore: '**/node_modules/**',
  retries: 1,
  workers: 2, // Use 2 CPU cores
  reporter:[['allure-playwright',{ outputFolder: 'allure-results' }]],
  timeout: 30000,
  use: {
    headless: true,
    screenshot: 'off',
    video: 'off',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
     /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
    // {
    //   name: 'Mobile',
    //   use: { ...devices['iPhone 13'] },
    // },
  ],
});
// This configuration sets up Playwright to run tests in both desktop and mobile environments.
// It specifies the test directory, timeout, base URL, and browser settings.    