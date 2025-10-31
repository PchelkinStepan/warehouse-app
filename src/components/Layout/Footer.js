import React from 'react';
import { Box, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Box sx={{ 
      mt: 6, 
      pt: 3, 
      borderTop: '1px solid',
      borderColor: 'divider',
      textAlign: 'center'
    }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Разработано с ❤️
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
        <span>Автор: </span>
        <Box 
          component="a"
          href="https://t.me/step3395509"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ 
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: 'primary.main',
            textDecoration: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            transition: 'all 0.2s ease',
            borderRadius: '6px',
            px: 1.5,
            py: 0.5,
            '&:hover': {
              backgroundColor: 'primary.dark',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }
          }}
        >
          <span>Пчёлкин Степан</span>
          <Box 
            component="span" 
            sx={{ 
              backgroundColor: 'white',
              color: 'primary.main',
              borderRadius: '4px',
              px: 0.5,
              fontSize: '0.75rem',
              ml: 0.5,
              fontWeight: 'bold'
            }}
          >
            PRO
          </Box>
        </Box>
      </Typography>
      
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
        © 2025 Warehouse Management System | Все права защищены
      </Typography>
    </Box>
  );
};