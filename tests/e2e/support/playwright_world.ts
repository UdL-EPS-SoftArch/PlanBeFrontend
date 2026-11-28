import { Before, After, AfterStep, setDefaultTimeout, ITestStepHookParameter } from '@cucumber/cucumber';
import { TestStepResultStatus } from '@cucumber/messages';
import { chromium, request, APIRequestContext, Browser, Page } from 'playwright';

setDefaultTimeout(15 * 1000);

const API_BASE_URL = process.env.E2E_API_BASE_URL ?? 'http://127.0.0.1:8080';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cucumber {
    interface World {
      browser: Browser;
      page: Page;
      api: APIRequestContext;
      meetupId?: string;
      meetupTitle?: string;
      meetupDescription?: string;
      meetupVisibilityLabel?: string;
      meetupOwner?: string;
      visitorUsername?: string;
    }
  }
}

Before(async function () {
  this.browser = await chromium.launch({ headless: true });
  this.page = await this.browser.newPage();
  this.api = await request.newContext({ baseURL: API_BASE_URL });
});

AfterStep(async function (result: ITestStepHookParameter) {
  if (result.result.status == TestStepResultStatus.FAILED) {
    const screenshot = await this.page.screenshot();
    this.attach(screenshot, 'image/png');
  }
});

After({ timeout: 30 * 1000 }, async function () {
  await this.page.close();
  await this.browser.close();
  await this.api.dispose();
});
