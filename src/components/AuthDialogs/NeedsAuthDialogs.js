import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';

const PASSWORD = '3395509';

export const NeedsAuthDialogs = ({ dialogs, onClose, onAuth }) => {
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
        ? { open: false, need: null, needId: null, needName: '' }
        : false
    }));
  };

  return (
    <>
      {/* Добавление покупки */}
      <Dialog open={dialogs.needsAdd} onClose={() => handleClose('needsAdd')}>
        <DialogTitle>Подтверждение добавления</DialogTitle>
        <DialogContent>
          <Typography>Вы хотите добавить новую покупку в лабораторию?</Typography>
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
          <Button onClick={() => handleClose('needsAdd')}>Отмена</Button>
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

      {/* Редактирование покупки */}
      <Dialog open={dialogs.needsEdit.open} onClose={() => handleClose('needsEdit')}>
        <DialogTitle>Подтверждение редактирования</DialogTitle>
        <DialogContent>
          <Typography>
            Вы хотите редактировать покупку: <strong>"{dialogs.needsEdit.need?.name}"</strong>?
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
          <Button onClick={() => handleClose('needsEdit')}>Отмена</Button>
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

      {/* Удаление покупки */}
      <Dialog open={dialogs.needsDelete.open} onClose={() => handleClose('needsDelete')}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить покупку: <strong>"{dialogs.needsDelete.needName}"</strong>?
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
          <Button onClick={() => handleClose('needsDelete')}>Отмена</Button>
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