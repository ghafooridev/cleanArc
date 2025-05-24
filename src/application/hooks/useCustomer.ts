import { useState, useCallback } from "react";
import type { Customer } from "../../domain/models/Customer";
import { CustomerValidation } from "../../domain/models/Customer";
import { LocalStorageCustomerRepository } from "../../infrastructure/repositories/LocalStorageCustomerRepository";

const customerRepository = new LocalStorageCustomerRepository();

export const useCustomer = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = useCallback(async () => {
    try {
      const data = await customerRepository.getAll();
      setCustomers(data);
    } catch (err) {
      setError("Failed to load customers");
    }
  }, []);

  const validateCustomer = (customer: Customer): string | null => {
    if (!CustomerValidation.isValidEmail(customer.email)) {
      return "Invalid email address";
    }

    if (!CustomerValidation.isValidPhoneNumber(customer.phoneNumber)) {
      return "Invalid phone number";
    }

    if (
      !CustomerValidation.isValidBankAccountNumber(customer.bankAccountNumber)
    ) {
      return "Invalid bank account number";
    }

    if (!CustomerValidation.isUniqueEmail(customer.email, customers)) {
      return "Email already exists";
    }

    if (!CustomerValidation.isUniqueCustomer(customer, customers)) {
      return "Customer with same name and date of birth already exists";
    }

    return null;
  };

  const createCustomer = useCallback(
    async (customer: Customer) => {
      try {
        const validationError = validateCustomer(customer);
        if (validationError) {
          setError(validationError);
          return null;
        }

        const newCustomer = await customerRepository.create(customer);
        setCustomers((prev: Customer[]) => [...prev, newCustomer]);
        setError(null);
        return newCustomer;
      } catch (err) {
        setError("Failed to create customer");
        return null;
      }
    },
    [customers]
  );

  const updateCustomer = useCallback(
    async (id: string, customer: Customer) => {
      try {
        const validationError = validateCustomer(customer);
        if (validationError) {
          setError(validationError);
          return null;
        }

        const updatedCustomer = await customerRepository.update(id, customer);
        setCustomers((prev: Customer[]) =>
          prev.map((c: Customer) => (c.id === id ? updatedCustomer : c))
        );
        setError(null);
        return updatedCustomer;
      } catch (err) {
        setError("Failed to update customer");
        return null;
      }
    },
    [customers]
  );

  const deleteCustomer = useCallback(async (id: string) => {
    try {
      await customerRepository.delete(id);
      setCustomers((prev: Customer[]) =>
        prev.filter((c: Customer) => c.id !== id)
      );
      setError(null);
    } catch (err) {
      setError("Failed to delete customer");
    }
  }, []);

  return {
    customers,
    error,
    loadCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};
