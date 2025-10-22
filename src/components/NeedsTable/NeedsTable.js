import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Box,
  Typography,
  Link
} from '@mui/material';
import { Delete, Edit, OpenInNew } from '@mui/icons-material';

const NeedsTable = ({ needs, onDeleteNeed, onEditNeed }) => {
  if (needs.length === 0) {
    return null;
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning'; 
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'default';
      case 'ordered': return 'primary';
      case 'received': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'ordered': return '📦';
      case 'received': return '✅';
      default: return '⚪';
    }
  };

  return (
    <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="таблица покупок">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: 250 }}>Название покупки</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: 120 }}>Количество</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: 120 }}>Приоритет</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: 120 }}>Статус</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: 150 }}>Ссылка</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: 120 }}>Дата добавления</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: 200 }}>Примечания</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: 120 }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {needs.map((need) => (
              <TableRow 
                key={need.id}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: 'action.hover' },
                  opacity: need.status === 'received' ? 0.7 : 1
                }}
              >
                {/* Название покупки */}
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {need.name}
                  </Typography>
                </TableCell>
                
                {/* Количество */}
                <TableCell>
                  <Chip 
                    label={need.quantity} 
                    color={getPriorityColor(need.priority)}
                    variant="filled"
                  />
                </TableCell>
                
                {/* Приоритет */}
                <TableCell>
                  <Chip 
                    label={`${getPriorityIcon(need.priority)} ${need.priority === 'high' ? 'Высокий' : need.priority === 'medium' ? 'Средний' : 'Низкий'}`}
                    color={getPriorityColor(need.priority)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                
                {/* Статус */}
                <TableCell>
                  <Chip 
                    label={`${getStatusIcon(need.status)} ${need.status === 'pending' ? 'Ожидает' : need.status === 'ordered' ? 'Заказано' : 'Получено'}`}
                    color={getStatusColor(need.status)}
                    size="small"
                  />
                </TableCell>
                
                {/* Ссылка */}
                <TableCell>
                  {need.link ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Link 
                        href={need.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ 
                          fontSize: '0.875rem',
                          maxWidth: 120,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Перейти
                      </Link>
                      <OpenInNew sx={{ fontSize: 16, color: 'action.active' }} />
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      —
                    </Typography>
                  )}
                </TableCell>
                
                {/* Дата добавления */}
                <TableCell>
                  <Typography variant="body2">
                    {new Date(need.createdAt).toLocaleDateString('ru-RU')}
                  </Typography>
                </TableCell>
                
                {/* Примечания */}
                <TableCell>
                  {need.notes ? (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: 200,
                        wordWrap: 'break-word',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {need.notes}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Нет примечаний
                    </Typography>
                  )}
                </TableCell>
                
                {/* Действия */}
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      color="primary"
                      title="Редактировать"
                      onClick={() => onEditNeed(need)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => onDeleteNeed(need.id, need.name)}
                      title="Удалить"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default NeedsTable;