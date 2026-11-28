import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Reuses the browser World from support/playwright_world.ts and the login/navigation steps.

Then('I should see the meetup filters', async function () {
  await expect(this.page.locator('#category')).toBeVisible();
  await expect(this.page.locator('#city')).toBeVisible();
  await expect(this.page.locator('#startDate')).toBeVisible();
  await expect(this.page.locator('#interest')).toBeVisible();
  await expect(this.page.getByRole('button', { name: 'Buscar' })).toBeVisible();
});

Then('I should see the pagination summary', async function () {
  await expect(this.page.getByText(/Página \d+ de \d+/)).toBeVisible();
});

Then('I should see the meetup list or a clear empty message', async function () {
  const cards = this.page.locator('ul > li > a[href^="/meetups/"]');
  const empty = this.page.getByText('No hay quedadas con estos filtros');
  await expect.poll(async () => (await cards.count()) > 0 || await empty.isVisible()).toBe(true);
});

Then('I should not see the create meetup action', async function () {
  await expect(this.page.getByTestId('create-meetup')).toHaveCount(0);
});

When(/^I filter meetups by category "([^"]*)" and city "([^"]*)"$/, async function (category: string, city: string) {
  await this.page.click('#category');
  await this.page.getByRole('option', { name: category, exact: true }).click();
  await this.page.fill('#city', city);
  await this.page.getByRole('button', { name: 'Buscar' }).click();
});

When(/^I filter meetups by city "([^"]*)"$/, async function (city: string) {
  await this.page.fill('#city', city);
  await this.page.getByRole('button', { name: 'Buscar' }).click();
});

Then(/^the meetups URL should contain "([^"]*)" and "([^"]*)"$/, async function (first: string, second: string) {
  await expect.poll(() => this.page.url()).toContain(first);
  await expect.poll(() => this.page.url()).toContain(second);
});

When('I reload the page', async function () {
  await this.page.reload();
});

Then(/^the category filter should contain "([^"]*)"$/, async function (text: string) {
  await expect(this.page.locator('#category')).toContainText(text);
});

Then(/^the city filter should contain "([^"]*)"$/, async function (text: string) {
  await expect(this.page.locator('#city')).toHaveValue(text);
});

Then('I should see the empty meetups message', async function () {
  await expect(this.page.getByText('No hay quedadas con estos filtros')).toBeVisible();
});

Then('I should see the create meetup action', async function () {
  await expect(this.page.getByTestId('create-meetup')).toBeVisible();
});
