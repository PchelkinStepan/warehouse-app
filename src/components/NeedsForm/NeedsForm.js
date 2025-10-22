import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { Close, Link as LinkIcon } from '@mui/icons-material';

const NeedsForm = ({ onSubmit, onClose, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    quantity: initialData?.quantity || '',
    priority: initialData?.priority || 'medium',
    link: initialData?.link || '',
    notes: initialData?.notes || '',
    status: initialData?.status || 'pending'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const needData = {
      ...formData,
      quantity: parseInt(formData.quantity) || 1
    };
    
    onSubmit(needData);
    
    // Сбрасываем форму только если это не редактирование
    if (!isEditing) {
      setFormData({
        name: '',
        quantity: '',
        priority: 'medium',
        link: '',
        notes: '',
        status: 'pending'
      });
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const priorities = [
    { value: 'low', label: '🟢 Низкий' },
    { value: 'medium', label: '🟡 Средний' },
    { value: 'high', label: '🔴 Высокий' }
  ];

  const statuses = [
    { value: 'pending', label: '⏳ Ожидает' },
    { value: 'ordered', label: '📦 Заказано' },
    { value: 'received', label: '✅ Получено' }
  ];

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isEditing ? '✏️ Редактировать покупку' : '🛒 Добавить покупку в лабораторию'}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Основная информация */}
            <TextField
              fullWidth
              label="Название товара *"
              value={formData.name}
              onChange={handleChange('name')}
              required
              placeholder="Что нужно заказать?"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Количество *"
                type="number"
                value={formData.quantity}
                onChange={handleChange('quantity')}
                required
                InputProps={{
                  inputProps: { min: 1 }
                }}
              />
              
              <TextField
                fullWidth
                select
                label="Приоритет *"
                value={formData.priority}
                onChange={handleChange('priority')}
                required
              >
                {priorities.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Ссылка и статус */}
            <TextField
              fullWidth
              label="Ссылка на товар"
              value={formData.link}
              onChange={handleChange('link')}
              placeholder="https://example.com/product"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {isEditing && (
              <TextField
                fullWidth
                select
                label="Статус"
                value={formData.status}
                onChange={handleChange('status')}
              >
                {statuses.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {/* Примечания */}
            <TextField
              fullWidth
              label="Примечания"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange('notes')}
              placeholder="Дополнительная информация, характеристики, где искать..."
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose}>
            Отмена
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={!formData.name || !formData.quantity}
          >
            {isEditing ? '💾 Сохранить' : '🛒 Добавить покупку'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NeedsForm;