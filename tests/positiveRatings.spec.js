console.log("Running positiveRatings.spec.js");
// This file is part of the WOGAA project.

import { test, expect } from "@playwright/test";
import PlaywrightControls from "helpers/PlaywrightControls.js";
import RatingWidget from "pages/RatingWidgetPage.js";
import TellUsMore from "pages/TellUsMorePage.js";
import { attachEnvInfo } from "helpers/allureHelper.js";
import BasePage from "pages/BasePage.js";
import * as allure from "allure-js-commons";

// Configuration
const POSITIVE_RATINGS = [5, 6];
const TEST_DATA = {
  LONG_TEXT: "a".repeat(256), // Exceeds 255 char limit
  POPUP_BUTTON_TEXT: "Help us improve popup",
  EXPECTED_TITLE: "WOGAA Documentation",
};

test.describe("WOGAA Positive Ratings Feedback Flow (Ratings 5-6)", () => {
  let controls, ratingWidget, basepage, tellUsMore;

  // Setup before each test with error handling
  test.beforeEach(async ({ page }) => {
    try {
      await attachEnvInfo();

      // Initialize page objects
      controls = new PlaywrightControls(page);
      ratingWidget = new RatingWidget(page);
      basepage = new BasePage(page);
      tellUsMore = new TellUsMore(page);

      await allure.epic("WOGAA Sentiments Widget");
      await allure.feature("Positive Ratings Feedback Collection (Ratings 5-6)");
      await allure.owner("suraj.suri");

      // Navigate and verify page load
      await controls.navigatetoURL();
      await expect(page).toHaveTitle(TEST_DATA.EXPECTED_TITLE);

      // wait for network to be idle
      await page.waitForLoadState("networkidle");
    } catch (error) {
      console.error("Setup failed in beforeEach:", error);
      await allure.attachment("Setup Error", error.message, "text/plain");
      throw error; 
    }
  });

  // Test for each positive rating using for...of loop
  for (const rating of POSITIVE_RATINGS) {
    test(`should display correct feedback form for rating ${rating}`, async ({ page }) => {
      try {
        await allure.description(`
                This test validates the feedback form for positive rating ${rating}.
                
                Test Steps:
                1. Open the rating widget
                2. Select rating "${rating}"
                3. Verify "Tell us more" heading appears
                4. Verify all required form questions are displayed:
                   - "Which areas contributed to your rating today?" (Required) - with positive options
                   - "Which are you interested in?" (Optional)
                   - "What did you like most?" (Optional)
                   - "Your email" (Optional)
                5. Verify form answer elements are properly displayed
            `);

        await allure.story(`Rating ${rating} Feedback Form UI Validation`);
        await allure.tags(
          "positive-rating",
          `rating-${rating}`,
          "feedback-form",
          "validation",
          "regression"
        );

        // Open rating widget and select the rating
          await allure.step("Open rating widget", async () => {
          await basepage.clickButtonByRoleAndName(TEST_DATA.POPUP_BUTTON_TEXT);
          await ratingWidget.verifyRatingHeading();
        });

          await allure.step(`Select rating ${rating}`, async () => {
          await ratingWidget.clickRatingButton(rating);
        });

          await allure.step("Verify feedback form", async () => {
          await ratingWidget.verifyTellUsMoreHeading();
          await tellUsMore.verifyPositiveFeedbackFormQuestions();
          await tellUsMore.verifyPositiveFormAnswerElements();
        });

      } catch (error) {
        console.error(`Test failed for rating ${rating}:`, error);
        
        // Capture screenshot on failure
        await page.screenshot({
          path: `allure-results/form-validation-error-${rating}-${Date.now()}.png`,
          fullPage: true,
        });
        
        // Add error details to allure
        await allure.attachment("Error Details", error.message, "text/plain");
        await allure.attachment("Error Stack", error.stack, "text/plain");
        
        // Re-throw to fail the test
        throw error;
      }
    });

    test(`should allow user to interact with feedback form for rating ${rating}`, async ({
      page,
    }) => {
      try {
        await allure.description(`
                This test validates user interactions with the feedback form for rating ${rating}.
                
                Test Steps:
                1. Open rating widget and select rating "${rating}"
                2. Interact with "Which areas contributed to your rating today?" checkboxes (positive options)
                3. Interact with "Which are you interested in?" checkboxes (Optional)
                4. Fill in "What did you like most?" text area (Optional)
                5. Fill in email field (Optional)
                6. Verify form can be closed
            `);

        await allure.story(`Rating ${rating} Form Interaction`);
        await allure.tags(
          "positive-rating",
          `rating-${rating}`,
          "form-interaction",
          "user-flow",
          "regression"
        );

        await allure.step("Open widget and select rating", async () => {
          await basepage.clickButtonByRoleAndName(TEST_DATA.POPUP_BUTTON_TEXT);
          await ratingWidget.clickRatingButton(rating);
          await ratingWidget.verifyTellUsMoreHeading();
        });

        await allure.step("Interact with form", async () => {
          await tellUsMore.interactWithPositiveFeedbackForm();
          await page.waitForTimeout(500);
        });

        await allure.step("Close form", async () => {
          await basepage.clickButtonByRoleAndName("Close");
          await page.waitForTimeout(1000);
        });

      } catch (error) {
        console.error(`Form interaction test failed for rating ${rating}:`, error);
        
        await page.screenshot({
          path: `allure-results/form-interaction-error-${rating}-${Date.now()}.png`,
          fullPage: true,
        });
        
        await allure.attachment("Interaction Error", error.message, "text/plain");
        throw error;
      }
    });

    test(`should display validation errors and disable submit button when text exceeds 255 characters and email is invalid for rating ${rating}`, async ({ page }) => {
      try {
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
          "positive-rating",
          `rating-${rating}`,
          "validation",
          "form-validation",
          "error-handling"
        );

        await allure.step("Setup and navigate to form", async () => {
          await basepage.clickButtonByRoleAndName(TEST_DATA.POPUP_BUTTON_TEXT);
          await ratingWidget.clickRatingButton(rating);
          await ratingWidget.verifyTellUsMoreHeading();
        });

        await allure.step("Perform validation test", async () => {
          await tellUsMore.performCombinedValidationTest();
        });

      } catch (error) {
        console.error(`Validation test failed for rating ${rating}:`, error);
        
        await page.screenshot({
          path: `allure-results/validation-error-${rating}-${Date.now()}.png`,
          fullPage: true,
        });
        
        await allure.attachment("Validation Error", error.message, "text/plain");
        throw error;
      }
    });

    test(`should keep submit button disabled when only optional checkboxes selected for rating ${rating}`, async ({ page }) => {
      try {
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
          "positive-rating",
          `rating-${rating}`,
          "submit-disabled",
          "optional-checkboxes"
        );

        await allure.step("Setup form", async () => {
          await basepage.clickButtonByRoleAndName(TEST_DATA.POPUP_BUTTON_TEXT);
          await ratingWidget.clickRatingButton(rating);
          await ratingWidget.verifyTellUsMoreHeading();
        });

        await allure.step("Test optional checkboxes", async () => {
          await tellUsMore.selectOptionalInterests();
          await tellUsMore.verifySubmitButtonIsDisabled();
        });

      } catch (error) {
        console.error(`Submit button test failed for rating ${rating}:`, error);
        
        await page.screenshot({
          path: `allure-results/submit-button-error-${rating}-${Date.now()}.png`,
          fullPage: true,
        });
        
        await allure.attachment("Submit Button Error", error.message, "text/plain");
        throw error;
      }
    });
  }

  test("should submit feedback form consistently across positive ratings", async () => {
  try {
    await allure.epic("WOGAA Sentiments Widget");
    await allure.feature("Positive Ratings Feedback Collection");
    await allure.story("Positive Ratings Form Consistency and Submission");
    await allure.owner("suraj.suri");
    await allure.tags(
      "positive-rating",
      "consistency",
      "form-structure", 
      "regression"
    );

    await allure.description(`
      This test validates that the feedback form structure is consistent across all positive ratings.
      
      Test Steps:
      1. Test each rating from 5 to 6
      2. Verify that the same form questions appear for all positive ratings
      3. Ensure consistent form structure and elements
      4. Submit the form after each rating
      5. Verify the thank you message after submission
    `);

    await allure.step("Validate form consistency across all positive ratings", async ({page}) => {
      for (const rating of POSITIVE_RATINGS) {
        console.log(`Testing consistency for rating ${rating}`);
        
        await basepage.clickButtonByRoleAndName(TEST_DATA.POPUP_BUTTON_TEXT);
        await ratingWidget.verifyRatingHeading();
        await ratingWidget.clickRatingButton(rating);
        await ratingWidget.verifyTellUsMoreHeading();

        // Verify consistent form structure for positive ratings
        await tellUsMore.verifyPositiveFeedbackFormQuestions();
        await tellUsMore.interactWithPositiveFeedbackFormAndSubmit();

         // Close the form to test next rating
        await page.waitForTimeout(1000);
        
        console.log(`Rating ${rating} consistency test completed successfully`);
      }
    });

  } catch (error) {
    console.error("Consistency test failed:", error);
    await allure.attachment("Consistency Test Error", error.message, "text/plain");
    throw error;
  }
});

  test.afterEach(async ({ page }, testInfo) => {
        try {
              console.log(`Test "${testInfo.title}" completed with status: ${testInfo.status}`);

              if (testInfo.status === "failed") 
      {
              await page.screenshot({
              path: `allure-results/positive-rating-failure-${Date.now()}.png`,
              fullPage: true,
            });
      }
    } catch (error) {
      console.error("Error in afterEach cleanup:", error);
    }        
  });
});