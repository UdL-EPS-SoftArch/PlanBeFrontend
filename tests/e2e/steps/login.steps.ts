import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// The backend seeds user "demo" with this password (see DBInitialization); override via env if needed.
const SEEDED_USERNAME = process.env.E2E_USERNAME ?? 'demo';
const SEEDED_PASSWORD = process.env.E2E_PASSWORD ?? 'Azqw4321';

When('I enter the seeded user credentials', async function () {
  await this.page.fill('#username', SEEDED_USERNAME);
  await this.page.fill('#password', SEEDED_PASSWORD);
  await this.page.click('button[type="submit"]');
});

Given('I open the main page', async function () {
  await this.page.goto('http://localhost:3000');
});

When(/^I click the button "([^"]*)"$/, async function (buttonText: string) {
  await this.page.click(`text="${buttonText}"`);
});

Given('I open the login page', async function () {
  await this.page.goto('http://localhost:3000/login');
});

When(/^I enter "([^"]*)" and "([^"]*)"$/, async function (username: string, password: string) {
  await this.page.fill('#username', username);
  await this.page.fill('#password', password);
  await this.page.click('button[type="submit"]');
});

Then(/^I should see the user page for "([^"]*)"$/, async function (username: string) {
  await expect(this.page.locator('h1')).toContainText(username);
});
