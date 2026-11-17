import { Before, After, AfterStep, setDefaultTimeout, ITestStepHookParameter } from '@cucumber/cucumber';
import { TestStepResultStatus } from '@cucumber/messages';
import { chromium, Browser, Page } from 'playwright';

setDefaultTimeout(10 * 1000);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cucumber {
    interface World {
      browser: Browser;
      page: Page;
    }
  }
}

Before(async function () {
  this.browser = await chromium.launch({ headless: true });
  this.page = await this.browser.newPage();
});

AfterStep(async function (result: ITestStepHookParameter) {
  if (result.result.status == TestStepResultStatus.FAILED) {
    const screenshot = await this.page.screenshot();
    this.attach(screenshot, 'image/png');
  }
});

After(async function () {
  await this.page.close();
  await this.browser.close();
});
