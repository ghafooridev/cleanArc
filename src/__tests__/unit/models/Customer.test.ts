import { CustomerValidation } from "../../../domain/models/Customer";

describe("CustomerValidation", () => {
  const mockCustomers = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-01-01",
      phoneNumber: "+1234567890",
      email: "john@example.com",
      bankAccountNumber: "1234567890",
    },
  ];

  describe("isValidEmail", () => {
    it("should return true for valid email addresses", () => {
      expect(CustomerValidation.isValidEmail("test@example.com")).toBe(true);
      expect(CustomerValidation.isValidEmail("user.name@domain.co.uk")).toBe(
        true
      );
    });

    it("should return false for invalid email addresses", () => {
      expect(CustomerValidation.isValidEmail("invalid-email")).toBe(false);
      expect(CustomerValidation.isValidEmail("test@")).toBe(false);
      expect(CustomerValidation.isValidEmail("@domain.com")).toBe(false);
    });
  });

  describe("isValidPhoneNumber", () => {
    it("should return true for valid phone numbers", () => {
      expect(CustomerValidation.isValidPhoneNumber("+14155552671")).toBe(true);
      expect(CustomerValidation.isValidPhoneNumber("+442071838750")).toBe(true);
    });

    it("should return false for invalid phone numbers", () => {
      expect(CustomerValidation.isValidPhoneNumber("123")).toBe(false);
      expect(CustomerValidation.isValidPhoneNumber("invalid")).toBe(false);
    });
  });

  describe("isValidBankAccountNumber", () => {
    it("should return true for valid bank account numbers", () => {
      expect(CustomerValidation.isValidBankAccountNumber("12345678")).toBe(
        true
      );
      expect(
        CustomerValidation.isValidBankAccountNumber("12345678901234567")
      ).toBe(true);
    });

    it("should return false for invalid bank account numbers", () => {
      expect(CustomerValidation.isValidBankAccountNumber("1234567")).toBe(
        false
      );
      expect(
        CustomerValidation.isValidBankAccountNumber("123456789012345678")
      ).toBe(false);
      expect(CustomerValidation.isValidBankAccountNumber("invalid")).toBe(
        false
      );
    });
  });

  describe("isUniqueCustomer", () => {
    it("should return true for unique customers", () => {
      const newCustomer = {
        firstName: "Jane",
        lastName: "Smith",
        dateOfBirth: "1995-01-01",
        phoneNumber: "+9876543210",
        email: "jane@example.com",
        bankAccountNumber: "9876543210",
      };

      expect(
        CustomerValidation.isUniqueCustomer(newCustomer, mockCustomers)
      ).toBe(true);
    });

    it("should return false for duplicate customers", () => {
      const duplicateCustomer = {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
        phoneNumber: "+1234567890",
        email: "john.doe@example.com",
        bankAccountNumber: "1234567890",
      };

      expect(
        CustomerValidation.isUniqueCustomer(duplicateCustomer, mockCustomers)
      ).toBe(false);
    });
  });

  describe("isUniqueEmail", () => {
    it("should return true for unique email addresses", () => {
      expect(
        CustomerValidation.isUniqueEmail("new@example.com", mockCustomers)
      ).toBe(true);
    });

    it("should return false for duplicate email addresses", () => {
      expect(
        CustomerValidation.isUniqueEmail("john@example.com", mockCustomers)
      ).toBe(false);
    });

    it("should be case insensitive", () => {
      expect(
        CustomerValidation.isUniqueEmail("JOHN@EXAMPLE.COM", mockCustomers)
      ).toBe(false);
    });
  });
});
