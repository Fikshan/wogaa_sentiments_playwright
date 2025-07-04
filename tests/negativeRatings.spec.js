console.log("Running negativeRatings.spec.js");
// This file is part of the WOGAA project.

import { test, expect } from "@playwright/test";
import PlaywrightControls from "../helpers/PlaywrightControls.js";
import RatingWidget from "../pages/RatingWidgetPage.js";
import TellUsMore from "../pages/TellUsMorePage.js";
import { attachEnvInfo } from "../helpers/allureHelper.js";
import * as allure from "allure-js-commons";
import BasePage from "../pages/BasePage.js";

test.describe("WOGAA Negative Ratings Feedback Flow (Ratings 1-4)", () => {
  let controls, ratingWidget, basepage, tellUsMore;

  // Setup before each test
  test.beforeEach(async ({ page }) => {
    await attachEnvInfo();
    controls = new PlaywrightControls(page);
    ratingWidget = new RatingWidget(page);
    basepage = new BasePage(page);
    tellUsMore = new TellUsMore(page);

    await allure.epic("WOGAA Sentiments Widget");
    await allure.feature("Negative Ratings Feedback Collection");
    await allure.owner("suraj.suri");
    await allure.parameter("Environment", process.env.TEST_ENV);
    await allure.parameter("Tested URL", process.env.BASE_URL);

    // Navigate to the page before each test
    await controls.navigatetoURL();
    await expect(page).toHaveTitle("WOGAA Documentation");
    await page.waitForLoadState("networkidle");
  });

  // Test for each negative rating (1-4)
  for (let rating = 1; rating <= 4; rating++) {
    test(`should display correct feedback form for rating ${rating}`, async ({
      page,
    }) => {
      await allure.description(`
                This test validates the feedback form for negative rating ${rating}.
                
                Test Steps:
                1. Open the rating widget
                2. Select rating "${rating}"
                3. Verify "Tell us more" heading appears
                4. Verify all required form questions are displayed:
                   - "Which areas contributed to your rating today?" (Required)
                   - "Which are you interested in?" (Optional)
                   - "What did you like least?" (Optional)
                   - "Your email" (Optional)
                5. Verify form elements are properly displayed
            `);

      await allure.story(`Rating ${rating} Feedback Form Validation`);
      await allure.tags(
        "negative-rating",
        `rating-${rating}`,
        "feedback-form",
        "validation",
        "regression"
      );

      // Open rating widget and select the rating
      await basepage.clickButtonByRoleAndName("Help us improve popup");
      await ratingWidget.verifyRatingHeading();
      await ratingWidget.clickRatingButton(rating.toString());

      // Verify "Tell us more" heading
      await ratingWidget.verifyTellUsMoreHeading();

      // Verify main feedback questions
      await tellUsMore.verifyFeedbackFormQuestions();

      // Verify form structure and elements
      await tellUsMore.verifyFormElements();
    });

    test(`should allow user to interact with feedback form for rating ${rating}`, async ({
      page,
    }) => {
      await allure.description(`
                This test validates user interactions with the feedback form for rating ${rating}.
                
                Test Steps:
                1. Open rating widget and select rating "${rating}"
                2. Interact with "Which areas contributed to your rating today?" checkboxes
                3. Interact with "Which are you interested in?" checkboxes (Optional)
                4. Fill in "What did you like least?" text area (Optional)
                5. Fill in email field (Optional)
                6. Verify form can be closed
            `);

      await allure.story(`Rating ${rating} Form Interaction`);
      await allure.tags(
        "negative-rating",
        `rating-${rating}`,
        "form-interaction",
        "user-flow",
        "regression"
      );

      // Open rating widget and select the rating
      await basepage.clickButtonByRoleAndName("Help us improve popup");
      await ratingWidget.clickRatingButton(rating.toString());
      await ratingWidget.verifyTellUsMoreHeading();

      // Interact with form elements
      await tellUsMore.interactWithFeedbackForm();
      await page.waitForTimeout(2000); // Wait for interactions to complete
      // Verify form can be closed
      await basepage.clickButtonByRoleAndName("Close");
      await page.waitForTimeout(1000);
    });

    test(`should display validation errors and disable submit button when text exceeds 255 characters and email is invalid for rating ${rating}`, async ({
      page,
    }) => {
      await allure.description(`
      This test validates that validation errors appear and submit button is disabled 
      when both text exceeds 255 characters and email is invalid for rating ${rating}.
      
      Test Steps:
      1. Open rating widget and select rating "${rating}"
      2. Enter text exceeding 255 characters in feedback textarea
      3. Enter invalid email address
      4. Verify character count validation message appears
      5. Verify email validation message appears
      6. Verify submit button is disabled
  `);

      await allure.story(`Rating ${rating} Error Validation Test`);
      await allure.tags(
        "negative-rating",
        `rating-${rating}`,
        "validation",
        "form-validation",
        "error-handling"
      );

      // Open rating widget and select the rating
      await basepage.clickButtonByRoleAndName("Help us improve popup");
      await ratingWidget.clickRatingButton(rating.toString());
      await ratingWidget.verifyTellUsMoreHeading();

      // Perform combined validation test using page object methods
      await tellUsMore.performCombinedValidationTest();
      await page.waitForTimeout(100);
    });

    test(`should keep submit button disabled when only optional checkboxes selected for rating ${rating}`, async ({
      page,
    }) => {
      await allure.description(`
        This test ensures that selecting only the optional checkboxes under 
        "Which are you interested in?" does NOT enable the submit button 
        for rating ${rating}.
        
        Test Steps:
        1. Open the rating widget and select rating "${rating}"
        2. Select all three optional checkboxes:
           - Informational Services
           - Transactional Services
           - Mobile Applications
        3. Ensure the mandatory field "Which areas contributed to your rating today?" is not filled
        4. Verify the submit button remains disabled
      `);

      await allure.story(
        `Rating ${rating} Submit Button should be Disabled with Checkbox selection Only`
      );
      await allure.tags(
        "negative-rating",
        `rating-${rating}`,
        "submit-disabled",
        "optional-checkboxes"
      );

      await basepage.clickButtonByRoleAndName("Help us improve popup");
      await ratingWidget.clickRatingButton(rating.toString());
      await ratingWidget.verifyTellUsMoreHeading();

      await tellUsMore.selectOptionalInterests();
      await tellUsMore.verifySubmitButtonIsDisabled();

      await page.waitForTimeout(1000);
    });
  }

    test(`should submit the feedback form across all negative ratings`, async ({
    page,
  }) => {
    await allure.description(`
            This test validates that the feedback form structure is consistent across all negative ratings.
            
            Test Steps:
            1. Test each rating from 1 to 4
            2. Verify that the same form questions appear for all negative ratings
            3. Ensure consistent form structure and elements
            4. Submit the form after each rating to prepare for the next
            5. Verify the thank you message after submission
        `);

    await allure.story("Negative Ratings Form Consistency and Submission");
    await allure.tags(
      "negative-rating",
      "consistency",
      "form-structure",
      "regression"
    );

    for (let rating = 1; rating <= 4; rating++) {
      await allure.step(
        `Testing rating ${rating} form consistency`,
        async () => {
          // Open rating widget and select the rating
          await basepage.clickButtonByRoleAndName("Help us improve popup");
          await ratingWidget.clickRatingButton(rating.toString());
          await ratingWidget.verifyTellUsMoreHeading();

          // Verify consistent form structure
          await tellUsMore.verifyFeedbackFormQuestions();
          await tellUsMore.interactWithFeedbackFormAndSubmit();

          // Close the form to test next rating
          //await basepage.clickButtonByRoleAndName('Close');
          await page.waitForTimeout(1000); // Small delay between iterations
        }
      );
    }
  });

  // Cleanup after each test
  test.afterEach(async ({ page }, testInfo) => {
    console.log(
      `Test "${testInfo.title}" completed with status: ${testInfo.status}`
    );

    if (testInfo.status === "failed") {
      // Take screenshot on failure
      await page.screenshot({
        path: `allure-results/negative-rating-failure-${Date.now()}.png`,
        fullPage: true,
      });
    }
  });
});
