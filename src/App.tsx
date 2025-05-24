import React, { useEffect, useState } from "react";
import { Container, Button, Typography, Box, Alert } from "@mui/material";
import { CustomerForm } from "./presentation/components/CustomerForm";
import { CustomerList } from "./presentation/components/CustomerList";
import { useCustomer } from "./application/hooks/useCustomer";
import type { Customer } from "./domain/models/Customer";

function App() {
  const {
    customers,
    error,
    loadCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomer();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >();

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleCreate = async (data: Customer) => {
    const result = await createCustomer(data);
    if (result) {
      setIsFormOpen(false);
    }
  };

  const handleUpdate = async (data: Customer) => {
    if (selectedCustomer?.id) {
      const result = await updateCustomer(selectedCustomer.id, data);
      if (result) {
        setIsFormOpen(false);
        setSelectedCustomer(undefined);
      }
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      await deleteCustomer(id);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Customer Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!isFormOpen && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsFormOpen(true)}
            sx={{ mb: 2 }}
          >
            Add New Customer
          </Button>
        )}

        {isFormOpen ? (
          <CustomerForm
            initialData={selectedCustomer}
            onSubmit={selectedCustomer ? handleUpdate : handleCreate}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedCustomer(undefined);
            }}
          />
        ) : (
          <CustomerList
            customers={customers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Box>
    </Container>
  );
}

export default App;
