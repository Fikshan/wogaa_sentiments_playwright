// File: helpers/loadEnv.js
import dotenv from 'dotenv'; // Load environment variables from a specific .env file based on the ENV variable
                            // This allows for different configurations based on the environment (e.g., staging, production).

import fs from 'fs';      // Import the filesystem module to check for the existence of the .env file
                          // Check if the .env file exists based on the ENV variable
                          // If it does not exist, throw an error to inform the user to create it. 

// Get environment from command line (set by cross-env in package.json)
const environment = process.env.ENV || 'qa';
// Build the path to the environment-specific .env file
const envPath = `.env.${environment}`;
console.log(`🔍 Looking for environment file: ${envPath}`);

// Validate .env file exists and Load environment variables
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`Loaded environment variables from ${envPath}`);
} else {
  console.log(`No .env file found at ${envPath}, using environment variables or defaults`);
}

export const TEST_ENV = process.env.ENV;
export const TEST_BROWSER = process.env.BROWSER;
export const BASE_URL = process.env.URL;

//Get environment variables (loaded from .env file)
console.log(`Loaded environment: ${TEST_ENV} from ${envPath}`);
console.log(`Environment Variables:`, {
  ENV: process.env.ENV,
  BROWSER: process.env.BROWSER,
  URL: process.env.URL,
});