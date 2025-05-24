import { isValidPhoneNumber } from 'libphonenumber-js';

export interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  bankAccountNumber: string;
}

export class CustomerValidation {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhoneNumber(phoneNumber: string): boolean {
    return isValidPhoneNumber(phoneNumber);
  }

  static isValidBankAccountNumber(accountNumber: string): boolean {
    // Basic validation for bank account number (can be enhanced based on specific requirements)
    return /^\d{8,17}$/.test(accountNumber);
  }

  static isUniqueCustomer(
    customer: Customer,
    existingCustomers: Customer[]
  ): boolean {
    return !existingCustomers.some(
      (existing) =>
        existing.firstName.toLowerCase() === customer.firstName.toLowerCase() &&
        existing.lastName.toLowerCase() === customer.lastName.toLowerCase() &&
        existing.dateOfBirth === customer.dateOfBirth
    );
  }

  static isUniqueEmail(email: string, existingCustomers: Customer[]): boolean {
    return !existingCustomers.some(
      (customer) => customer.email.toLowerCase() === email.toLowerCase()
    );
  }
} 