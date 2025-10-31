import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Page, BrowserContext } from '@playwright/test';

export interface CustomWorld extends World {
  page: Page;
  context: BrowserContext;
}

export class KainosWorld extends World implements CustomWorld {
  page!: Page;
  context!: BrowserContext;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

// Set the custom world constructor
setWorldConstructor(KainosWorld);