import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Set default timeout to 30 seconds
setDefaultTimeout(30000);

// Background steps
Given('I navigate to the Kainos homepage', async function (this: CustomWorld) {
  await this.page.goto('https://www.kainos.com');
});

Given('I accept the cookie consent', async function (this: CustomWorld) {
  const acceptCookiesButton = this.page.getByRole('button', { name: 'I Accept Cookies' });
  const isVisible = await acceptCookiesButton.isVisible().catch(() => false);
  
  if (isVisible) {
    await acceptCookiesButton.click();
    // Wait for cookie banner to disappear
    await this.page.waitForTimeout(1000);
  }
});

// Logo verification steps
Then('the Kainos logo should be visible', async function (this: CustomWorld) {
  const logo = this.page.locator('#header img[alt="logo"]');
  await expect(logo).toBeVisible();
});

Then('the logo should contain the correct image source', async function (this: CustomWorld) {
  const logo = this.page.locator('#header img[alt="logo"]');
  const logoSrc = await logo.getAttribute('src');
  expect(logoSrc).toContain('/globalassets/images/5_logos/kainos_logo.png');
});

Then('the logo should link to the homepage', async function (this: CustomWorld) {
  const logoLink = this.page.locator('#header').getByRole('link', { name: /logo/i });
  await expect(logoLink).toHaveAttribute('href', '/');
});

// Navigation menu steps
Then('the following navigation items should be visible:', async function (this: CustomWorld, dataTable) {
  const rows = dataTable.hashes();
  
  for (const row of rows) {
    const navLink = this.page.locator('#header').getByRole('link', { name: row['Navigation Item'], exact: true });
    await expect(navLink).toBeVisible();
    
    const href = await navLink.getAttribute('href');
    expect(href).toBe(row['URL']);
  }
});

// Right-side elements steps
Then('the {string} button should be visible', async function (this: CustomWorld, buttonName: string) {
  const button = this.page.getByRole('button', { name: new RegExp(buttonName, 'i') });
  await expect(button).toBeVisible();
});

Then('the {string} link should be visible', async function (this: CustomWorld, linkName: string) {
  const link = this.page.getByRole('link', { name: new RegExp(linkName, 'i') });
  await expect(link).toBeVisible();
});

Then('the {string} link should point to {string}', async function (this: CustomWorld, linkName: string, url: string) {
  const link = this.page.getByRole('link', { name: new RegExp(linkName, 'i') });
  await expect(link).toHaveAttribute('href', url);
});

// Dropdown menu steps
When('I hover over the {string} navigation item', async function (this: CustomWorld, navItem: string) {
  const navLink = this.page.locator('#header').getByRole('link', { name: navItem, exact: true });
  await navLink.hover();
  // Wait for dropdown to appear
  await this.page.waitForTimeout(500);
});

Then('the following services should be visible in the dropdown:', async function (this: CustomWorld, dataTable) {
  const services = dataTable.hashes();
  
  for (const service of services) {
    const serviceLink = this.page.getByRole('link', { name: service['Service'] });
    await expect(serviceLink).toBeVisible();
  }
});

Then('the following impacts should be visible in the dropdown:', async function (this: CustomWorld, dataTable) {
  const impacts = dataTable.hashes();
  
  for (const impact of impacts) {
    const impactLink = this.page.getByRole('link', { name: impact['Impact'] });
    await expect(impactLink).toBeVisible();
  }
});

// Navigation functionality steps
When('I click on the {string} navigation item', async function (this: CustomWorld, navItem: string) {
  const navLink = this.page.locator('#header').getByRole('link', { name: navItem, exact: true });
  await navLink.click();
  await this.page.waitForLoadState('domcontentloaded');
});

When('I click on the {string} link', async function (this: CustomWorld, linkText: string) {
  const link = this.page.locator('#header').getByRole('link', { name: linkText, exact: true });
  await link.click();
  await this.page.waitForLoadState('domcontentloaded');
});

Then('I should be navigated to {string}', async function (this: CustomWorld, url: string) {
  const currentUrl = this.page.url();
  expect(currentUrl).toContain(url);
});

Then('the page title should contain {string}', async function (this: CustomWorld, titleText: string) {
  const title = await this.page.title();
  expect(title).toContain(titleText);
});

// Accessibility steps
Then('all navigation links should be keyboard accessible', async function (this: CustomWorld) {
  const navLinks = [
    this.page.locator('#header').getByRole('link', { name: 'Digital Services', exact: true }),
    this.page.locator('#header').getByRole('link', { name: 'Workday', exact: true }),
    this.page.locator('#header').getByRole('link', { name: 'Industries', exact: true })
  ];
  
  for (const link of navLinks) {
    await link.focus();
    await expect(link).toBeFocused();
  }
});

Then('the header should have proper ARIA landmarks', async function (this: CustomWorld) {
  const header = this.page.locator('header, [role="banner"]');
  await expect(header).toBeVisible();
});