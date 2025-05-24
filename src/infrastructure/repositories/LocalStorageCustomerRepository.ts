import type { Customer } from "../../domain/models/Customer";
import type { CustomerRepository } from "../../domain/repositories/CustomerRepository";

const STORAGE_KEY = "customers";

export class LocalStorageCustomerRepository implements CustomerRepository {
  private getCustomers(): Customer[] {
    const customersJson = localStorage.getItem(STORAGE_KEY);
    return customersJson ? JSON.parse(customersJson) : [];
  }

  private saveCustomers(customers: Customer[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }

  async getAll(): Promise<Customer[]> {
    return this.getCustomers();
  }

  async getById(id: string): Promise<Customer | null> {
    const customers = this.getCustomers();
    return customers.find((customer) => customer.id === id) || null;
  }

  async create(customer: Customer): Promise<Customer> {
    const customers = this.getCustomers();
    const newCustomer = {
      ...customer,
      id: crypto.randomUUID(),
    };
    customers.push(newCustomer);
    this.saveCustomers(customers);
    return newCustomer;
  }

  async update(id: string, customer: Customer): Promise<Customer> {
    const customers = this.getCustomers();
    const index = customers.findIndex((c) => c.id === id);

    if (index === -1) {
      throw new Error("Customer not found");
    }

    const updatedCustomer = {
      ...customer,
      id,
    };

    customers[index] = updatedCustomer;
    this.saveCustomers(customers);
    return updatedCustomer;
  }

  async delete(id: string): Promise<void> {
    const customers = this.getCustomers();
    const filteredCustomers = customers.filter(
      (customer) => customer.id !== id
    );
    this.saveCustomers(filteredCustomers);
  }
}
