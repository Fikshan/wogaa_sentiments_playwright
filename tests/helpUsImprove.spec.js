console.log("Running helpUsImprove.spec.js");
// This file is part of the WOGAA project.

import { test, expect } from '@playwright/test';
import PlaywrightControls from "helpers/PlaywrightControls.js";
import RatingWidget from "pages/RatingWidgetPage.js";
import { attachEnvInfo } from "helpers/allureHelper.js";
import BasePage from "pages/BasePage.js";
import * as allure from "allure-js-commons";

test.describe('WOGAA Sentiments Rating Widget', () => {
    let controls, ratingWidget, basepage;

    // Setup before each test with error handling
    test.beforeEach(async ({ page }) => {
        try {
            await attachEnvInfo();
            controls = new PlaywrightControls(page);
            ratingWidget = new RatingWidget(page);
            basepage = new BasePage(page);

            await allure.epic("WOGAA Sentiments Widget");
            await allure.feature("Feedback UI Collection Flow");
            await allure.owner('suraj.suri');

            // Navigate to the page before each test
            await controls.navigatetoURL();
            await expect(page).toHaveTitle('WOGAA Documentation');
            await page.waitForLoadState('networkidle');
        } catch (error) {
            console.error("Setup failed in beforeEach:", error);
            
            // Capture screenshot on setup failure
            const screenshot = await page.screenshot({ fullPage: true });
            await allure.attachment("Setup Failure Screenshot", screenshot, "image/png");
            await allure.attachment("Setup Error", error.message, "text/plain");
            
            throw error; 
        }
    });

    test('should load WOGAA homepage successfully', async ({ page }) => {
        try {
            await allure.description(`
                This test validates that the WOGAA Documentation website loads correctly.
                
                Test Steps:
                1. Launch the WOGAA Documentation website
                2. Verify the page title is correct
            `);
            
            await allure.story("Page Loading Verification");
            await allure.tags("homepage", "loading", "smoke", "regression");

            await allure.step("Verify page title", async () => {
                // Test is already complete from beforeEach - title verification
                await expect(page).toHaveTitle('WOGAA Documentation');
            });

        } catch (error) {
            console.error("Homepage loading test failed:", error);
            
            // Capture screenshot on failure
            const screenshot = await page.screenshot({ fullPage: true });
            await allure.attachment("Homepage Loading Failure Screenshot", screenshot, "image/png");
            await allure.attachment("Error Details", error.message, "text/plain");
            await allure.attachment("Page URL", page.url(), "text/plain");
            
            throw error;
        }
    });

    test('should display rating widget when Help us improve is clicked', async ({ page }) => {
        try {
            await allure.description(`
                This test validates that the sentiment rating widget appears correctly.
                
                Test Steps:
                1. Click on the 'Help us improve' ribbon button
                2. Verify the rating widget opens
                3. Verify the prompt heading: "Rate your experience with this website"
                4. Verify all six rating buttons (1 to 6) are visible
                5. Confirm the satisfaction scale labels: "NOT SATISFIED" and "VERY SATISFIED"
            `);

            await allure.story("Rating Widget Display");
            await allure.tags("widget", "ui", "display", "regression");
            
            await allure.step("Click Help us improve button", async () => {
                await basepage.clickButtonByRoleAndName('Help us improve popup');
            });

            await allure.step("Verify rating widget elements", async () => {
                await ratingWidget.verifyRatingHeading();
                await ratingWidget.verifyAllRatingButtons();
                await ratingWidget.verifySatisfactionLabels();
            });

        } catch (error) {
            console.error("Rating widget display test failed:", error);
            
            // Capture screenshot on failure
            const screenshot = await page.screenshot({ fullPage: true });
            await allure.attachment("Rating Widget Display Failure Screenshot", screenshot, "image/png");
            await allure.attachment("Error Details", error.message, "text/plain");
            await allure.attachment("Error Stack", error.stack, "text/plain");
            
            throw error;
        }
    });

    test('should close rating popup when close button is clicked', async ({ page }) => {
        try {
            await allure.description(`
                This test validates the rating popup can be closed properly.
                
                Test Steps:
                1. Open the rating widget
                2. Click the close button
                3. Verify the popup is closed
                4. Confirm the rating heading is no longer visible
            `);

            await allure.story("Rating Widget Close Functionality");
            await allure.tags("widget", "close", "ui", "regression");

            await allure.step("Open rating widget", async () => {
                await basepage.clickButtonByRoleAndName('Help us improve popup');
                await ratingWidget.verifyRatingHeading();
            });

            await allure.step("Close rating popup", async () => {
                await basepage.clickButtonByRoleAndName('Close rating popup');
                await expect(page.getByRole('heading', { name: 'Rate your experience with this website' })).not.toBeVisible();
            });

        } catch (error) {
            console.error("Rating popup close test failed:", error);
            
            // Capture screenshot on failure
            const screenshot = await page.screenshot({ fullPage: true });
            await allure.attachment("Rating Popup Close Failure Screenshot", screenshot, "image/png");
            await allure.attachment("Error Details", error.message, "text/plain");
            await allure.attachment("Current Page State", await page.content(), "text/html");
            
            throw error;
        }
    });

    test('should show feedback form when rating 1 is selected', async ({ page }) => {
        try {
            await allure.description(`
                This test validates the feedback flow for negative ratings.
                
                Test Steps:
                1. Open the rating widget
                2. Select rating "1" (lowest rating)
                3. Verify the follow-up feedback prompt appears
                4. Verify heading: "Tell us more"
            `);

            await allure.story("Negative Rating Feedback Flow");
            await allure.tags("rating", "feedback", "negative", "regression");

            await allure.step("Open rating widget", async () => {
                await basepage.clickButtonByRoleAndName('Help us improve popup');
            });

            await allure.step("Select rating 1", async () => {
                await ratingWidget.clickRatingButton('1');
            });

            await allure.step("Verify feedback form appears", async () => {
                await ratingWidget.verifyTellUsMoreHeading();
            });

        } catch (error) {
            console.error("Rating 1 feedback flow test failed:", error);
            
            // Capture screenshot on failure
            const screenshot = await page.screenshot({ fullPage: true });
            await allure.attachment("Rating 1 Feedback Flow Failure Screenshot", screenshot, "image/png");
            await allure.attachment("Error Details", error.message, "text/plain");
            await allure.attachment("Error Stack", error.stack, "text/plain");
            

            throw error;
        }
    });

    test('should show feedback form when rating 6 is selected', async ({ page }) => {
        try {
            await allure.description(`
                This test validates the feedback flow for positive ratings.
                
                Test Steps:
                1. Open the rating widget
                2. Select rating "6" (highest rating)
                3. Verify the follow-up feedback prompt appears
                4. Verify heading: "Tell us more"
            `);

            await allure.story("Positive Rating Feedback Flow");
            await allure.tags("rating", "feedback", "positive", "regression");

            await allure.step("Open rating widget", async () => {
                await basepage.clickButtonByRoleAndName('Help us improve popup');
            });

            await allure.step("Select rating 6", async () => {
                await ratingWidget.clickRatingButton('6');
            });

            await allure.step("Verify feedback form appears", async () => {
                await ratingWidget.verifyTellUsMoreHeading();
            });

        } catch (error) {
            console.error("Rating 6 feedback flow test failed:", error);
            
            // Capture screenshot on failure
            const screenshot = await page.screenshot({ fullPage: true });
            await allure.attachment("Rating 6 Feedback Flow Failure Screenshot", screenshot, "image/png");
            await allure.attachment("Error Details", error.message, "text/plain");
            await allure.attachment("Error Stack", error.stack, "text/plain");
            
            throw error;
        }
    });

    test('should complete full sentiment feedback flow', async ({ page }) => {
        try {
            await allure.description(`
                This test validates the complete sentiment feedback flow.
                
                Test Steps:
                1. Open the rating widget
                2. Verify all elements are present
                3. Select a rating
                4. Verify feedback form appears
                5. Close the feedback form
                6. Reopen and test different rating
            `);

            await allure.story("Complete Sentiment Feedback Flow");
            await allure.tags("sentiment", "feedback", "ui", "e2e", "regression");

            await allure.step("First interaction - verify widget elements", async () => {
                await basepage.clickButtonByRoleAndName('Help us improve popup');
                await ratingWidget.verifyRatingHeading();
                await ratingWidget.verifyAllRatingButtons();
                await ratingWidget.verifySatisfactionLabels();
                await page.waitForTimeout(1000);
            });

            await allure.step("Close rating popup", async () => {
                await basepage.clickButtonByRoleAndName('Close rating popup');
            });

            await allure.step("Second interaction - test rating selection", async () => {
                await basepage.clickButtonByRoleAndName('Help us improve popup');
                await ratingWidget.clickRatingButton('1');
                await ratingWidget.verifyTellUsMoreHeading();
                await page.waitForTimeout(1000);
                await basepage.clickButtonByRoleAndName('Close');
            });

        } catch (error) {
            console.error("Complete sentiment feedback flow test failed:", error);
            
            // Capture screenshot on failure
            const screenshot = await page.screenshot({ fullPage: true });
            await allure.attachment("Complete Sentiment Flow Failure Screenshot", screenshot, "image/png");
            await allure.attachment("Error Details", error.message, "text/plain");
            await allure.attachment("Error Stack", error.stack, "text/plain");
            
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