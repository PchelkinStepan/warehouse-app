import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';

export const Navigation = ({ currentView, onBackToDashboard }) => {
  if (currentView === 'dashboard') return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          component="button"
          variant="body1"
          onClick={onBackToDashboard}
          sx={{ 
            cursor: 'pointer',
            fontWeight: 600,
            color: 'common.white',
            textDecoration: 'none',
            fontSize: '1rem',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            '&:hover': {
              textDecoration: 'underline',
              color: 'primary.light'
            }
          }}
        >
          🏠 Главная
        </Link>
        <Typography 
          color="common.white" 
          sx={{ 
            fontWeight: 600, 
            fontSize: '1rem',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          {currentView === 'warehouse' ? '📦 Склад' : 
           currentView === 'needs' ? '🛒 Купить в лабораторию' : currentView}
        </Typography>
      </Breadcrumbs>
    </Box>
  );
};