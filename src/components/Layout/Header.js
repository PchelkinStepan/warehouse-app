import React from 'react';
import { Typography, Box, Button } from '@mui/material';

export const Header = ({ currentView, onExport, onAdd, products, filteredProducts }) => {
  if (currentView === 'warehouse') {
    return (
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3" component="h1">📦 Склад</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={onAdd}>
            + Добавить позицию
          </Button>
          <Button variant="contained" onClick={onExport} disabled={filteredProducts.length === 0}>
            📊 Выгрузить в Excel
          </Button>
        </Box>
      </Box>
    );
  }

  if (currentView === 'needs') {
    return (
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3" component="h1">🛒 Купить в лабораторию</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={onAdd}>
            ➕ Добавить покупку
          </Button>
        </Box>
      </Box>
    );
  }

  return null;
};