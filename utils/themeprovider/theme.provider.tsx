"use client";

import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "light", // Change to "dark" if you want a dark theme
    primary: {
      main: "#3b5998",
    },
    background: {
      paper: "#fff",
      default: "#f5f5f5",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
});

const CustomThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default CustomThemeProvider;
