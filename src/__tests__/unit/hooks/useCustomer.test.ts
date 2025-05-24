import { renderHook, act } from "@testing-library/react";
import { useCustomer } from "../../../application/hooks/useCustomer";
import { LocalStorageCustomerRepository } from "../../../infrastructure/repositories/LocalStorageCustomerRepository";
import type { Customer } from "../../../domain/models/Customer";

// Mock the LocalStorageCustomerRepository
jest.mock(
  "../../../infrastructure/repositories/LocalStorageCustomerRepository"
);

describe("useCustomer", () => {
  const mockCustomers: Customer[] = [
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

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset all mocks
    jest.clearAllMocks();
  });

  it("loads customers on mount", async () => {
    const mockGetAll = jest.fn().mockResolvedValue(mockCustomers);
    (LocalStorageCustomerRepository as jest.Mock).mockImplementation(() => ({
      getAll: mockGetAll,
    }));

    const { result } = renderHook(() => useCustomer());

    await act(async () => {
      await result.current.loadCustomers();
    });

    expect(mockGetAll).toHaveBeenCalled();
    expect(result.current.customers).toEqual(mockCustomers);
  });

  it("creates a new customer successfully", async () => {
    const mockCreate = jest.fn().mockImplementation((customer) => ({
      ...customer,
      id: "2",
    }));
    (LocalStorageCustomerRepository as jest.Mock).mockImplementation(() => ({
      getAll: jest.fn().mockResolvedValue([]),
      create: mockCreate,
    }));

    const { result } = renderHook(() => useCustomer());
    const newCustomer: Customer = {
      firstName: "Jane",
      lastName: "Smith",
      dateOfBirth: "1995-01-01",
      phoneNumber: "+9876543210",
      email: "jane@example.com",
      bankAccountNumber: "9876543210",
    };

    await act(async () => {
      await result.current.createCustomer(newCustomer);
    });

    expect(mockCreate).toHaveBeenCalledWith(newCustomer);
    expect(result.current.error).toBeNull();
  });

  it("validates customer data before creation", async () => {
    const { result } = renderHook(() => useCustomer());
    const invalidCustomer: Customer = {
      firstName: "Jane",
      lastName: "Smith",
      dateOfBirth: "1995-01-01",
      phoneNumber: "invalid",
      email: "invalid-email",
      bankAccountNumber: "123",
    };

    await act(async () => {
      await result.current.createCustomer(invalidCustomer);
    });

    expect(result.current.error).toBeTruthy();
  });

  it("updates an existing customer successfully", async () => {
    const mockUpdate = jest.fn().mockImplementation((id, customer) => ({
      ...customer,
      id,
    }));
    (LocalStorageCustomerRepository as jest.Mock).mockImplementation(() => ({
      getAll: jest.fn().mockResolvedValue(mockCustomers),
      update: mockUpdate,
    }));

    const { result } = renderHook(() => useCustomer());
    const updatedCustomer: Customer = {
      ...mockCustomers[0],
      firstName: "John Updated",
    };

    await act(async () => {
      await result.current.updateCustomer("1", updatedCustomer);
    });

    expect(mockUpdate).toHaveBeenCalledWith("1", updatedCustomer);
    expect(result.current.error).toBeNull();
  });

  it("deletes a customer successfully", async () => {
    const mockDelete = jest.fn().mockResolvedValue(undefined);
    (LocalStorageCustomerRepository as jest.Mock).mockImplementation(() => ({
      getAll: jest.fn().mockResolvedValue(mockCustomers),
      delete: mockDelete,
    }));

    const { result } = renderHook(() => useCustomer());

    await act(async () => {
      await result.current.deleteCustomer("1");
    });

    expect(mockDelete).toHaveBeenCalledWith("1");
    expect(result.current.error).toBeNull();
  });

  it("handles errors during operations", async () => {
    const mockError = new Error("Operation failed");
    (LocalStorageCustomerRepository as jest.Mock).mockImplementation(() => ({
      getAll: jest.fn().mockRejectedValue(mockError),
    }));

    const { result } = renderHook(() => useCustomer());

    await act(async () => {
      await result.current.loadCustomers();
    });

    expect(result.current.error).toBe("Failed to load customers");
  });
});
