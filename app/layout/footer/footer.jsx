import React from 'react';
import {  Typography } from '@mui/material';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center text-white text-2xl font-bold">
          <Typography
        variant="h6"
        component="div"
        sx={{
          background: 'linear-gradient(135deg,rgb(191, 247, 134), #00FF7F)', // Gradient background
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: 'bold',
          fontSize: '32px',
          display: 'inline-block',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)', // Text shadow for border-like effect
        }}
      >
        Fintrack
      </Typography>
          </Link>
        </div>
        <div className="mt-4 text-md">
          <p>&copy; {new Date().getFullYear()} FinTrack. All rights reserved.</p>
          <p className="text-sm mt-4">
            FinTrack helps you efficiently track expenses, manage your budget, and achieve your financial goals with ease.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
