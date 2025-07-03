// @ts-nocheck
// File: playwright.config.js
// This file configures Playwright for testing the Wogaa website.
// It sets the test directory, timeout, base URL, and browser settings for both desktop and mobile environments.
// It also specifies the use of headless mode, screenshot capture on failure, and video recording   
//require('dotenv').config();
// require('dotenv').config({ path: `.env.${process.env.ENV || 'qa'}` });
// const { defineConfig, devices } = require('@playwright/test');


import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.ENV || 'qa'}` });

console.log("🔍 Loaded Environment Variables:");
console.log("ENV:", process.env.ENV);
console.log("BROWSER:", process.env.BROWSER);
console.log("URL:", process.env.URL);

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
    //baseURL: process.env.URL,
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'Mobile',
    //   use: { ...devices['iPhone 13'] },
    // },
  ],
});
// This configuration sets up Playwright to run tests in both desktop and mobile environments.
// It specifies the test directory, timeout, base URL, and browser settings.    