# Cucumber + Playwright Framework Explanation

## How the Framework Works (Step-by-Step)

### Architecture Overview
```
┌─────────────────────────────────────────────────────────────┐
│                    Test Execution Flow                       │
└─────────────────────────────────────────────────────────────┘

1. Feature File (Gherkin)          → What to test
   ↓
2. Cucumber Runner                  → Reads & parses scenarios
   ↓
3. Step Definitions (TypeScript)   → How to test (Playwright code)
   ↓
4. World Object                     → Shared context (page, browser)
   ↓
5. Hooks                           → Setup/Teardown
   ↓
6. Report Generation               → Results visualization
```

## Detailed Conversion Explanation

### Before (Playwright Only):
```typescript
test('should verify logo', async ({ page }) => {
  await page.goto('https://www.kainos.com');
  const logo = page.locator('.header__logo img');
  await expect(logo).toBeVisible();
});
```

**Issues:**
- ❌ Technical - non-developers can't read it
- ❌ Tightly coupled - test intent mixed with implementation
- ❌ Not reusable - each test duplicates setup code

### After (Cucumber + Playwright):

#### 1. Feature File (header.feature)
```gherkin
Feature: Kainos Website Header Verification

  Background:
    Given I navigate to the Kainos homepage
    And I accept the cookie consent

  Scenario: Verify logo presence
    Then the Kainos logo should be visible
```

**Benefits:**
- ✅ Readable by anyone (PMs, BAs, clients)
- ✅ Focuses on "what" not "how"
- ✅ Background steps reused by all scenarios

#### 2. Step Definitions (header.steps.ts)
```typescript
Given('I navigate to the Kainos homepage', async function (this: CustomWorld) {
  await this.page.goto('https://www.kainos.com');
});

Then('the Kainos logo should be visible', async function (this: CustomWorld) {
  const logo = this.page.locator('#header img[alt="logo"]');
  await expect(logo).toBeVisible();
});
```

**Benefits:**
- ✅ Reusable across multiple scenarios
- ✅ Technical implementation separated
- ✅ Easy to maintain in one place

## Key Components Explained

### 1. World Object (world.ts)

**Purpose**: Share state between steps within a scenario

```typescript
export interface CustomWorld extends World {
  page: Page;              // Playwright page object
  context: BrowserContext; // Browser context
}
```

**Example Usage:**
```gherkin
Given I navigate to the Kainos homepage    # Sets this.page
When I click on "Digital Services"         # Uses this.page
Then I should see the services page        # Uses this.page
```

All three steps use the SAME `page` object maintained in World.

### 2. Hooks (hooks.ts)

**Purpose**: Setup and teardown for each test

```typescript
BeforeAll → Launch browser (once)
  Before → Create new page (each scenario)
    [Execute Scenario Steps]
  After → Take screenshot if failed, close page
AfterAll → Close browser (once)
```

**Why?**
- Ensures fresh browser state per scenario
- Automatic cleanup
- Screenshots on failures

### 3. Cucumber Configuration (cucumber.js)

**Purpose**: Tell Cucumber where files are and how to report

```javascript
{
  require: ['features/**/*.ts'],        // Find step definitions here
  requireModule: ['ts-node/register'],  // Enable TypeScript
  format: ['html:cucumber-report.html'] // Generate HTML report
}
```

## Data-Driven Testing

One of the BIGGEST benefits of Gherkin:

### Scenario Outline
```gherkin
Scenario Outline: Verify navigation links
  When I click on the "<Navigation Item>" link
  Then I should be navigated to "<URL>"

  Examples:
    | Navigation Item  | URL               |
    | Digital Services | /digital-services |
    | Workday          | /workday          |
    | Industries       | /industries       |
```

**Result**: Cucumber automatically runs this scenario 3 times with different data!

**Without Gherkin**, you'd need:
```typescript
const links = [
  { item: 'Digital Services', url: '/digital-services' },
  { item: 'Workday', url: '/workday' },
  { item: 'Industries', url: '/industries' }
];

for (const link of links) {
  test(`should navigate to ${link.item}`, async ({ page }) => {
    // ... test code
  });
}
```

## Data Tables

Gherkin also supports tables within steps:

```gherkin
Then the following navigation items should be visible:
  | Navigation Item  | URL               |
  | Digital Services | /digital-services |
  | Workday          | /workday          |
```

**Step Definition:**
```typescript
Then('the following navigation items should be visible:', 
  async function (this: CustomWorld, dataTable) {
    const rows = dataTable.hashes();  // [{Navigation Item: '...', URL: '...'}]
    
    for (const row of rows) {
      const link = this.page.getByRole('link', { name: row['Navigation Item'] });
      await expect(link).toHaveAttribute('href', row['URL']);
    }
  }
);
```

## Regular Expressions in Steps

Steps can use regex for flexibility:

```typescript
Then('the {string} button should be visible', 
  async function (this: CustomWorld, buttonName: string) {
    // buttonName = whatever is in quotes in Gherkin
    const button = this.page.getByRole('button', { name: buttonName });
    await expect(button).toBeVisible();
  }
);
```

**Usage:**
```gherkin
Then the "Search" button should be visible
Then the "Get in touch" button should be visible
```

Same step definition handles BOTH!

## Report Generation

After running tests, Cucumber generates multiple report formats:

1. **Console Output**: Real-time progress
   ```
   ✓ Verify logo presence (1.2s)
   ✓ Verify navigation items (2.3s)
   ✗ Verify search functionality (0.8s)
   ```

2. **HTML Report**: Visual report with pass/fail
   - Green ✓ for passed scenarios
   - Red ✗ for failed scenarios
   - Embedded screenshots for failures

3. **JSON Report**: Machine-readable for CI/CD integration

## When to Use Cucumber vs Plain Playwright

### Use Cucumber When:
- ✅ Non-technical stakeholders need to review tests
- ✅ Tests serve as living documentation
- ✅ BDD (Behavior-Driven Development) approach desired
- ✅ Tests need to be reusable and maintainable
- ✅ Collaboration between BA, QA, and Dev teams

### Use Plain Playwright When:
- ✅ Only developers will work with tests
- ✅ Rapid prototyping needed
- ✅ Highly technical/implementation-specific tests
- ✅ Team is small and all technical

## Summary of Changes Made

1. **Added Cucumber dependencies** to package.json
2. **Created feature file** with Gherkin scenarios
3. **Implemented step definitions** mapping Gherkin to Playwright
4. **Created World object** for shared state
5. **Added hooks** for setup/teardown
6. **Configured Cucumber** for TypeScript and reporting
7. **Kept original Playwright tests** for comparison

The framework now supports BOTH approaches:
- `npm test` → Runs Cucumber tests (BDD style)
- `npm run test:playwright` → Runs original Playwright tests

---

**Next Steps:**
1. Run `npm test` to see Cucumber in action
2. Open `cucumber-report.html` to see the visual report
3. Try modifying scenarios in `header.feature`
4. Add new scenarios by copying existing patterns