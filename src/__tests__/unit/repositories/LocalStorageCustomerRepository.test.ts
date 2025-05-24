import { LocalStorageCustomerRepository } from "../../../infrastructure/repositories/LocalStorageCustomerRepository";
import type { Customer } from "../../../domain/models/Customer";

describe("LocalStorageCustomerRepository", () => {
  const repository = new LocalStorageCustomerRepository();
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
    localStorage.clear();
    localStorage.setItem("customers", JSON.stringify(mockCustomers));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("gets all customers", async () => {
    const customers = await repository.getAll();
    expect(customers).toEqual(mockCustomers);
  });

  it("gets customer by id", async () => {
    const customer = await repository.getById("1");
    expect(customer).toEqual(mockCustomers[0]);
  });

  it("returns null when customer not found", async () => {
    const customer = await repository.getById("non-existent");
    expect(customer).toBeNull();
  });

  it("creates a new customer", async () => {
    const newCustomer: Customer = {
      firstName: "Jane",
      lastName: "Smith",
      dateOfBirth: "1995-01-01",
      phoneNumber: "+9876543210",
      email: "jane@example.com",
      bankAccountNumber: "9876543210",
    };

    const createdCustomer = await repository.create(newCustomer);
    expect(createdCustomer).toHaveProperty("id");
    expect(createdCustomer.firstName).toBe(newCustomer.firstName);

    const customers = await repository.getAll();
    expect(customers).toHaveLength(2);
  });

  it("updates an existing customer", async () => {
    const updatedCustomer: Customer = {
      ...mockCustomers[0],
      firstName: "John Updated",
    };

    const result = await repository.update("1", updatedCustomer);
    expect(result.firstName).toBe("John Updated");

    const customer = await repository.getById("1");
    expect(customer?.firstName).toBe("John Updated");
  });

  it("throws error when updating non-existent customer", async () => {
    const updatedCustomer: Customer = {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-01-01",
      phoneNumber: "+1234567890",
      email: "john@example.com",
      bankAccountNumber: "1234567890",
    };

    await expect(
      repository.update("non-existent", updatedCustomer)
    ).rejects.toThrow("Customer not found");
  });

  it("deletes a customer", async () => {
    await repository.delete("1");
    const customers = await repository.getAll();
    expect(customers).toHaveLength(0);
  });

  it("handles empty storage", async () => {
    localStorage.clear();
    const customers = await repository.getAll();
    expect(customers).toEqual([]);
  });
});
