"use client";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styled components
const HeroSection = styled("div")({
  background: "linear-gradient(135deg, #007FFF, #00FF7F)",
  color: "white",
  textAlign: "center",
  padding: "4rem 2rem",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
});

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: theme.shadows[3],
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 400,
}));

interface Expense {
  id: string;
  name: string;
  description: string;
  amount: number;
  debit: boolean;
  credit: boolean;
  date: string;
}

export default function ExpenseDashboard() {
  const { id } = useParams(); // Extract userId from route
  const router = useRouter();
  const [remainingBudget, setRemainingBudget] = useState<number>(0);

  // Fetch expenses and budget
  const {
    data: userExpenses = [],
    isLoading,
    isError,
    error,
  } = useQuery<Expense[]>({
    queryKey: ["userExpenses", id],
    queryFn: async () => {
      const response = await axios.get("http://localhost:1000/userExpenses");
      return response.data.filter((expense: any) => expense.userId === id);
    },
    enabled: !!id, // Only fetch if userId exists
    retry: false, // Avoid retrying on failure
  });

  // Group expenses by month and year
  const groupedExpenses = userExpenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`; // Format as MM-YYYY

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(expense);

    return acc;
  }, {} as Record<string, Expense[]>);

  // Calculate total debits, credits, and balance for each month
  const calculateTotals = (expenses: Expense[]) => {
    const totalDebits = expenses
      .filter((expense) => expense.debit)
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
    const totalCredits = expenses
      .filter((expense) => expense.credit)
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
    const remainingBalance = totalCredits - totalDebits;

    return { totalDebits, totalCredits, remainingBalance };
  };

  // Handle Add Expense click
  const handleAddExpense = () => {
    toast.info("Redirecting to Add Expense Page", {
      position: "top-right",
      autoClose: 3000,
    });
    router.push("/myhabits/" + id);
  };

  // Loading state
  if (isLoading) {
    return (
      <Container className="flex justify-center items-center h-screen">
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  // Error state
  if (isError) {
    return (
      <Container className="flex justify-center items-center h-screen">
        <StyledTypography color="error">
          {error instanceof Error
            ? error.message
            : "Failed to load expenses. Please try again."}
        </StyledTypography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-10">
      <ToastContainer />
      {/* Hero Section */}
      <HeroSection>
        <Typography
          variant="h3"
          gutterBottom
          style={{ fontWeight: 600, fontFamily: "'Roboto', sans-serif" }}
        >
          Welcome to Your Expense Dashboard
        </Typography>
        <Typography
          variant="h6"
          style={{ fontWeight: 300, fontFamily: "'Roboto', sans-serif" }}
        >
          Manage your expenses, track your budget, and save effectively!
        </Typography>
      </HeroSection>

      {/* Overview and Expenses Grouped by Month */}
      {Object.keys(groupedExpenses).map((monthYear) => {
        const expenses = groupedExpenses[monthYear];
        const { totalDebits, totalCredits, remainingBalance } = calculateTotals(
          expenses
        );

        return (
          <section key={monthYear} className="mt-10">
            {/* Monthly Overview */}
            <Grid container spacing={4} className="mb-6">
              <Grid item xs={12} md={4}>
                <StyledCard>
                  <CardContent>
                    <StyledTypography variant="h5" gutterBottom>
                      Total Credits for {monthYear}
                    </StyledTypography>
                    <Typography
                      variant="h3"
                      color="secondary"
                      style={{ fontWeight: 600 }}
                    >
                      ₹{totalCredits}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledCard>
                  <CardContent>
                    <StyledTypography variant="h5" gutterBottom>
                      Total Debits for {monthYear}
                    </StyledTypography>
                    <Typography
                      variant="h3"
                      color="primary"
                      style={{ fontWeight: 600 }}
                    >
                      ₹{totalDebits}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledCard>
                  <CardContent>
                    <StyledTypography variant="h5" gutterBottom>
                      Remaining for {monthYear}
                    </StyledTypography>
                    <Typography
                      variant="h3"
                      color="error"
                      style={{ fontWeight: 600 }}
                    >
                      ₹{remainingBalance}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            </Grid>

            {/* Expenses List for the Month */}
            <StyledTypography
              variant="h4"
              gutterBottom
              style={{
                fontWeight: 600,
                fontFamily: "'Roboto', sans-serif",
                color: "#A445B2",
              }}
            >
              Your Expenses for {monthYear}
            </StyledTypography>

            <Grid container spacing={4}>
              {expenses.map((expense: Expense) => (
                <Grid item xs={12} md={6} lg={4} key={expense.id}>
                  <StyledCard
                    style={{
                      background: "linear-gradient(135deg,rgb(193, 224, 255),rgb(201, 252, 226))",
                      border: "1px solidrgb(162, 245, 213)",
                    }}
                  >
                    <CardContent
                      style={{
                        padding: "1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                      }}
                    >
                      <Typography
                        variant="h6"
                        style={{
                          fontWeight: 600,
                          fontFamily: "'Roboto', sans-serif",
                          color: "#6A0DAD",
                        }}
                      >
                        {expense.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        style={{
                          fontFamily: "'Roboto', sans-serif",
                          marginBottom: "1rem",
                        }}
                      >
                        {expense.description}
                      </Typography>
                      <Box
                        style={{
                          backgroundColor: "rgba(106, 13, 173, 0.1)",
                          padding: "0.5rem",
                          borderRadius: "8px",
                        }}
                      >
                        <Typography
                          variant="body2"
                          style={{
                            fontWeight: 500,
                            fontFamily: "'Roboto', sans-serif",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <strong>Amount:</strong> ₹{expense.amount}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{
                            fontWeight: 500,
                            fontFamily: "'Roboto', sans-serif",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <strong>Date:</strong>{" "}
                          {new Date(expense.date).toLocaleDateString()}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{
                            fontWeight: 500,
                            fontFamily: "'Roboto', sans-serif",
                          }}
                        >
                          <strong>Type:</strong>{" "}
                          {expense.debit === false ? "credit" : "debit"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </section>
        );
      })}

      {/* Add Expense Section */}
      <HeroSection className="mt-12">
        <Button
          variant="contained"
          style={{
            background: "linear-gradient(135deg,rgb(104, 179, 255),rgb(86, 254, 170))",
            fontWeight: 500,
            fontFamily: "'Roboto', sans-serif",
          }}
          onClick={handleAddExpense}
        >
          Add Expense
        </Button>
      </HeroSection>
    </Container>
  );
}
