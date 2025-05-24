import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, Typography } from "@mui/material";
import type { Customer } from "../../domain/models/Customer";

interface CustomerFormProps {
  initialData?: Customer;
  onSubmit: (data: Customer) => Promise<void>;
  onCancel: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Customer>({
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      phoneNumber: "",
      email: "",
      bankAccountNumber: "",
    },
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 600, mx: "auto", p: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        {initialData ? "Edit Customer" : "Create Customer"}
      </Typography>

      <Controller
        name="firstName"
        control={control}
        rules={{ required: "First name is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="First Name"
            fullWidth
            margin="normal"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        )}
      />

      <Controller
        name="lastName"
        control={control}
        rules={{ required: "Last name is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Last Name"
            fullWidth
            margin="normal"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        )}
      />

      <Controller
        name="dateOfBirth"
        control={control}
        rules={{ required: "Date of birth is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Date of Birth"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth?.message}
          />
        )}
      />

      <Controller
        name="phoneNumber"
        control={control}
        rules={{ required: "Phone number is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Phone Number"
            fullWidth
            margin="normal"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email address",
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />

      <Controller
        name="bankAccountNumber"
        control={control}
        rules={{
          required: "Bank account number is required",
          pattern: {
            value: /^\d{8,17}$/,
            message: "Invalid bank account number",
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Bank Account Number"
            fullWidth
            margin="normal"
            error={!!errors.bankAccountNumber}
            helperText={errors.bankAccountNumber?.message}
          />
        )}
      />

      <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {initialData ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  );
};
