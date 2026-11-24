import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

When(/^I open the page "([^"]*)"$/, async function (path: string) {
  await this.page.goto(`${BASE_URL}${path}`);
});

Then(/^I should see the heading "([^"]*)"$/, async function (text: string) {
  await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(text);
});

Then(/^I should see the link "([^"]*)" in the navigation bar$/, async function (name: string) {
  await expect(this.page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name, exact: true })).toBeVisible();
});

Then(/^I should be on the login page with next "([^"]*)"$/, async function (next: string) {
  await this.page.waitForURL(`**/login?next=${encodeURIComponent(next)}`);
  await expect(this.page.locator('#username')).toBeVisible();
});
