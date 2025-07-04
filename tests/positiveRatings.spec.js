console.log("Running positiveRatings.spec.js");
// This file is part of the WOGAA project.

import { test, expect } from "@playwright/test";
import PlaywrightControls from "../helpers/PlaywrightControls.js";
import RatingWidget from "../pages/RatingWidgetPage.js";
import TellUsMore from "../pages/TellUsMorePage.js";
import { attachEnvInfo } from "../helpers/allureHelper.js";
import * as allure from "allure-js-commons";
import BasePage from "../pages/BasePage.js";

test.describe("WOGAA Positive Ratings Feedback Flow (Ratings 5-6)", () => {
  let controls, ratingWidget, basepage, tellUsMore;

  // Setup before each test
  test.beforeEach(async ({ page }) => {
    await attachEnvInfo();
    controls = new PlaywrightControls(page);
    ratingWidget = new RatingWidget(page);
    basepage = new BasePage(page);
    tellUsMore = new TellUsMore(page);

    await allure.epic("WOGAA Sentiments Widget");
    await allure.feature("Positive Ratings Feedback Collection");
    await allure.owner("suraj.suri");
    await allure.parameter("Environment", process.env.TEST_ENV);
    await allure.parameter("Tested URL", process.env.BASE_URL);

    // Navigate to the page before each test
    await controls.navigatetoURL();
    await expect(page).toHaveTitle("WOGAA Documentation");
    await page.waitForLoadState("networkidle");
  });

  // Test for each positive rating (5-6)
  for (let rating = 5; rating <= 6; rating++) {
    test(`should display correct feedback form for rating ${rating}`, async () => {
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
      await basepage.clickButtonByRoleAndName("Help us improve popup");
      await ratingWidget.verifyRatingHeading();
      await ratingWidget.clickRatingButton(rating.toString());
      await ratingWidget.verifyTellUsMoreHeading();
      await tellUsMore.verifyPositiveFeedbackFormQuestions();
      await tellUsMore.verifyPositiveFormAnswerElements();
    });

    test(`should allow user to interact with feedback form for rating ${rating}`, async ({
      page,
    }) => {
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

      await basepage.clickButtonByRoleAndName("Help us improve popup");
      await ratingWidget.clickRatingButton(rating.toString());
      await ratingWidget.verifyTellUsMoreHeading();
      await tellUsMore.interactWithPositiveFeedbackForm();
      await page.waitForTimeout(500);
      await basepage.clickButtonByRoleAndName("Close");
      await page.waitForTimeout(1000);
    });

    test(`should display validation errors and disable submit button when text exceeds 255 characters and email is invalid for rating ${rating}`, async () => {
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
      await basepage.clickButtonByRoleAndName("Help us improve popup");
      await ratingWidget.clickRatingButton(rating.toString());
      await ratingWidget.verifyTellUsMoreHeading();
      await tellUsMore.performCombinedValidationTest();
    });

    test(`should keep submit button disabled when only optional checkboxes selected for rating ${rating}`, async () => {
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

      await basepage.clickButtonByRoleAndName("Help us improve popup");
      await ratingWidget.clickRatingButton(rating.toString());
      await ratingWidget.verifyTellUsMoreHeading();
      await tellUsMore.selectOptionalInterests();
      await tellUsMore.verifySubmitButtonIsDisabled();
    });
  }

  test(`should submit the feedback form across all positive ratings`, async () => {
    await allure.description(`
            This test validates that the feedback form structure is consistent across all positive ratings.
            
            Test Steps:
            1. Test each rating from 5 to 6
            2. Verify that the same form questions appear for all positive ratings
            3. Ensure consistent form structure and elements
            4. Submit the form after each rating to prepare for the next
            5. Verify the thank you message after submission
        `);

    await allure.story("Positive Ratings Form Consistency and Submission");
    await allure.tags(
      "positive-rating",
      "consistency",
      "form-structure",
      "regression"
    );

    for (let rating = 5; rating <= 6; rating++) {
      await allure.step(
        `Testing rating ${rating} form consistency`,
        async () => {
          await basepage.clickButtonByRoleAndName("Help us improve popup");
          await ratingWidget.clickRatingButton(rating.toString());
          await ratingWidget.verifyTellUsMoreHeading();

          // Verify consistent form structure for positive ratings
          await tellUsMore.verifyPositiveFeedbackFormQuestions();
          await tellUsMore.interactWithPositiveFeedbackFormAndSubmit();
        }
      );
    }
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.log(
      `Test "${testInfo.title}" completed with status: ${testInfo.status}`
    );

    if (testInfo.status === "failed") {
      await page.screenshot({
        path: `allure-results/positive-rating-failure-${Date.now()}.png`,
        fullPage: true,
      });
    }
  });
});
