import React, { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm/ProductForm';
import ProductTable from './components/ProductTable/ProductTable';
import { 
  Button, 
  Container, 
  Typography, 
  Box, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import { exportToExcel } from './utils/excelExport';
import { 
  subscribeToProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from './firebase/productsService';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    productId: null,
    productName: ''
  });
  const [editDialog, setEditDialog] = useState({
    open: false,
    product: null
  });
  const [addDialog, setAddDialog] = useState({
    open: false
  });
  const [pendingProductData, setPendingProductData] = useState(null);

  // Подписываемся на обновления товаров из Firebase
  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeToProducts((productsData) => {
      setProducts(productsData);
      setLoading(false);
    });

    // Отписываемся при размонтировании компонента
    return () => unsubscribe();
  }, []);

  const handleAddProduct = async (productData) => {
    try {
      await addProduct(productData);
      setShowForm(false);
      setAlertMessage('Позиция успешно добавлена!');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      alert('Ошибка при добавлении позиции: ' + error.message);
    }
  };

  const openAddDialog = () => {
    setAddDialog({
      open: true
    });
  };

  const handleAddAuth = (password) => {
    if (password === '3395509') {
      setAddDialog({ open: false });
      setShowForm(true);
    } else {
      alert('Неверный пароль! Добавление отменено.');
    }
  };

  const handleEditProduct = async (productData) => {
    try {
      await updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
      setAlertMessage('Позиция успешно обновлена!');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      alert('Ошибка при обновлении позиции: ' + error.message);
    }
  };

  const openEditDialog = (product) => {
    setEditDialog({
      open: true,
      product
    });
  };

  const handleEditAuth = (password) => {
    if (password === '3395509') {
      setEditingProduct(editDialog.product);
      setEditDialog({ open: false, product: null });
    } else {
      alert('Неверный пароль! Редактирование отменено.');
    }
  };

  const openDeleteDialog = (productId, productName) => {
    setDeleteDialog({
      open: true,
      productId,
      productName
    });
  };

  const handleDeleteProduct = async (password) => {
    if (password === '3395509') {
      try {
        await deleteProduct(deleteDialog.productId);
        setDeleteDialog({ open: false, productId: null, productName: '' });
        setAlertMessage('Позиция успешно удалена!');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } catch (error) {
        alert('Ошибка при удалении позиции: ' + error.message);
      }
    } else {
      alert('Неверный пароль! Удаление отменено.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Загрузка данных из облака...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3" component="h1">
          📦 Учет склада
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={openAddDialog}
          >
            + Добавить позицию
          </Button>
          
          <Button 
            variant="contained"
            onClick={() => exportToExcel(products)}
            disabled={products.length === 0}
          >
            📊 Выгрузить в Excel
          </Button>
        </Box>
      </Box>

      {showAlert && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {alertMessage}
        </Alert>
      )}

      {/* Форма добавления новой позиции */}
      {showForm && (
        <ProductForm 
          onSubmit={handleAddProduct}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Форма редактирования существующей позиции */}
      {editingProduct && (
        <ProductForm 
          onSubmit={handleEditProduct}
          onClose={() => setEditingProduct(null)}
          initialData={editingProduct}
          isEditing={true}
        />
      )}

      <ProductTable 
        products={products}
        onDeleteProduct={openDeleteDialog}
        onEditProduct={openEditDialog}
      />

      {/* Диалог подтверждения добавления */}
      <Dialog open={addDialog.open} onClose={() => setAddDialog({ open: false })}>
        <DialogTitle>Подтверждение добавления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы хотите добавить новую позицию в базу данных?
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
                handleAddAuth(e.target.value);
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialog({ open: false })}>
            Отмена
          </Button>
          <Button 
            onClick={() => {
              const passwordInput = document.querySelector('input[type="password"]');
              handleAddAuth(passwordInput.value);
            }} 
            color="primary"
            variant="contained"
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, productId: null, productName: '' })}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить позицию: <strong>"{deleteDialog.productName}"</strong>?
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
                handleDeleteProduct(e.target.value);
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, productId: null, productName: '' })}>
            Отмена
          </Button>
          <Button 
            onClick={() => {
              const passwordInput = document.querySelector('input[type="password"]');
              handleDeleteProduct(passwordInput.value);
            }} 
            color="error"
            variant="contained"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения редактирования */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, product: null })}>
        <DialogTitle>Подтверждение редактирования</DialogTitle>
        <DialogContent>
          <Typography>
            Вы хотите редактировать позицию: <strong>"{editDialog.product?.name}"</strong>?
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
                handleEditAuth(e.target.value);
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, product: null })}>
            Отмена
          </Button>
          <Button 
            onClick={() => {
              const passwordInput = document.querySelector('input[type="password"]');
              handleEditAuth(passwordInput.value);
            }} 
            color="primary"
            variant="contained"
          >
            Редактировать
          </Button>
        </DialogActions>
      </Dialog>

      {products.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="textSecondary">
            📭 Склад пуст. Добавьте первую позицию!
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Данные синхронизируются в реальном времени между всеми устройствами
          </Typography>
        </Box>
      )}

      {products.length > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            💾 Позиций в базе: {products.length}
          </Typography>
        </Box>
      )}

      {/* Стильный копирайт */}
      <Box 
        sx={{ 
          mt: 6, 
          pt: 3, 
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 1
          }}
        >
          Разработано с ❤️
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 1,
            flexWrap: 'wrap'
          }}
        >
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
        
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ 
            display: 'block',
            mt: 1,
            opacity: 0.7
          }}
        >
          © 2025 Warehouse Management System | Все права защищены
        </Typography>
      </Box>
    </Container>
  );
}

export default App;