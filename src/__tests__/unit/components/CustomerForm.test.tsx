import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomerForm } from "../../../presentation/components/CustomerForm";
import type { Customer } from "../../../domain/models/Customer";

describe("CustomerForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders create form by default", () => {
    render(<CustomerForm {...defaultProps} />);
    expect(screen.getByText("Create Customer")).toBeInTheDocument();
  });

  it("renders edit form when initialData is provided", () => {
    const initialData: Customer = {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-01-01",
      phoneNumber: "+1234567890",
      email: "john@example.com",
      bankAccountNumber: "1234567890",
    };

    render(<CustomerForm {...defaultProps} initialData={initialData} />);
    expect(screen.getByText("Edit Customer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(<CustomerForm {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("validates required fields", async () => {
    render(<CustomerForm {...defaultProps} />);
    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(screen.getByText("First name is required")).toBeInTheDocument();
      expect(screen.getByText("Last name is required")).toBeInTheDocument();
      expect(screen.getByText("Date of birth is required")).toBeInTheDocument();
      expect(screen.getByText("Phone number is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(
        screen.getByText("Bank account number is required")
      ).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("validates email format", async () => {
    render(<CustomerForm {...defaultProps} />);

    const emailInput = screen.getByLabelText("Email");
    await userEvent.type(emailInput, "invalid-email");

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("validates bank account number format", async () => {
    render(<CustomerForm {...defaultProps} />);

    const accountInput = screen.getByLabelText("Bank Account Number");
    await userEvent.type(accountInput, "123");

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(
        screen.getByText("Invalid bank account number")
      ).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("submits form with valid data", async () => {
    render(<CustomerForm {...defaultProps} />);

    await userEvent.type(screen.getByLabelText("First Name"), "John");
    await userEvent.type(screen.getByLabelText("Last Name"), "Doe");
    await userEvent.type(screen.getByLabelText("Date of Birth"), "1990-01-01");
    await userEvent.type(screen.getByLabelText("Phone Number"), "+1234567890");
    await userEvent.type(screen.getByLabelText("Email"), "john@example.com");
    await userEvent.type(
      screen.getByLabelText("Bank Account Number"),
      "1234567890"
    );

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
        phoneNumber: "+1234567890",
        email: "john@example.com",
        bankAccountNumber: "1234567890",
      });
    });
  });
});
