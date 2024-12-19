"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/system";
import Link from "next/link";
import SignupModal from "./auth/registration/page";

// Define the custom gradient colors and other theme colors
const gradientColors = {
  primary: "linear-gradient(135deg, #007FFF, #00FF7F)", // Original gradient
  secondary: "linear-gradient(135deg,rgb(104, 179, 255),rgb(86, 254, 170))", // Gradient for buttons and highlights
  cardBackground: "#FFFFFF", // White background for cards
  headingColor: "#007FFF", // Heading color
  buttonColor: "#00FF778", // Button accent color
};

const HeroSection = styled("div")(({ theme }) => ({
  background: gradientColors.primary,
  color: "white",
  textAlign: "center",
  padding: "4rem 2rem",
  borderRadius: "16px",
  fontFamily: "'Roboto', sans-serif",
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  background: gradientColors.cardBackground,
  boxShadow: theme.shadows[4],
  borderRadius: "16px",
  transition: "transform 0.3s ease",
  fontFamily: "'Roboto', sans-serif",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 400,
  color: theme.palette.text.primary,
}));

export default function ExpenseTrackerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const [userId, setUserId] = useState(null); // State to track if user is logged in

  useEffect(() => {
    // Get userId from localStorage on page load
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const handleOpenModal = () => setIsModalOpen(true); // Open modal
  const handleCloseModal = () => setIsModalOpen(false); // Close modal

  return (
    <Container maxWidth="lg" className="py-10">
      {/* Hero Section */}
      <HeroSection>
        <Typography variant="h2" gutterBottom style={{ fontWeight: 600 }}>
          Track Your Expenses
        </Typography>
        <Typography variant="h6" gutterBottom style={{ fontWeight: 300 }}>
          Gain insights into your spending, save money, and achieve financial
          freedom.
        </Typography>
        <div className="mt-6">
          {/* Only show the button if user is not logged in */}
          {!userId && (
            <Button
              variant="contained"
              style={{
                background: gradientColors.secondary,
                fontWeight: 500,
              }}
              size="large"
              onClick={handleOpenModal} // Open modal on click
            >
              Get Started
            </Button>
          )}
        </div>
      </HeroSection>

      {/* Features Section */}
      <section className="my-16">
        <StyledTypography
          variant="h4"
          align="center"
          style={{
            fontWeight: 600,
            color: gradientColors.headingColor,
          }}
          gutterBottom
        >
          Why Choose Our Expense Tracker?
        </StyledTypography>
        <Grid container spacing={4} className="mt-6">
          {/* Feature Cards */}
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardContent>
                <StyledTypography
                  variant="h5"
                  gutterBottom
                  style={{ fontWeight: 500, color: gradientColors.buttonColor }}
                >
                  Simple Expense Logging
                </StyledTypography>
                <Typography variant="body1">
                  Quickly log your expenses and categorize them with ease.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardContent>
                <StyledTypography
                  variant="h5"
                  gutterBottom
                  style={{ fontWeight: 500, color: gradientColors.buttonColor }}
                >
                  Visual Spending Analysis
                </StyledTypography>
                <Typography variant="body1">
                  View detailed charts and graphs to understand your spending
                  habits.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardContent>
                <StyledTypography
                  variant="h5"
                  gutterBottom
                  style={{ fontWeight: 500, color: gradientColors.buttonColor }}
                >
                  Budget Planning
                </StyledTypography>
                <Typography variant="body1">
                  Set budgets for categories and track your progress to stay
                  within limits.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
        </Grid>
      </section>

      {/* Call to Action Section */}
      <section
        className="text-center py-12"
        style={{
          background: gradientColors.primary,
          borderRadius: "20px",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        <Typography variant="h4" gutterBottom style={{ fontWeight: 600 }}>
          {userId
            ? "Thanks for Joining Thousands of Savvy Spenders Like You!"
            : "Ready to Take Control of Your Finances?"}
        </Typography>
        <Typography
          variant="body1"
          className="mb-6"
          style={{ fontWeight: 300 }}
        >
          {userId
            ? "We’re thrilled to have you on board! Keep tracking your expenses and saving money effortlessly."
            : "Join thousands of users transforming their finances with our Expense Tracker."}
        </Typography>
        {/* Only show the button if user is not logged in */}
        {!userId && (
          <Button
            variant="contained"
            style={{
              background: gradientColors.secondary,
              fontWeight: 500,
            }}
            size="large"
            onClick={handleOpenModal} // Open modal on click
          >
            Sign Up Now
          </Button>
        )}
      </section>

      {/* Signup Modal */}
      <SignupModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </Container>
  );
}
