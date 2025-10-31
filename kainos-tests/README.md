# Kainos Website Automated Tests (Cucumber + Playwright)

This project contains automated tests for the Kainos website using **Cucumber (Gherkin syntax)** and **Playwright**.

## 🎯 Why Gherkin/Cucumber?

Gherkin provides a **Business-Readable, Domain-Specific Language** that allows tests to be written in plain English using a Given-When-Then format. This makes tests:

- **Readable** by non-technical stakeholders
- **Collaborative** - Business Analysts, QA, and Developers can contribute
- **Self-documenting** - Tests serve as living documentation
- **Reusable** - Step definitions can be shared across scenarios

## 📁 Project Structure

```
kainos-tests/
├── features/
│   ├── header.feature              # Gherkin feature file with test scenarios
│   ├── step_definitions/
│   │   └── header.steps.ts         # Step definitions (Gherkin → Playwright)
│   └── support/
│       ├── world.ts                # Custom World for shared context
│       └── hooks.ts                # Before/After hooks for setup/teardown
├── tests/
│   └── header.spec.ts              # Original Playwright tests (kept for reference)
├── screenshots/                     # Screenshots captured on test failures
├── cucumber.js                      # Cucumber configuration
├── tsconfig.json                    # TypeScript configuration
├── playwright.config.ts             # Playwright configuration
└── package.json                     # Dependencies and scripts
```

## 🔧 Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers (if not already installed):
```bash
npx playwright install
```

## 🚀 Running Tests

### Run all Cucumber tests (headless):
```bash
npm test
```

### Run tests with visible browser:
```bash
npm run test:headed
```

### Run original Playwright tests:
```bash
npm run test:playwright
```

### Generate HTML report:
```bash
npm run test:report
```

## 📝 Understanding the Framework

### 1. **Gherkin Feature File** (`features/header.feature`)

This is where test scenarios are written in plain English using Gherkin syntax:

```gherkin
Feature: Kainos Website Header Verification
  As a QA tester
  I want to verify the header elements on kainos.com
  So that I can ensure the navigation and branding are working correctly

  Scenario: Verify logo presence and functionality
    Given I navigate to the Kainos homepage
    And I accept the cookie consent
    Then the Kainos logo should be visible
    And the logo should contain the correct image source
```

**Key Gherkin Keywords:**
- **Feature**: High-level description of the functionality being tested
- **Scenario**: Specific test case
- **Given**: Preconditions/setup
- **When**: Action/trigger
- **Then**: Expected outcome
- **And/But**: Additional steps
- **Background**: Steps that run before each scenario
- **Scenario Outline**: Data-driven tests with Examples table

### 2. **Step Definitions** (`features/step_definitions/header.steps.ts`)

This file maps Gherkin steps to actual Playwright code:

```typescript
Given('I navigate to the Kainos homepage', async function (this: CustomWorld) {
  await this.page.goto('https://www.kainos.com');
});

Then('the Kainos logo should be visible', async function (this: CustomWorld) {
  const logo = this.page.locator('#header img[alt="logo"]');
  await expect(logo).toBeVisible();
});
```

**How it works:**
- Cucumber reads the Gherkin step
- Matches it to a step definition using regex/string matching
- Executes the corresponding Playwright code
- Step definitions are reusable across multiple scenarios

### 3. **World** (`features/support/world.ts`)

The World object maintains state between steps in a scenario:

```typescript
export interface CustomWorld extends World {
  page: Page;           // Playwright page object
  context: BrowserContext;  // Browser context
}
```

**Purpose:**
- Shares data between steps in the same scenario
- Provides access to Playwright objects (`page`, `context`)
- Fresh instance created for each scenario (isolation)

### 4. **Hooks** (`features/support/hooks.ts`)

Hooks run automatically before/after scenarios:

```typescript
Before(async function (this: CustomWorld) {
  // Create new browser context and page for each scenario
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld, { result }) {
  // Take screenshot on failure
  if (result?.status === Status.FAILED) {
    await this.page.screenshot({ path: './screenshots/failed.png' });
  }
  await this.page.close();
});
```

**Hook Types:**
- `BeforeAll`: Runs once before all scenarios (e.g., launch browser)
- `Before`: Runs before each scenario (e.g., create new page)
- `After`: Runs after each scenario (e.g., screenshot, cleanup)
- `AfterAll`: Runs once after all scenarios (e.g., close browser)

### 5. **Configuration** (`cucumber.js`)

Configures Cucumber behavior:

```javascript
module.exports = {
  require: ['features/**/*.ts'],        // Where to find step definitions
  requireModule: ['ts-node/register'],  // TypeScript support
  format: [
    'progress-bar',                     // Console output
    'html:cucumber-report.html',        // HTML report
    'json:cucumber-report.json'         // JSON report
  ]
};
```

## 🔄 How Gherkin Execution Works

1. **Cucumber reads the feature file**
   ```gherkin
   Given I navigate to the Kainos homepage
   ```

2. **Matches to step definition**
   ```typescript
   Given('I navigate to the Kainos homepage', async function (this: CustomWorld) {
     await this.page.goto('https://www.kainos.com');
   });
   ```

3. **Executes Playwright code**
   - Uses the `page` object from World
   - Performs browser actions
   - Makes assertions

4. **Continues to next step**
   - World object persists throughout scenario
   - All steps share the same `page` instance

## 📊 Key Benefits of This Approach

### ✅ **Separation of Concerns**
- **Gherkin**: What to test (business requirements)
- **Step Definitions**: How to test (technical implementation)

### ✅ **Reusability**
```gherkin
# Same step used in multiple scenarios
When I click on the "Digital Services" navigation item
When I click on the "Workday" navigation item
When I click on the "Industries" navigation item
```

One step definition handles all three!

### ✅ **Data-Driven Testing**
```gherkin
Scenario Outline: Verify navigation links
  When I click on the "<Navigation Item>" link
  Then I should be navigated to "<URL>"

  Examples:
    | Navigation Item  | URL               |
    | Digital Services | /digital-services |
    | Workday          | /workday          |
```

### ✅ **Readable Reports**
HTML reports show tests in plain English, understandable by anyone.

## 🎓 Comparison: Playwright vs Cucumber+Playwright

### Original Playwright Test:
```typescript
test('should verify logo presence', async ({ page }) => {
  await page.goto('https://www.kainos.com');
  const logo = page.locator('.header__logo img');
  await expect(logo).toBeVisible();
});
```

### Cucumber Gherkin:
```gherkin
Scenario: Verify logo presence
  Given I navigate to the Kainos homepage
  Then the Kainos logo should be visible
```

**Result**: Same test, but Gherkin version is readable by non-technical team members!

## 📈 Reports

After running tests, view results in:
- **Console**: Real-time progress bar
- **HTML Report**: `cucumber-report.html` (detailed scenario results)
- **Enhanced Report**: Run `npm run test:report` for styled HTML report
- **Screenshots**: Automatic screenshots on failures in `/screenshots/`

## 🐛 Debugging

To debug tests with browser visible:
```bash
npm run test:headed
```

To run a specific scenario, use tags:
```gherkin
@smoke
Scenario: Verify logo presence
  ...
```

Then run:
```bash
npx cucumber-js --tags "@smoke"
```

## 📚 Additional Resources

- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Playwright Documentation](https://playwright.dev/)
- [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)

## 🤝 Contributing

When adding new tests:
1. Write the Gherkin scenario in `features/*.feature`
2. Run the test - Cucumber will suggest missing step definitions
3. Implement step definitions in `features/step_definitions/*.steps.ts`
4. Reuse existing steps where possible

---

**Happy Testing! 🚀**