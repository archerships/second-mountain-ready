import validator from 'validator';

export interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  glp1Duration: string;
  fitnessGoals: string;
  submissionTime?: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  glp1Duration?: string;
}

export const formatPhoneNumber = (value: string) => {
  // Extract digits
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}\u2011${digits.slice(3)}`;
  return `${digits.slice(0, 3)}\u2011${digits.slice(3, 6)}\u2011${digits.slice(6, 10)}`;
};

export const validateForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};
  
  if (!formData.firstName || !formData.firstName.trim()) {
    errors.firstName = 'First name is required';
  }
  
  if (!formData.lastName || !formData.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }
  
  const digits = formData.phone.replace(/\D/g, '');
  if (digits.length < 10) {
    errors.phone = 'Please enter a valid 10-digit phone number';
  }
  
  if (!validator.isEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  const glp1Value = parseInt(formData.glp1Duration);
  if (isNaN(glp1Value) || glp1Value < 0 || glp1Value > 120) {
    errors.glp1Duration = 'Please enter a number between 0 and 120';
  }

  return errors;
};
