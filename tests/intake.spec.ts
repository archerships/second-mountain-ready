import { test, expect } from '@playwright/test';

/**
 * INTAKE FORM VERIFICATION TEST (WITH SPREADSHEET VALIDATION)
 * This script uses Playwright to perform a headless browser test.
 * 1. Fills out and submits the lead form.
 * 2. Verifies the website shows a success message.
 * 3. Calls the backend API to confirm the data exists in the Google Sheet.
 */

test.describe('Second Mountain Ready - E2E Verification', () => {
  const SITE_URL = 'https://archerships.github.io/second-mountain-ready/';
  const VERIFY_URL = 'https://script.google.com/macros/s/AKfycbz6O2CcEnkt-Nfrp-Xef6ZpqWsL-cnUdgsp-ZrKsqE6g_u8cmMhVlu5vvdkZd5QsRiHbA/exec';

  test('should submit form and verify data in spreadsheet', async ({ page, request }) => {
    const uniqueId = Date.now().toString();
    const testEmail = `test-${uniqueId}@playwright.com`;
    const firstName = 'Playwright';
    const lastName = 'Verification';

    console.log('--- Step 1: Submitting Form ---');
    console.log('Navigating to ' + SITE_URL + '...');
    await page.goto(SITE_URL);

    console.log('Filling out form with email: ' + testEmail);
    await page.fill('input[name="firstName"]', firstName);
    await page.fill('input[name="lastName"]', lastName);
    await page.fill('input[name="phone"]', '555-TEST');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="glp1Duration"]', 'E2E Validation Run');
    await page.fill('textarea[name="fitnessGoals"]', 'Verify that data reaches the spreadsheet.');

    console.log('Submitting...');
    await page.click('button[type="submit"]');

    console.log('Waiting for success confirmation on UI...');
    const successHeader = page.locator('h3:has-text("Thank you")');
    await expect(successHeader).toBeVisible({ timeout: 15000 });
    console.log('✓ UI Success confirmed.');

    console.log('--- Step 2: Verifying Spreadsheet ---');
    console.log('Waiting 5 seconds for Google to sync...');
    await page.waitForTimeout(5000);

    console.log('Querying verification endpoint...');
    const response = await request.get(`${VERIFY_URL}?verify=${testEmail}`);
    
    expect(response.ok()).toBeTruthy();
    const result = await response.json();
    
    console.log('Backend Response:', JSON.stringify(result));

    expect(result.result).toBe('found');
    expect(result.data.email).toBe(testEmail);
    expect(result.data.firstName).toBe(firstName);
    
    console.log('✓ Spreadsheet verification passed!');
  });
});
