import * as allure from 'allure-js-commons';

export async function attachEnvInfo() {
  await allure.parameter('Browser', process.env.BROWSER || 'chromium');
  await allure.parameter('Environment', process.env.ENV || 'qa');
  await allure.parameter('Base URL', process.env.URL || 'http://localhost');
}
// This helper function adds custom metadata to Allure reports.
// It sets the framework label and parameters for browser, environment, and base URL.