import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { NeedsStats } from './NeedsStats';
import NeedsTable from '../NeedsTable/NeedsTable';

export const NeedsView = ({ needs, onDeleteNeed, onEditNeed, loading = false }) => {
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Загрузка списка покупок...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Статистика покупок */}
      <NeedsStats needs={needs} />

      {/* Таблица покупок */}
      <NeedsTable 
        needs={needs}
        onDeleteNeed={onDeleteNeed}
        onEditNeed={onEditNeed}
      />

      {/* Сообщение когда нет данных */}
      {needs.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="textSecondary">
            📝 Список покупок пуст. Добавьте первую запись!
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Отслеживайте что нужно купить для лаборатории
          </Typography>
        </Box>
      )}
    </>
  );
};