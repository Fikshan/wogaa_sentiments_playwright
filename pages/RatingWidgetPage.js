import { expect } from "@playwright/test";

export default class RatingWidget {
  constructor(page) {
    this.page = page;
  }

  async click(locator) {
    await this.page.locator(locator).click();
  }

  async fill(locator, text) {
    await this.page.locator(locator).fill(text);
  }

  async verifyRatingHeading() {
    const heading = this.page.getByText(
      "Rate your experience with this website",
      { exact: true }
    );
    await expect(heading).toBeVisible();
  }

  async verifyAllRatingButtons() {
    for (let i = 1; i <= 6; i++) {
      const button = this.page.locator(`button[data-value='${i}']`);
      await expect(button).toBeVisible();
    }
  }

  async verifySatisfactionLabels() {
    const notSatisfied = this.page.getByText("NOT SATISFIED", { exact: true });
    const verySatisfied = this.page.getByText("VERY SATISFIED", {
      exact: true,
    });

    await expect(notSatisfied).toBeVisible();
    await expect(verySatisfied).toBeVisible();
  }

  async clickRatingButton(value) {
    const button = this.page.getByRole("button", {
      name: new RegExp(`^Rate ${value} of 6`, "i"),
      exact: false,
    });
    await button.click();
  }

  async verifyTellUsMoreHeading() {
    const heading = this.page.getByRole("heading", {
      name: "Tell us more",
      level: 3,
      exact: true,
    });
    await expect(heading).toBeVisible();
  }
}
