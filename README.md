# WOGAA Sentiments Widget - Playwright Testing Framework

## Overview

This project contains automated end-to-end tests for the WOGAA (Whole-of-Government Application Analytics) Sentiments Widget using Playwright. The test suite validates the feedback collection flow for both negative ratings (1-4) and positive ratings (5-6).

## Project Structure

```
wogaa-playwright-tests/
├── .github/                      # GitHub workflows and templates
├── allure-report/               # Generated Allure test reports
├── allure-results/              # Allure test results data
├── helpers/
│   ├── PlaywrightControls.js    # Playwright utility controls
│   └── allureHelper.js          # Allure reporting helpers
├── node_modules/                # Node.js dependencies
├── pages/
│   ├── BasePage.js              # Base page object with common methods
│   ├── RatingWidgetPage.js      # Rating widget page object
│   └── TellUsMorePage.js        # Feedback form page object
├── playwright-report/           # Playwright HTML reports
├── test-results/                # Test execution results
├── tests/
│   ├── negativeRatings.spec.js  # Tests for ratings 1-4
│   └── positiveRatings.spec.js  # Tests for ratings 5-6
├── .env.prod                    # Production environment variables
├── .env.qa                      # QA environment variables
├── .eslintignore               # ESLint ignore patterns
├── .gitignore                  # Git ignore patterns
├── eslint.config.js            # ESLint configuration
├── package.json                # Dependencies and scripts
├── package-lock.json           # Lock file for dependencies
├── playwright.config.js        # Playwright configuration
└── README.md                   # Project documentation
```

## Dependencies

### Core Dependencies
- **@playwright/test**: ^1.53.1 - Playwright testing framework
- **dotenv**: ^16.6.1 - Environment variable management

### Development Dependencies
- **@eslint/js**: ^9.30.1 - ESLint JavaScript configuration
- **allure-commandline**: ^2.34.1 - Allure command line tools
- **allure-playwright**: ^3.3.0 - Allure reporter for Playwright
- **cross-env**: ^7.0.3 - Cross-platform environment variables
- **eslint**: ^9.30.1 - JavaScript linter
- **globals**: ^16.3.0 - Global variables for ESLint
- **rimraf**: ^6.0.1 - Cross-platform rm -rf utility

## Features Tested

### Negative Ratings (1-4)
- **Form Validation**: Verifies correct form structure and elements
- **User Interactions**: Tests checkbox selections, text input, and form submission
- **Error Handling**: Validates character limits and email validation
- **Submit Button Logic**: Ensures proper enabling/disabling based on required fields

### Positive Ratings (5-6)
- **Form Validation**: Verifies positive-specific form options
- **User Interactions**: Tests interactions with positive feedback elements
- **Consistency**: Ensures form structure consistency across positive ratings
- **Submission Flow**: Validates complete feedback submission process

## Test Coverage

### Form Elements Tested
- **Required Question**: "Which areas contributed to your rating today?"
  - Negative ratings: Technical errors, Couldn't find content, Difficult to navigate, etc.
  - Positive ratings: Website is great, Website loaded fast, Easy to navigate, etc.
- **Optional Questions**: 
  - Which are you interested in? (Informational Services, Transactional Services, Mobile Applications)
  - What did you like least/most? (textarea)
  - Your email (optional)

### Validation Tests
- Character limit validation (255 characters)
- Email format validation
- Required field validation
- Submit button state management

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Playwright browsers installed

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Fikshan/wogaa.git
cd wogaa-playwright-tests
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Environment Setup

Create environment files for different testing environments:

### .env.qa
```
ENV=qa
URL=https://your-qa-environment-url.com
```

### .env.prod
```
ENV=production
URL=https://your-production-environment-url.com
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests with specific environments:
```bash
# Run with QA environment and generate Allure report
npm run test:qa

# Run with staging environment and generate Allure report
npm run test:staging

# Run with production environment and generate Allure report
npm run test:production
```

### Run specific test suites:
```bash
# Run negative ratings tests only
npm run test:negative

# Run positive ratings tests only
npm run test:positive
```

### Run tests with Allure reporting:
```bash
# Run tests and generate Allure report
npm run test:allure
```

### Run tests in headed mode (see browser):
```bash
npx playwright test --headed
```

### Run tests in debug mode:
```bash
npx playwright test --debug
```

## Test Scripts

Available npm scripts:

```json
{
  "test": "npx playwright test",
  "test:qa": "cross-env ENV=qa npm run test:allure",
  "test:staging": "cross-env ENV=staging npm run test:allure",
  "test:production": "cross-env ENV=production npm run test:allure",
  "report": "allure generate allure-results --clean -o allure-report && allure open",
  "clean-results": "rimraf allure-results",
  "test:negative": "npx playwright test negativeRatings.spec.js",
  "test:positive": "npx playwright test positiveRatings.spec.js",
  "test:allure": "npm run clean-results && npx playwright test && npm run report",
  "lint": "eslint . --ext .js"
}
```

## Code Quality

### ESLint Configuration
The project uses ESLint for code quality and consistency:
- Configuration file: `eslint.config.js`
- Run linting: `npm run lint`
- Supports modern JavaScript (ES modules)
- Includes global variables configuration

### Running Linter
```bash
npm run lint
```

## Reporting

### Playwright HTML Report
After test execution, view the HTML report:
```bash
npx playwright show-report
```

### Allure Reporting
Generate and view Allure reports:
```bash
# Generate and open Allure report
npm run report

# Or run the full test suite with Allure reporting
npm run test:allure
```

### Clean Results
Remove previous test results:
```bash
npm run clean-results
```

## Page Object Model

The project follows the Page Object Model (POM) pattern:

### BasePage.js
Contains common methods used across all pages:
- `clickButtonByRoleAndName()` - Click buttons by role and name
- Navigation utilities
- Common wait methods

### RatingWidgetPage.js
Contains methods specific to the rating widget:
- `verifyRatingHeading()` - Verify rating widget heading
- `clickRatingButton()` - Click specific rating buttons
- `verifyTellUsMoreHeading()` - Verify feedback form heading

### TellUsMorePage.js
Contains methods for the feedback form:
- `verifyFeedbackFormQuestions()` - Verify negative rating form questions
- `verifyPositiveFeedbackFormQuestions()` - Verify positive rating form questions
- `interactWithFeedbackForm()` - Interact with form elements
- `performCombinedValidationTest()` - Test form validation
- `verifySubmitButtonIsDisabled()` - Verify submit button state

## Configuration

### Playwright Configuration
The `playwright.config.js` file contains:
- Browser configurations (Chrome, Firefox, Safari)
- Test timeout settings
- Retry logic
- Screenshot and video recording settings
- Allure reporter configuration

### Key Configuration Options:
- **Timeout**: 30 seconds per test
- **Retries**: 2 retries on failure
- **Parallel Execution**: Tests run in parallel for faster execution
- **Screenshot**: Captured on failure
- **Video**: Recorded on failure
- **Module Type**: ES modules support

## Environment Variables

- `ENV`: Testing environment (qa, staging, production)
- `URL`: Base URL for testing
- `BROWSER`: Browser to use for testing (optional)

Environment variables are managed using the `dotenv` package and `cross-env` for cross-platform compatibility.

## CI/CD Integration

The test suite is designed to integrate with CI/CD pipelines. Example GitHub Actions workflow:

```yaml
name: WOGAA Sentiments Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:qa
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: allure-report
          path: allure-report/
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-test`
3. Commit your changes: `git commit -am 'Add new test feature'`
4. Push to the branch: `git push origin feature/new-test`
5. Submit a pull request

### Development Guidelines
- Follow ESLint rules and run `npm run lint` before committing
- Use ES modules (import/export syntax)
- Follow the existing Page Object Model pattern
- Include proper Allure annotations for reporting
- Write comprehensive test documentation

## Test Maintenance

### Adding New Tests
1. Create new test files in the `tests/` directory
2. Follow the existing naming convention
3. Use the established page object methods
4. Include proper Allure annotations
5. Run ESLint to ensure code quality

### Updating Page Objects
1. Add new methods to appropriate page object files
2. Follow the async/await pattern
3. Include proper error handling
4. Update method documentation
5. Use ES module syntax

## Troubleshooting

### Common Issues
1. **Browser not found**: Run `npx playwright install`
2. **Environment URL not set**: Check your `.env` file
3. **Test timeouts**: Increase timeout in `playwright.config.js`
4. **Flaky tests**: Add appropriate waits and retry logic
5. **ESLint errors**: Run `npm run lint` to identify and fix issues
6. **Allure reports not generating**: Ensure `allure-results` directory exists

### Debug Tips
- Use `--headed` flag to see browser actions
- Add `await page.pause()` to pause execution
- Use `console.log()` for debugging output
- Check browser console for JavaScript errors
- Use `npm run clean-results` to clear previous test data

## License

This project is licensed under the ISC License.

## Contact

**Author**: Suraj Suri  
**Repository**: https://github.com/Fikshan/wogaa  
**Issues**: https://github.com/Fikshan/wogaa/issues

For questions or support, please create an issue in the GitHub repository.
