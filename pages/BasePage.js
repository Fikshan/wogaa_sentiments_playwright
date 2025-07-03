export default class BasePage {
  constructor(page) {
    if (!page) throw new Error('Playwright driver is not configured');
    this.page = page;
  }

  async click(locator) {
    await this.page.locator(locator).click();
  }

  async fill(locator, text) {
    await this.page.locator(locator).fill(text);
  }

   async clickButtonByRoleAndName(buttonText) {
    await this.page.getByRole('button', { name: buttonText, exact: true }).click();
  }
}