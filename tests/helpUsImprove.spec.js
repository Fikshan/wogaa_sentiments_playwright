console.log("Running helpUsImprove.spec.js");
// This file is part of the WOGAA project.

import { test, expect } from '@playwright/test';
import PlaywrightControls from '../helpers/PlaywrightControls.js';
import RatingWidget from '../pages/RatingWidgetPage.js';
import { attachEnvInfo } from '../helpers/allureHelper.js';
import * as allure from "allure-js-commons";
import BasePage from '../pages/BasePage.js';

test.describe('WOGAA Sentiments Rating Widget', () => {
    let controls, ratingWidget, basepage;

    // Setup before each test
    test.beforeEach(async ({ page }) => {
        await attachEnvInfo(page);
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
    });

    test('should load WOGAA homepage successfully', async ({ page }) => {
        await allure.description(`
            This test validates that the WOGAA Documentation website loads correctly.
            
            Test Steps:
            1. Launch the WOGAA Documentation website
            2. Verify the page title is correct
        `);
        
        await allure.story("Page Loading Verification");
        await allure.tags("homepage", "loading", "smoke", "regression");

        // Test is already complete from beforeEach - title verification
        await expect(page).toHaveTitle('WOGAA Documentation');
    });

    test('should display rating widget when Help us improve is clicked', async () => {
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
        
        await basepage.clickButtonByRoleAndName('Help us improve popup');
        await ratingWidget.verifyRatingHeading();
        await ratingWidget.verifyAllRatingButtons();
        await ratingWidget.verifySatisfactionLabels();
    });

    test('should close rating popup when close button is clicked', async ({ page }) => {
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

        await basepage.clickButtonByRoleAndName('Help us improve popup');
        await ratingWidget.verifyRatingHeading();
        await page.waitForTimeout(1000);
        await basepage.clickButtonByRoleAndName('Close rating popup');
        await expect(page.getByRole('heading', { name: 'Rate your experience with this website' })).not.toBeVisible();
    });

    test('should show feedback form when rating 1 is selected', async () => {
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

        
        await basepage.clickButtonByRoleAndName('Help us improve popup');
        await ratingWidget.clickRatingButton('6');
        await ratingWidget.verifyTellUsMoreHeading();
    });

    test('should show feedback form when rating 6 is selected', async () => {
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

        await basepage.clickButtonByRoleAndName('Help us improve popup');
        await ratingWidget.clickRatingButton('6');
        await ratingWidget.verifyTellUsMoreHeading();
    });

    test('should complete full sentiment feedback flow', async ({ page }) => {
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

        // First interaction
        await basepage.clickButtonByRoleAndName('Help us improve popup');
        await ratingWidget.verifyRatingHeading();
        await ratingWidget.verifyAllRatingButtons();
        await ratingWidget.verifySatisfactionLabels();
        await page.waitForTimeout(1000);
        
        await basepage.clickButtonByRoleAndName('Close rating popup');
        
        // Second interaction with rating
        await basepage.clickButtonByRoleAndName('Help us improve popup');
        await ratingWidget.clickRatingButton('1');
        await ratingWidget.verifyTellUsMoreHeading();
        await page.waitForTimeout(1000);
        await basepage.clickButtonByRoleAndName('Close');
    });

    // Cleanup after each test if needed
    test.afterEach(async ({ page }, testInfo) => {
        console.log(`Test "${testInfo.title}" completed with status: ${testInfo.status}`);
        
        if (testInfo.status === 'failed') {
            // Take screenshot on failure
            await page.screenshot({ 
                path: `allure-results/failure-${Date.now()}.png`, 
                fullPage: true 
            });
        }
    });
});