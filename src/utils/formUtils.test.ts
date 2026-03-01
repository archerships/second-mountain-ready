import { describe, it, expect } from 'vitest';
import { formatPhoneNumber, validateForm } from './formUtils';
import type { FormData } from './formUtils';

describe('formUtils', () => {
  describe('formatPhoneNumber', () => {
    it('should format a 10-digit number with non-breaking hyphens', () => {
      const input = '2082833707';
      const expected = '208\u2011283\u20113707';
      expect(formatPhoneNumber(input)).toBe(expected);
    });

    it('should handle numbers with existing formatting', () => {
      const input = '(208) 283-3707';
      const expected = '208\u2011283\u20113707';
      expect(formatPhoneNumber(input)).toBe(expected);
    });

    it('should partially format shorter numbers', () => {
      expect(formatPhoneNumber('208')).toBe('208');
      expect(formatPhoneNumber('2082')).toBe('208\u20112');
    });
  });

  describe('validateForm', () => {
    const validData: FormData = {
      firstName: 'Heather',
      lastName: 'Cooper',
      phone: '2082833707',
      email: 'heather@example.com',
      glp1Duration: '12',
      fitnessGoals: 'Get stronger'
    };

    it('should return no errors for valid data', () => {
      const errors = validateForm(validData);
      expect(Object.keys(errors).length).toBe(0);
    });

    it('should require first and last name', () => {
      const errors = validateForm({ ...validData, firstName: '', lastName: ' ' });
      expect(errors.firstName).toBeDefined();
      expect(errors.lastName).toBeDefined();
    });

    it('should validate phone number length', () => {
      const errors = validateForm({ ...validData, phone: '12345' });
      expect(errors.phone).toBeDefined();
    });

    it('should validate email format', () => {
      const errors = validateForm({ ...validData, email: 'not-an-email' });
      expect(errors.email).toBeDefined();
    });

    it('should validate GLP1 duration range (0-120)', () => {
      expect(validateForm({ ...validData, glp1Duration: '-1' }).glp1Duration).toBeDefined();
      expect(validateForm({ ...validData, glp1Duration: '121' }).glp1Duration).toBeDefined();
      expect(validateForm({ ...validData, glp1Duration: '0' }).glp1Duration).toBeUndefined();
      expect(validateForm({ ...validData, glp1Duration: '120' }).glp1Duration).toBeUndefined();
    });

    it('should reject non-numeric GLP1 duration', () => {
      const errors = validateForm({ ...validData, glp1Duration: 'abc' });
      expect(errors.glp1Duration).toBeDefined();
    });
  });
});
