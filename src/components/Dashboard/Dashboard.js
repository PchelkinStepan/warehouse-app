import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip
} from '@mui/material';
import {
  Inventory,
  ShoppingCart
} from '@mui/icons-material';

const Dashboard = ({ onNavigate, products, needsCount = 0 }) => {
  const cards = [
    {
      id: 'warehouse',
      title: '📦 Склад',
      description: 'Управление товарами и позициями',
      icon: <Inventory sx={{ fontSize: 48, color: 'primary.main' }} />,
      color: 'primary',
      stats: `${products.length} позиций`,
      disabled: false
    },
    {
      id: 'needs',
      title: '🛒 Купить в лабораторию',
      description: 'Список необходимых закупок',
      icon: <ShoppingCart sx={{ fontSize: 48, color: 'success.main' }} />,
      color: 'success',
      stats: `${needsCount} покупок`,
      disabled: false
    },
  ];

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
        🏠 Панель управления
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={6} lg={6} key={card.id}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                transition: 'all 0.3s ease',
                opacity: card.disabled ? 0.6 : 1,
                '&:hover': {
                  transform: card.disabled ? 'none' : 'translateY(-8px)',
                  boxShadow: card.disabled ? 3 : 6
                }
              }}
            >
              <CardActionArea 
                onClick={() => !card.disabled && onNavigate(card.id)}
                sx={{ 
                  height: '100%',
                  cursor: card.disabled ? 'not-allowed' : 'pointer'
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {card.icon}
                  </Box>
                  
                  <Typography variant="h4" component="h3" gutterBottom>
                    {card.title}
                  </Typography>
                  
                  <Chip 
                    label={card.stats}
                    color={card.color}
                    variant="filled"
                    size="medium"
                    sx={{ mb: 2, fontSize: '0.9rem', fontWeight: 'bold' }}
                  />
                  
                  <Typography 
                    variant="body1" 
                    color="textSecondary"
                    sx={{ minHeight: 40 }}
                  >
                    {card.description}
                  </Typography>

                  {card.disabled && (
                    <Chip 
                      label="Скоро"
                      color="default"
                      variant="outlined"
                      size="small"
                      sx={{ mt: 2 }}
                    />
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;