# WOGAA Sentiments Widget - Playwright Testing

## Overview

This project contains automated end-to-end tests for the WOGAA (Whole-of-Government Application Analytics) Sentiments Widget using Playwright. The test suite validates the feedback collection flow for both negative ratings (1-4) and positive ratings (5-6).

## Project Structure

```
wogaa_sentiments_playwright/
├── tests/
│   ├── negativeRatings.spec.js    # Tests for ratings 1-4
│   ├── positiveRatings.spec.js    # Tests for ratings 5-6
├── pages/
│   ├── BasePage.js               # Base page object with common methods
│   ├── RatingWidgetPage.js       # Rating widget page object
│   └── TellUsMorePage.js         # Feedback form page object
├── helpers/
│   ├── PlaywrightControls.js     # Playwright utility controls
│   └── allureHelper.js           # Allure reporting helpers
├── allure-report/                # Allure test reports
├── test-results/                 # Test execution results
├── package.json                  # Dependencies and scripts
├── package-lock.json            # Lock file for dependencies
├── playwright.config.js         # Playwright configuration
└── .env.qa                      # Environment variables
```

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

- Node.js (v16 or higher)
- npm or yarn package manager
- Playwright browsers installed

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Fikshan/wogaa_sentiments_playwright.git
cd wogaa_sentiments_playwright
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

### .env.staging
```
ENV=staging
URL=https://your-staging-environment-url.com
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run specific test suites:
```bash
# Run negative ratings tests only
npx playwright test negativeRatings.spec.js

# Run positive ratings tests only
npx playwright test positiveRatings.spec.js
```

### Run tests with specific environment:
```bash
# Run with QA environment
ENV=qa npx playwright test

# Run with staging environment
ENV=staging npx playwright test
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
  "test:headed": "npx playwright test --headed",
  "test:debug": "npx playwright test --debug",
  "test:negative": "npx playwright test negativeRatings.spec.js",
  "test:positive": "npx playwright test positiveRatings.spec.js",
  "report": "npx playwright show-report",
  "allure:generate": "allure generate allure-results --clean",
  "allure:open": "allure open allure-report"
}
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
npm run allure:generate
npm run allure:open
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

## Environment Variables

- `ENV`: Testing environment (qa, staging, production)
- `URL`: Base URL for testing
- `BROWSER`: Browser to use for testing (optional)

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
      - run: npm test
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

## Test Maintenance

### Adding New Tests
1. Create new test files in the `tests/` directory
2. Follow the existing naming convention
3. Use the established page object methods
4. Include proper Allure annotations

### Updating Page Objects
1. Add new methods to appropriate page object files
2. Follow the async/await pattern
3. Include proper error handling
4. Update method documentation

## Troubleshooting

### Common Issues
1. **Browser not found**: Run `npx playwright install`
2. **Environment URL not set**: Check your `.env` file
3. **Test timeouts**: Increase timeout in `playwright.config.js`
4. **Flaky tests**: Add appropriate waits and retry logic

### Debug Tips
- Use `--headed` flag to see browser actions
- Add `await page.pause()` to pause execution
- Use `console.log()` for debugging output
- Check browser console for JavaScript errors

## License

This project is licensed under the MIT License.

## Contact

**Project Owner**: Suraj Suri  
**Repository**: https://github.com/Fikshan/wogaa_sentiments_playwright

For questions or support, please create an issue in the GitHub repository.
