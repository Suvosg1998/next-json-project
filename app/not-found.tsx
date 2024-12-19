import React from "react";
import { Container, Button, Typography } from "@mui/material";
import  Link  from "next/link";

const NotFound = () => {
  return (
    <Container
      maxWidth={false}
      className="flex items-center justify-center min-h-screen bg-white"
    >
      <div className="text-center p-10">
        <Typography variant="h1" className="text-6xl font-bold text-purple-600 mb-4">
          404
        </Typography>
        <Typography variant="h5" className="text-2xl text-purple-600 mb-6">
          Oops! The page you're looking for doesn't exist.
        </Typography>
        <Typography variant="body1" className="text-lg text-purple-600 mb-6">
          We couldn't find the page you were looking for. It might have been
          moved, deleted, or never existed.
        </Typography>
        <Link href="/">
          <Button variant="contained" color="primary" className="px-6 py-3 rounded-full">
            Go Back to Home
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default NotFound;
