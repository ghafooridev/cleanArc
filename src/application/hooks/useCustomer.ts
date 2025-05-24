import { useState, useCallback } from "react";
import type { Customer } from "../../domain/models/Customer";
import { CustomerValidation } from "../../domain/models/Customer";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const useCustomer = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = useCallback(async () => {
    try {
      const response = await axios.get<Customer[]>(`${API_URL}/customers`);
      setCustomers(response.data);
      setError(null);
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

  const createCustomer = useCallback(async (customer: Customer) => {
    try {
      const response = await axios.post<Customer>(
        `${API_URL}/customers`,
        customer
      );
      setCustomers((prev) => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to create customer");
      }
      return null;
    }
  }, []);

  const updateCustomer = useCallback(async (id: string, customer: Customer) => {
    try {
      const response = await axios.put<Customer>(
        `${API_URL}/customers/${id}`,
        customer
      );
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? response.data : c))
      );
      setError(null);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to update customer");
      }
      return null;
    }
  }, []);

  const deleteCustomer = useCallback(async (id: string) => {
    try {
      await axios.delete(`${API_URL}/customers/${id}`);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
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
