// File: helpers/loadEnv.js
import dotenv from 'dotenv'; // Load environment variables from a specific .env file based on the ENV variable
                            // This allows for different configurations based on the environment (e.g., staging, production).

import fs from 'fs';      // Import the filesystem module to check for the existence of the .env file
                          // Check if the .env file exists based on the ENV variable
                          // If it does not exist, throw an error to inform the user to create it. 

// Get ENV variable (default to 'qa' if not provided)
const TEST_ENV = process.env.ENV || 'qa'; // Default to 'qa' if ENV is not set
const envPath = `.env.${TEST_ENV}`;

// Validate .env file exists
if (!fs.existsSync(envPath)) {
  throw new Error(`❌ Environment file ${envPath} not found. Please create it.`);
}

// Load environment variables
dotenv.config({ path: envPath });

console.log(`Loaded environment: ${TEST_ENV} from ${envPath}`);
console.log(`Environment Variables:`, {
  ENV: process.env.ENV,
  BROWSER: process.env.BROWSER,
  URL: process.env.URL,
  ALLURE_RESULTS_DIR: process.env.ALLURE_RESULTS_DIR,
  ALLURE_REPORT_DIR: process.env.ALLURE_REPORT_DIR,
  PLAYWRIGHT_CONFIG: process.env.PLAYWRIGHT_CONFIG
});