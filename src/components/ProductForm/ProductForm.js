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
  Typography
} from '@mui/material';
import { Close, AddPhotoAlternate } from '@mui/icons-material';

const ProductForm = ({ onSubmit, onClose, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    quantity: initialData?.quantity || '',
    supplier: initialData?.supplier || '',
    arrivalDate: initialData?.arrivalDate || new Date().toISOString().split('T')[0],
    notes: initialData?.notes || '',
    photo: initialData?.photo || null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      quantity: parseInt(formData.quantity) || 0,
      characteristics: initialData?.characteristics || {}
    };
    
    onSubmit(productData);
    
    // Сбрасываем форму только если это не редактирование
    if (!isEditing) {
      setFormData({
        name: '',
        category: '',
        quantity: '',
        supplier: '',
        arrivalDate: new Date().toISOString().split('T')[0],
        notes: '',
        photo: null
      });
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({...prev, photo: e.target.result}));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({...prev, photo: null}));
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isEditing ? '✏️ Редактировать товар' : 'Добавить новый товар'}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Блок с фото */}
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Название товара *"
                  value={formData.name}
                  onChange={handleChange('name')}
                  required
                />
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                {formData.photo ? (
                  <Box>
                    <img 
                      src={formData.photo} 
                      alt="Preview" 
                      style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <Button onClick={removePhoto} size="small" color="error">
                      Удалить
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="photo-upload"
                      type="file"
                      onChange={handlePhotoUpload}
                    />
                    <label htmlFor="photo-upload">
                      <IconButton component="span">
                        <AddPhotoAlternate sx={{ fontSize: 48 }} color="action" />
                      </IconButton>
                    </label>
                    <Typography variant="caption" display="block">
                      Добавить фото
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Категория"
                value={formData.category}
                onChange={handleChange('category')}
                placeholder="Электроника, Батарейки и т.д."
              />
              
              <TextField
                fullWidth
                label="Поставщик"
                value={formData.supplier}
                onChange={handleChange('supplier')}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Количество *"
                type="number"
                value={formData.quantity}
                onChange={handleChange('quantity')}
                required
              />
              
              <TextField
                fullWidth
                label="Дата поступления"
                type="date"
                value={formData.arrivalDate}
                onChange={handleChange('arrivalDate')}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <TextField
              fullWidth
              label="Описание"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange('notes')}
              placeholder="Описание товара, характеристики, особенности..."
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
            {isEditing ? '💾 Сохранить изменения' : 'Добавить товар'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;