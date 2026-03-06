import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

/**
 * INTAKE FORM VERIFICATION TEST (WITH REALISTIC FAKER DATA)
 * This script uses Playwright and Faker to perform a headless browser test.
 * 1. Generates realistic, non-sensitive user data.
 * 2. Fills out and submits the lead form.
 * 3. Verifies the website shows a success message.
 * 4. Calls the backend API to confirm the data exists in the Google Sheet.
 */

test.describe('Second Mountain Ready - E2E Verification', () => {
  const SITE_URL = 'https://archerships.github.io/second-mountain-ready/';
  const VERIFY_URL = 'https://script.google.com/macros/s/AKfycbyWjP5Re_afehuWNTBCjsc40CxgeDppZz70n4LZsYk_hsGoeJwqFmmLP-iznLlZRTVajQ/exec';
  const API_KEY = process.env.API_KEY;

  test('should submit form and verify data in spreadsheet', async ({ page, request }) => {
    if (!API_KEY) {
      throw new Error('API_KEY environment variable is not set.');
    }
    // Generate realistic test data
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const testEmail = faker.internet.email({ firstName, lastName }).toLowerCase();
    const phone = faker.string.numeric('##########'); // 10 digits
    const glp1Months = faker.number.int({ min: 0, max: 48 }).toString();
    const goals = faker.lorem.paragraph();

    console.log('--- Step 1: Submitting Form ---');
    console.log('Navigating to ' + SITE_URL + '...');
    await page.goto(SITE_URL);

    console.log(`Filling out form for: ${firstName} ${lastName} (${testEmail})`);
    await page.fill('input[name="firstName"]', firstName);
    await page.fill('input[name="lastName"]', lastName);
    await page.fill('input[name="phone"]', phone);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="glp1Duration"]', glp1Months);
    await page.fill('textarea[name="fitnessGoals"]', goals);

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
    const response = await request.get(`${VERIFY_URL}?key=${API_KEY}&verify=${testEmail}`);
    
    expect(response.ok()).toBeTruthy();
    const result = await response.json();
    
    console.log('Backend Response:', JSON.stringify(result));

    expect(result.result).toBe('found');
    expect(result.data.email).toBe(testEmail);
    expect(result.data.firstName).toBe(firstName);
    
    console.log('✓ Spreadsheet verification passed with realistic data!');
  });
});
