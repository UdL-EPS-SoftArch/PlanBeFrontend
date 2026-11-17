---
name: sdd-cucumber-steps
description: Implement Cucumber + Playwright E2E step definitions (tests/e2e/steps/*.steps.ts) driving the Next.js UI.
---

# SDD Cucumber + Playwright Steps Skill

This skill guides AI agents to implement clean, concise Cucumber step definitions (`tests/e2e/steps/*.steps.ts`) using Playwright to test Next.js UI flows against the Spring Data REST backend.

## Conventions & Rules

1. **Reuse Playwright World (`playwright_world.ts`)**:
   Do NOT re-declare `Before`, `After`, or `AfterStep` browser hooks in step files. `tests/e2e/support/playwright_world.ts` already launches headless Chromium and exposes `this.browser` and `this.page` on the Cucumber `World`.

2. **Avoid `AmbiguousStepDefinitions` Errors**:
   Always inspect existing files in `tests/e2e/steps/` (such as `login.steps.ts`) before adding steps. Never duplicate steps that already exist:
   - `Given('I open the main page', ...)`
   - `Given('I open the login page', ...)`
   - `When(/^I click the button "([^"]*)"$/, ...)`
   - `When(/^I enter "([^"]*)" and "([^"]*)"$/, ...)`
   - `Then(/^I should see the user page for "([^"]*)"$/, ...)`

3. **Selectors & Playwright Auto-Waiting Assertions**:
   - Target form inputs by `#id` matching `<Input id="..." />` or `<Textarea id="..." />` (`await this.page.fill('#name', value)`).
   - Submit forms with `await this.page.click('button[type="submit"]')` or specific button text (`text="Add <Entity>"`).
   - Use `expect` from `@playwright/test` (`await expect(this.page.locator(...)).toContainText(...)` or `.toBeVisible()`) so assertions automatically wait for Next.js client/server transitions and HAL API calls.

## Step Definition Template (`tests/e2e/steps/<entity>.steps.ts`)

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

When(/^I create a new <entity> with name "([^"]*)" and description "([^"]*)"$/, async function (name: string, description: string) {
  await this.page.fill('#name', name);
  await this.page.fill('#description', description);
  await this.page.click('button[type="submit"]');
});

Then(/^I should see the <entity> "([^"]*)" in the list$/, async function (name: string) {
  await expect(this.page.locator(`text="${name}"`).first()).toBeVisible();
});

When(/^I click on the <entity> link "([^"]*)"$/, async function (name: string) {
  await this.page.click(`text="${name}"`);
});

Then(/^I should see the <entity> detail page for "([^"]*)"$/, async function (name: string) {
  await expect(this.page.locator('h1')).toContainText('<Entity>');
  await expect(this.page.locator(`text="${name}"`).first()).toBeVisible();
});
```
