
import './loadEnv.js';

export default class PlaywrightControls {
  constructor(page) {
    if (!page) throw new Error('Playwright driver is not configured');
    this.page = page;
  }

  async navigatetoURL() {
    //console.log('Loaded URL from env:', process.env.URL);
    if (!process.env.URL) throw new Error('URL not defined');
    await this.page.goto(process.env.URL);
  }

  async singleClick(locatorValue) {
    await this.page.locator(locatorValue).click();
  }

  async clickByText(textValue) {
    await this.page.getByText(textValue).click();
  }
}