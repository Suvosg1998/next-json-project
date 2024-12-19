"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { styled } from "@mui/system";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "react-toastify/dist/ReactToastify.css";

type Expense = {
  id: string;
  category: string;
  description: string;
  amount: string;
  date: string;
  time: string;
  credit: boolean;
  debit: boolean;
  userId: string;
};

type FormErrors = Partial<Record<keyof Expense, string>>;

const HeroSection = styled("div")({
  background: "linear-gradient(135deg, #007FFF, #00FF7F)", // Updated gradient
  color: "white",
  textAlign: "center",
  padding: "4rem 2rem",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
});

const CenteredButton = styled("div")({
  display: "flex",
  justifyContent: "center",
  margin: "2rem 0 1rem",
});
const ExpenseManagement: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const queryClient = useQueryClient();
  const API_URL = "http://localhost:1000/userExpenses";

  const [formData, setFormData] = useState<Expense>({
    id: "",
    category: "",
    description: "",
    amount: "",
    date: "",
    time: "",
    credit: false,
    debit: false,
    userId: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.category) errors.category = "Category is required.";
    if (!formData.description) errors.description = "Description is required.";
    if (!formData.amount || isNaN(Number(formData.amount)))
      errors.amount = "Valid amount is required.";
    if (!formData.date) errors.date = "Date is required.";
    if (!formData.time) errors.time = "Time is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const { data: expenses = [] } = useQuery({
    queryKey: ["userExpenses", userId],
    queryFn: async () => {
      const response = await axios.get<Expense[]>(API_URL);
      return response.data.filter((expense) => expense.userId === userId);
    },
  });
  

  const mutation = useMutation({
    mutationFn: async (newExpense: Expense) => {
      const payload = { ...newExpense, userId };
      if (isEditing) {
        await axios.put(`${API_URL}/${newExpense.id}`, payload);
      } else {
        await axios.post(API_URL, { ...payload, id: Date.now().toString() });
      }
    },
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries(["userExpenses", userId]);
      setModalOpen(false);
      toast.success(isEditing ? "Expense updated successfully!" : "Expense added successfully!");
    },
    onError: () => {
      toast.error("Failed to save expense. Please try again.");
    },
  });
  

const deleteMutation = useMutation({
  mutationFn: async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
  },
  onSuccess: () => {
    queryClient.invalidateQueries(["userExpenses", userId]);
    toast.success("Expense deleted successfully!");
  },
  onError: () => {
    toast.error("Failed to delete expense. Please try again.");
  },
});


  const handleSubmit = () => validateForm() && mutation.mutate(formData);

  const resetForm = () => {
    setFormData({
      id: "",
      category: "",
      description: "",
      amount: "",
      date: "",
      time: "",
      credit: false,
      debit: false,
      userId: "",
    });
    setFormErrors({});
    setIsEditing(false);
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: "3rem" }}>
      <HeroSection>
        <Typography variant="h3">Manage Your Expenses</Typography>
        <Typography variant="h6">Track your income and expenditures efficiently.</Typography>
      </HeroSection>

      <CenteredButton>
        <Button variant="contained"style={{
            background: "linear-gradient(135deg,rgb(104, 179, 255),rgb(86, 254, 170))",
            fontWeight: 500,
            fontFamily: "'Roboto', sans-serif"
          }} startIcon={<AddCircleIcon />} onClick={() => { resetForm(); setModalOpen(true); }}>
          Add Expense
        </Button>
      </CenteredButton>

      <Typography variant="h5" color="#A445B2" gutterBottom>Your Expenses</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {["Category", "Description", "Amount", "Date", "Time", "Type", "Actions"].map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense: Expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.amount}</TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{expense.time}</TableCell>
                <TableCell>{expense.credit ? "Credit" : "Debit"}</TableCell>
                <TableCell>
                  <Button variant="outlined" startIcon={<EditIcon />} onClick={() => { setFormData(expense); setIsEditing(true); setModalOpen(true); }}>Edit</Button>
                  <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => deleteMutation.mutate(expense.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isModalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>{isEditing ? "Edit Expense" : "Add Expense"}</DialogTitle>
        <DialogContent>
          {["Category", "Description", "Amount"].map((field) => (
            <TextField
              key={field}
              label={field}
              type={field === "Amount" ? "number" : field === "Date" || field === "Time" ? field.toLowerCase() : "text"}
              value={formData[field.toLowerCase() as keyof Expense]}
              onChange={(e) => setFormData({ ...formData, [field.toLowerCase()]: e.target.value })}
              fullWidth
              margin="normal"
              error={!!formErrors[field.toLowerCase() as keyof FormErrors]}
              helperText={formErrors[field.toLowerCase() as keyof FormErrors]}
            />
          ))}
          <TextField
      type="date"
      label="Select Date"
      InputLabelProps={{ shrink: true }}
      value={formData.date as keyof Expense}
      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
      style={{
        backgroundColor: "#f9f9f9", // Light background
        
        //borderRadius: "4px",  Rounded corners
        padding: "4px", // Spacing around the field
        marginTop: "10px",
        fontSize: "16px", // Adjust font size
        
       // border: "1px solid #4caf50", // Green border
      }}
      InputProps={{
        style: {
          padding: "3px", // Padding inside the input
          width: 260
        },
      }}
    />
    <TextField
      type="time"
      label="Select Time"
      InputLabelProps={{ shrink: true }}
      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
      value={formData.time as keyof Expense}
      style={{
        backgroundColor: "#f9f9f9", // Light background
       // borderRadius: "4px", // Rounded corners
        padding: "4px", // Spacing around the field
        marginLeft: "16px",
        marginTop: "10px",
        fontSize: "16px", // Adjust font size
       // border: "1px solid #4caf50", // Green border
      }}
      InputProps={{
        style: {
          padding: "3px", // Padding inside the input
          width: 260
        },
      }}
    />

          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
  value={formData.credit ? "Credit" : formData.debit ? "Debit" : ""}
  onChange={(e) =>
    setFormData({
      ...formData,
      credit: e.target.value === "Credit",
      debit: e.target.value === "Debit",
    })
  }
>
  {["Credit", "Debit"].map((type) => (
    <MenuItem key={type} value={type}>
      {type}
    </MenuItem>
  ))}
</Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEditing ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Container>
  );
};

export default ExpenseManagement;
