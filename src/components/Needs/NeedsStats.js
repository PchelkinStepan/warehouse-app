import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

export const NeedsStats = ({ needs }) => {
  const stats = {
    pending: needs.filter(n => n.status === 'pending').length,
    ordered: needs.filter(n => n.status === 'ordered').length,
    received: needs.filter(n => n.status === 'received').length
  };

  return (
    <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main">
              {stats.pending}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ⏳ Ожидают покупки
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">
              {stats.ordered}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              📦 Заказано
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {stats.received}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ✅ Получено
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};