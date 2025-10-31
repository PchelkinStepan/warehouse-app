import React from 'react';
import { Tabs, Tab, Box, Chip } from '@mui/material';

export const CategoryTabs = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  products 
}) => {
  return (
    <Box sx={{ 
      borderBottom: 1, 
      borderColor: 'divider', 
      mb: 3,
      backgroundColor: 'white',
      borderRadius: 2,
      px: 2,
      boxShadow: 1
    }}>
      <Tabs 
        value={selectedCategory} 
        onChange={onCategoryChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTab-root': {
            fontWeight: 'bold',
            fontSize: '0.9rem',
            minHeight: 48,
            color: 'text.primary',
            opacity: 0.7,
            '&.Mui-selected': {
              color: 'primary.main',
              opacity: 1,
              fontWeight: 'bold'
            },
            '&:hover': {
              color: 'primary.main',
              opacity: 0.9
            }
          },
          '& .MuiTabs-indicator': {
            backgroundColor: 'primary.main',
            height: 3
          }
        }}
      >
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>Все</span>
              <Chip 
                label={products.length} 
                size="small" 
                color="primary"
                variant="filled"
                sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
              />
            </Box>
          } 
          value="all" 
        />
        {categories.map((category) => (
          <Tab 
            key={category}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{category}</span>
                <Chip 
                  label={products.filter(p => p.category === category).length} 
                  size="small" 
                  color="primary"
                  variant="filled"
                  sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                />
              </Box>
            } 
            value={category} 
          />
        ))}
      </Tabs>
    </Box>
  );
};