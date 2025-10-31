import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';

const PASSWORD = '3395509';

export const ProductAuthDialogs = ({ dialogs, onClose, onAuth }) => {
  const handleAuth = (type, password) => {
    if (password === PASSWORD) {
      onAuth(type);
    } else {
      alert('Неверный пароль! Действие отменено.');
    }
  };

  const handleClose = (dialogType) => {
    onClose(prev => ({
      ...prev,
      [dialogType]: dialogType.includes('Edit') || dialogType.includes('Delete') 
        ? { open: false, product: null, productId: null, productName: '' }
        : false
    }));
  };

  return (
    <>
      {/* Добавление товара */}
      <Dialog open={dialogs.productAdd} onClose={() => handleClose('productAdd')}>
        <DialogTitle>Подтверждение добавления</DialogTitle>
        <DialogContent>
          <Typography>Вы хотите добавить новую позицию в базу данных?</Typography>
          <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
            Для подтверждения введите пароль:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            type="password"
            fullWidth
            variant="outlined"
            placeholder="Введите пароль"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAuth('add', e.target.value);
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose('productAdd')}>Отмена</Button>
          <Button 
            onClick={() => {
              const passwordInput = document.querySelector('input[type="password"]');
              handleAuth('add', passwordInput.value);
            }} 
            color="primary"
            variant="contained"
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Редактирование товара */}
      <Dialog open={dialogs.productEdit.open} onClose={() => handleClose('productEdit')}>
        <DialogTitle>Подтверждение редактирования</DialogTitle>
        <DialogContent>
          <Typography>
            Вы хотите редактировать позицию: <strong>"{dialogs.productEdit.product?.name}"</strong>?
          </Typography>
          <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
            Для подтверждения введите пароль:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            type="password"
            fullWidth
            variant="outlined"
            placeholder="Введите пароль"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAuth('edit', e.target.value);
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose('productEdit')}>Отмена</Button>
          <Button 
            onClick={() => {
              const passwordInput = document.querySelector('input[type="password"]');
              handleAuth('edit', passwordInput.value);
            }} 
            color="primary"
            variant="contained"
          >
            Редактировать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Удаление товара */}
      <Dialog open={dialogs.productDelete.open} onClose={() => handleClose('productDelete')}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить позицию: <strong>"{dialogs.productDelete.productName}"</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Для подтверждения введите пароль:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            type="password"
            fullWidth
            variant="outlined"
            placeholder="Введите пароль"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAuth('delete', e.target.value);
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose('productDelete')}>Отмена</Button>
          <Button 
            onClick={() => {
              const passwordInput = document.querySelector('input[type="password"]');
              handleAuth('delete', passwordInput.value);
            }} 
            color="error"
            variant="contained"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};