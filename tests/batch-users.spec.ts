import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { generateDynamicGoal } from './test-helpers';

/**
 * BATCH TEST USER GENERATOR (DYNAMIC REALISTIC GOALS)
 * This script enters unique users with dynamically generated, 
 * believable senior-fitness goals.
 */

test.describe('Second Mountain Ready - Batch User Entry', () => {
  const SITE_URL = 'https://archerships.github.io/second-mountain-ready/';

  for (let i = 1; i <= 5; i++) {
    test(`should submit test user #${i}`, async ({ page }) => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName }).toLowerCase();
      const phone = faker.string.numeric('##########');
      const glp1Months = faker.number.int({ min: 0, max: 24 }).toString();
      const goals = generateDynamicGoal();

      console.log(`Submitting user #${i}: ${firstName} ${lastName}`);
      await page.goto(SITE_URL);
      
      await page.fill('input[name="firstName"]', firstName);
      await page.fill('input[name="lastName"]', lastName);
      await page.fill('input[name="phone"]', phone);
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="glp1Duration"]', glp1Months);
      await page.fill('textarea[name="fitnessGoals"]', goals);

      await page.click('button[type="submit"]');
      
      const successHeader = page.locator('h3:has-text("Thank you")');
      await expect(successHeader).toBeVisible({ timeout: 15000 });
      console.log(`✓ User #${i} submitted with goal: "${goals.substring(0, 40)}..."`);
    });
  }
});
