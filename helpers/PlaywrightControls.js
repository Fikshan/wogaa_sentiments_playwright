//const { test, expect, request } = require("@playwright/test");

import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.ENV || 'qa'}` });

export default class PlaywrightControls {
  constructor(page) {
    if (!page) throw new Error('Playwright driver is not configured');
    this.page = page;
  }

  async navigatetoURL() {
    console.log('Loaded URL from env:', process.env.URL);
    if (!process.env.URL) throw new Error('URL not defined');
    await this.page.goto(process.env.URL);
  }

  async singleClick(locatorValue) {
    await this.page.locator(locatorValue).click();
  }

  async clickButtonByRoleAndName(buttonText) {
    await this.page.getByRole('button', { name: buttonText, exact: true }).click();
  }

  async clickByText(textValue) {
    console.log(`🖱️ Clicking element with text: ${textValue}`);
    await this.page.getByText(textValue).click();
  }
}