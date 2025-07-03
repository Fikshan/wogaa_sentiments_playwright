import { expect } from "@playwright/test";
import BasePage from "./BasePage.js";

let basepage;

export default class TellUsMorePage {
  constructor(page) {
    if (!page) throw new Error("Playwright driver is not configured");
    this.page = page;
    basepage = new BasePage(page);
  }

  async click(locator) {
    await this.page.locator(locator).click();
  }

  async fill(locator, text) {
    await this.page.locator(locator).fill(text);
  }

  async clickButtonByRoleAndName(buttonText) {
    await this.page
      .getByRole("button", { name: buttonText, exact: true })
      .click();
  }

  async verifyFeedbackFormQuestions() {
    // 1. Verify "Which areas contributed to your rating today?" (Required)
    await expect(this.page.getByText("Which areas contributed to your rating today?")).toBeVisible();
    await expect(this.page.getByText("Select all that apply")).toBeVisible();
    await expect(this.page.getByText("Which are you interested in?")).toBeVisible();
    await expect(this.page.getByText("What did you like least?")).toBeVisible();
    await expect(this.page.getByText("Your email")).toBeVisible();
    await this.page.waitForTimeout(100);
  }

async  interactWithFeedbackForm() {
       
        await this.page.getByText('Technical errors').click();
        await this.page.getByText('Difficult to navigate').click();
      
        await this.page.getByText('Informational Services').click();
        
        // Fill in the text area
        await this.page.getByPlaceholder('Type your reply here').fill('The website needs improvement in navigation and loading speed.');
        
        // Fill in email (optional)
        await this.page.getByPlaceholder('Type your email here').fill('test@example.com');
        
        // Verify that form accepts the input
        await expect(this.page.getByPlaceholder('Type your reply here')).toHaveValue('The website needs improvement in navigation and loading speed.');
        await expect(this.page.getByPlaceholder('Type your email here')).toHaveValue('test@example.com');
}

async  verifyFormElements() {
            const contributingAreas = [
                'Technical errors',
                'Couldn\'t find content',
                'Difficult to navigate',
                'Website loaded slowly',
                'Content not clear',
                'Others'
            ];
            
            for (const area of contributingAreas) {
                await expect(this.page.getByText(area)).toBeVisible();
            } 

            const interests = [
                'Informational Services',
                'Transactional Services',
                  'Mobile Applications'
            ];
            
              for (const labelText of interests) {
                  const checkbox = this.page.getByLabel(labelText);
                  await expect(checkbox).toBeVisible();
}
            
            await expect(this.page.getByPlaceholder('Type your reply here')).toBeVisible();
            await expect(this.page.getByPlaceholder('Type your email here')).toBeVisible();
            await expect(this.page.getByRole('button', { name: 'SUBMIT' })).toBeVisible();
}

async verifyFormElementsAndSubmit() {
            // Verify checkboxes for "Which areas contributed to your rating today?"
            const contributingAreas = [
                'Technical errors',
                'Couldn\'t find content',
                'Difficult to navigate',
                'Website loaded slowly',
                'Content not clear',
                'Others'
            ];
            
            for (const area of contributingAreas) {
                await expect(this.page.getByText(area)).toBeVisible();
            } 
            
            //Verify checkboxes for "Which are you interested in?"
            const interests = [
                'Informational Services',
                'Transactional Services',
                //'Mobile Applications'
            ];
            
            for (const interest of interests) {
                await expect(this.page.getByText(interest)).toBeVisible();
            }

            // await expect(this.page.getByText("Informational Services")).toBeVisible();
            // await expect(this.page.getByText("Transactional Services")).toBeVisible();
            // await expect(this.page.getByText("Mobile Applications")).toBeVisible();
            
            // Verify text area for "What did you like least?"
            await expect(this.page.getByPlaceholder('Type your reply here')).toBeVisible();
            
            // Verify email input field
            await expect(this.page.getByPlaceholder('Type your email here')).toBeVisible();
            
            // Verify submit button
            await expect(this.page.getByRole('button', { name: 'SUBMIT' })).toBeVisible();
}

async interactWithFeedbackFormAndSubmit() {
        await this.page.getByText('Technical errors').click();
        await this.page.getByText('Difficult to navigate').click();

        await this.page.getByLabel("Informational Services").click();
        await this.page.getByLabel("Transactional Services").click();
        await this.page.getByLabel("Mobile Applications").click();
  
        await this.page.getByPlaceholder('Type your reply here').fill('The website needs improvement in navigation and loading speed.');
        await this.page.getByPlaceholder('Type your email here').fill('test@example.com');
        
        await expect(this.page.getByPlaceholder('Type your reply here')).toHaveValue('The website needs improvement in navigation and loading speed.');
        await expect(this.page.getByPlaceholder('Type your email here')).toHaveValue('test@example.com');
        await expect(this.page.getByRole('button', { name: 'SUBMIT' })).toBeVisible();
        await this.page.getByRole('button', { name: 'SUBMIT' }).click();
        await this.page.waitForTimeout(500);
        expect(this.page.getByText('Thank you for your feedback!')).toBeVisible
}

async fillLongFeedbackText() {
    const longText = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.';
    await this.page.getByPlaceholder('Type your reply here').pressSequentially(longText);
}

async fillInvalidEmail() {
    await this.page.getByPlaceholder('Type your email here').pressSequentially("invalidEmail",{ delay:100 });
}

async waitForValidationMessages() {
    await this.page.waitForSelector('[aria-label*="Character count exceeded"]');
    await this.page.waitForSelector('[aria-label="Alert, Please enter a valid email."]');
}

async verifyCharacterCountValidation() {
    const characterCountMessage = await this.page.locator('[aria-label*="Character count exceeded"]');
    await expect(characterCountMessage).toBeVisible();
    
    // Extract character count from aria-label to verify it's > 255
    const ariaLabel = await characterCountMessage.getAttribute('aria-label');
    const characterCount = ariaLabel.match(/(\d+) out of 255/)[1];
    expect(parseInt(characterCount)).toBeGreaterThan(255);
    
    return parseInt(characterCount);
}

async verifyEmailValidation() {
    const emailValidationMessage = await this.page.locator('[aria-label="Alert, Please enter a valid email."]');
    await expect(emailValidationMessage).toBeVisible();
    await expect(emailValidationMessage).toHaveText('Please enter a valid email.');
}

async verifySubmitButtonDisabled() {
    const submitButton = await this.page.locator('button:has-text("SUBMIT")');
    await expect(submitButton).toBeDisabled();
}

async verifySubmitButtonEnabled() {
    const submitButton = await this.page.locator('button:has-text("SUBMIT")');
    await expect(submitButton).toBeEnabled();
}

async performCombinedValidationTest() {
    await this.fillLongFeedbackText();
    await this.fillInvalidEmail();
    await this.waitForValidationMessages();
    await this.verifyCharacterCountValidation();
    await this.verifyEmailValidation();
    await this.verifySubmitButtonDisabled();
}

async selectOptionalInterests() {
    await this.page.getByLabel("Informational Services").click();
    await this.page.getByLabel("Transactional Services").click();
    await this.page.getByLabel("Mobile Applications").click();
}

async verifySubmitButtonIsDisabled() {
    const submitButton = this.page.getByRole("button", { name: "SUBMIT" });
    await expect(submitButton).toBeDisabled();
}

async verifyPositiveFeedbackFormQuestions() {
    await expect(this.page.getByText("Which areas contributed to your rating today?")).toBeVisible();
    await expect(this.page.getByText("Select all that apply")).toBeVisible();
    await expect(this.page.getByText("Which are you interested")).toBeVisible();
    await expect(this.page.getByText("What did you like most")).toBeVisible();
    await expect(this.page.getByText("Your email")).toBeVisible();
}

async interactWithPositiveFeedbackForm() {
  await this.page.getByText("Website is great").click();
  await this.page.getByText("Website loaded fast").click();
  await this.page.getByText("Content was clear").click();
  await this.page.getByLabel("Informational Services").click();
  await this.page.getByLabel("Transactional Services").click();
  await this.page.getByLabel("Mobile Applications").click();
  await this.page.getByPlaceholder('Type your reply here').pressSequentially('Great user experience and fast loading times.');
  await this.page.getByPlaceholder('Type your email here').pressSequentially('positive.feedback@test.com');
  await expect(this.page.getByRole('button', { name: 'SUBMIT' })).toBeVisible();
}

async interactWithPositiveFeedbackFormAndSubmit() {
  await this.page.getByText("Website is great").click();
  await this.page.getByText("Website loaded fast").click();
  await this.page.getByText("Content was clear").click();
  await this.page.getByLabel("Informational Services").click();
  await this.page.getByLabel("Transactional Services").click();
  await this.page.getByLabel("Mobile Applications").click();
  await this.page.getByPlaceholder('Type your reply here').pressSequentially('Great user experience and fast loading times.');
  await this.page.getByPlaceholder('Type your email here').pressSequentially('positive.feedback@test.com');
  await expect(this.page.getByRole('button', { name: 'SUBMIT' })).toBeVisible();
  await this.page.getByRole('button', { name: 'SUBMIT' }).click();
  await this.page.waitForTimeout(100);
  await expect(this.page.getByText('Thank you for your feedback!')).toBeVisible
  await this.page.waitForTimeout(500);
}

async selectPositiveContributionAreas() {
  await this.page.locator('text="Website is great"').click();
  await this.page.locator('text="Easy to navigate"').click();
  await this.page.locator('text="Easy to find content"').click();
}

async verifyPositiveFormAnswerElements() {
    const contributingAreas = [
        'Website is great',
        'Website loaded fast',
        'Easy to navigate',
        'Easy to find content',
        'Content was clear',
        'Others'
    ];
    
    for (const area of contributingAreas) {
        await expect(this.page.getByText(area)).toBeVisible();
    }
    
    const interests = [
        'Informational Services',
        'Transactional Services',
        'Mobile Applications'
    ];

    for (const labelText of interests) {
      const checkbox = this.page.getByLabel(labelText);
      await expect(checkbox).toBeVisible();
}
    await expect(this.page.getByPlaceholder('Type your reply here')).toBeVisible();
    await expect(this.page.getByPlaceholder('Type your email here')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'SUBMIT' })).toBeVisible();
}

async fillPositiveFeedbackFormWithValidData() {
  await this.selectPositiveContributionAreas();
  
  // Fill optional textarea with valid content (under 255 characters)
  await this.page.locator('textarea[placeholder*="Type your reply here"]').fill('Excellent website with great functionality and user experience.');
  
  // Fill valid email
  await this.page.locator('input[type="email"]').fill('valid.email@example.com');
  
  // Select optional interests
  await this.page.locator('text="Informational Services"').click();
}
/**
 * Fill valid feedback text (under 255 characters)
 * @param {string} text - The text to enter (default: short valid text)
 */
async fillValidFeedbackText(text = 'This is a valid feedback message that is under 255 characters.') {
    await this.page.getByPlaceholder('Type your reply here').fill(text);
}

/**
 * Fill valid email
 * @param {string} email - The valid email to enter (default: 'test@example.com')
 */
async fillValidEmail(email = 'test@example.com') {
    await this.page.getByPlaceholder('Type your email here').fill(email);
}

/**
 * Clear all form fields
 */
async clearAllFields() {
    await this.page.getByPlaceholder('Type your reply here').clear();
    await this.page.getByPlaceholder('Type your email here').clear();
}
    
    
}
