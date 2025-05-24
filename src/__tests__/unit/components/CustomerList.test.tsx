import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CustomerList } from "../../../presentation/components/CustomerList";
import type { Customer } from "../../../domain/models/Customer";

describe("CustomerList", () => {
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
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      dateOfBirth: "1995-01-01",
      phoneNumber: "+9876543210",
      email: "jane@example.com",
      bankAccountNumber: "9876543210",
    },
  ];

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty state message when no customers", () => {
    render(
      <CustomerList
        customers={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText("No customers found")).toBeInTheDocument();
  });

  it("renders customer list with correct data", () => {
    render(
      <CustomerList
        customers={mockCustomers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("Smith")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    render(
      <CustomerList
        customers={mockCustomers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockCustomers[0]);
  });

  it("calls onDelete when delete button is clicked", () => {
    render(
      <CustomerList
        customers={mockCustomers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockCustomers[0].id);
  });

  it("formats date of birth correctly", () => {
    render(
      <CustomerList
        customers={mockCustomers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const formattedDate = new Date("1990-01-01").toLocaleDateString();
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });
});
