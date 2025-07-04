import './loadEnv.js';
// This file loads environment variables from a specific .env file based on the ENV variable.
// It allows for different configurations based on the environment (e.g., staging, production).
import * as allure from 'allure-js-commons';

export const TEST_ENV = process.env.ENV || 'qa';
export const TEST_BROWSER = process.env.BROWSER || 'chromium';
export const BASE_URL = process.env.URL || 'https://beta-docs.wogaa.cloud/';

export async function attachEnvInfo() {
  await allure.parameter('Browser', TEST_BROWSER);
  await allure.parameter('Environment', TEST_ENV);
  await allure.parameter('Base URL', BASE_URL);
}
// This helper function adds custom metadata to Allure reports.
// It sets the framework label and parameters for browser, environment, and base URL.