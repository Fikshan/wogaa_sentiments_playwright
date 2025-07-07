import './loadEnv.js';
// This file loads environment variables from a specific .env file based on the ENV variable.
// It allows for different configurations based on the environment (e.g., staging, production).
import * as allure from 'allure-js-commons';
import { TEST_ENV, TEST_BROWSER, BASE_URL } from './loadEnv.js';

export async function attachEnvInfo() {
  await allure.parameter('Browser', TEST_BROWSER);
  await allure.parameter('Environment', TEST_ENV);
  await allure.parameter('Base URL', BASE_URL);
}
// This helper function adds custom metadata to Allure reports.
// It sets the framework label and parameters for browser, environment, and base URL.