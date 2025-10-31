import { test, expect } from '@playwright/test';

test.describe('Kainos.com Header Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the homepage
        await page.goto('https://www.kainos.com');
        
        // Handle cookie consent
        const acceptCookiesButton = page.getByRole('button', { name: 'I Accept Cookies' });
        if (await acceptCookiesButton.isVisible()) {
            await acceptCookiesButton.click();
        }
    });

    test('should verify logo presence and functionality', async ({ page }) => {
        // Verify logo presence
        const logo = page.locator('.header__logo img');
        await expect(logo).toBeVisible();
        
        // Verify logo src
        const logoSrc = await logo.getAttribute('src');
        expect(logoSrc).toContain('/globalassets/images/5_logos/kainos_logo.png');
        
        // Verify logo link
        const logoLink = page.locator('.header__logo');
        await expect(logoLink).toHaveAttribute('href', '/');
    });

    test('should verify main navigation items', async ({ page }) => {
        // Define expected navigation items and their URLs
        const navItems = [
            { text: 'Digital Services', url: '/digital-services' },
            { text: 'Workday', url: '/workday' },
            { text: 'Industries', url: '/industries' },
            { text: 'Insights', url: '/insights' },
            { text: 'Careers', url: 'https://careers.kainos.com/gb/en' }
        ];

        // Verify each navigation item
        for (const item of navItems) {
            const navLink = page.getByRole('link', { name: item.text });
            await expect(navLink).toBeVisible();
            await expect(navLink).toHaveAttribute('href', item.url);
        }
    });

    test('should verify right-side header elements', async ({ page }) => {
        // Verify Share icons button
        const shareButton = page.getByRole('button', { name: 'Open Share icons modal window' });
        await expect(shareButton).toBeVisible();

        // Verify Get in touch link
        const contactLink = page.getByRole('link', { name: 'Get in touch' });
        await expect(contactLink).toBeVisible();
        await expect(contactLink).toHaveAttribute('href', '/contact-us');

        // Verify Search button
        const searchButton = page.getByRole('button', { name: 'Search' });
        await expect(searchButton).toBeVisible();
    });

    test('should verify Digital Services dropdown menu', async ({ page }) => {
        // Hover over Digital Services to reveal dropdown
        await page.getByRole('link', { name: 'Digital Services' }).hover();

        // Verify Services section
        const services = [
            'Digital Advisory',
            'Cloud and engineering',
            'Data and AI',
            'AI Business Solutions',
            'User-centred design',
            'Managed services'
        ];

        for (const service of services) {
            const serviceLink = page.getByRole('link', { name: service });
            await expect(serviceLink).toBeVisible();
        }

        // Verify Impacts section
        const impacts = [
            'Building digital transformation',
            'Driving continuous improvement',
            'Improving business performance',
            'Improving customer engagement'
        ];

        for (const impact of impacts) {
            const impactLink = page.getByRole('link', { name: impact });
            await expect(impactLink).toBeVisible();
        }
    });

    test('should verify header accessibility', async ({ page }) => {
        // Verify navigation landmark
        const nav = page.locator('nav[aria-label="Main navigation"]');
        await expect(nav).toBeVisible();

        // Verify interactive elements are keyboard accessible
        const interactiveElements = [
            page.getByRole('link', { name: 'Digital Services' }),
            page.getByRole('link', { name: 'Workday' }),
            page.getByRole('button', { name: 'Search' })
        ];

        for (const element of interactiveElements) {
            await element.focus();
            await expect(element).toBeFocused();
        }
    });
});