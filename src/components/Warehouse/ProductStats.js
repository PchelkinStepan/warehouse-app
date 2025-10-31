import React from 'react';
import { Box, Typography } from '@mui/material';

export const ProductStats = ({ filteredCount, totalCount, selectedCategory }) => {
  return (
    <Box sx={{ mt: 2, textAlign: 'center' }}>
      <Typography variant="body2" color="textSecondary">
        💾 Показано: {filteredCount} из {totalCount} позиций
        {selectedCategory !== 'all' && ` в категории "${selectedCategory}"`}
      </Typography>
    </Box>
  );
};