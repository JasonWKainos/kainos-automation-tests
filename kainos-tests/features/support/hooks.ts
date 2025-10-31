import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { CustomWorld } from './world';

let browser: Browser;

BeforeAll(async function () {
  // Launch browser once before all scenarios
  const headless = process.env.HEADLESS !== 'false';
  browser = await chromium.launch({
    headless: headless,
    slowMo: headless ? 0 : 100
  });
});

Before(async function (this: CustomWorld) {
  // Create a new browser context and page for each scenario
  this.context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true
  });
  
  this.page = await this.context.newPage();
  
  // Set default timeout
  this.page.setDefaultTimeout(30000);
});

After(async function (this: CustomWorld, { pickle, result }) {
  // Take screenshot on failure
  if (result?.status === Status.FAILED) {
    const screenshot = await this.page.screenshot({ 
      path: `./screenshots/${pickle.name.replace(/\s+/g, '_')}_${Date.now()}.png`,
      fullPage: true 
    });
    this.attach(screenshot, 'image/png');
  }
  
  // Close the page and context after each scenario
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function () {
  // Close the browser after all scenarios
  await browser?.close();
});