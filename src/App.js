import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import ProductForm from './components/ProductForm/ProductForm';
import ProductTable from './components/ProductTable/ProductTable';
import NeedsTable from './components/NeedsTable/NeedsTable';
import NeedsForm from './components/NeedsForm/NeedsForm';
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
  CircularProgress,
  Tabs,
  Tab,
  Chip,
  Breadcrumbs,
  Link,
  Grid
} from '@mui/material';
import { exportToExcel } from './utils/excelExport';
import { 
  subscribeToProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from './firebase/productsService';
import { 
  subscribeToNeeds, 
  addNeed, 
  updateNeed, 
  deleteNeed 
} from './firebase/needsService';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingNeed, setEditingNeed] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [needsLoading, setNeedsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
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
  const [needsDeleteDialog, setNeedsDeleteDialog] = useState({
    open: false,
    needId: null,
    needName: ''
  });
  const [needsEditDialog, setNeedsEditDialog] = useState({
    open: false,
    need: null
  });
  const [needsAddDialog, setNeedsAddDialog] = useState({
    open: false
  });

  // Подписываемся на обновления товаров из Firebase
  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeToProducts((productsData) => {
      setProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Подписываемся на обновления потребностей из Firebase
  useEffect(() => {
    setNeedsLoading(true);
    
    const unsubscribe = subscribeToNeeds((needsData) => {
      setNeeds(needsData);
      setNeedsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Получаем уникальные категории из продуктов
  const categories = React.useMemo(() => {
    const allCategories = products
      .map(product => product.category)
      .filter(category => category && category.trim() !== '');
    
    const uniqueCategories = [...new Set(allCategories)].sort();
    return uniqueCategories;
  }, [products]);

  // Фильтруем продукты по выбранной категории
  const filteredProducts = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  }, [products, selectedCategory]);

  // Навигация
  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedCategory('all');
  };

  // Обработчики для товаров
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

  const handleAddAuth = (password) => {
    if (password === '3395509') {
      setAddDialog({ open: false });
      setShowForm(true);
    } else {
      alert('Неверный пароль! Добавление отменено.');
    }
  };

  // Обработчики для покупок
  const handleAddNeed = async (needData) => {
    try {
      await addNeed(needData);
      setShowForm(false);
      setAlertMessage('Покупка успешно добавлена!');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      alert('Ошибка при добавлении покупки: ' + error.message);
    }
  };

  const handleEditNeed = async (needData) => {
    try {
      await updateNeed(editingNeed.id, needData);
      setEditingNeed(null);
      setAlertMessage('Покупка успешно обновлена!');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      alert('Ошибка при обновлении покупки: ' + error.message);
    }
  };

  const openNeedsEditDialog = (need) => {
    setNeedsEditDialog({
      open: true,
      need
    });
  };

  const handleNeedsEditAuth = (password) => {
    if (password === '3395509') {
      setEditingNeed(needsEditDialog.need);
      setNeedsEditDialog({ open: false, need: null });
    } else {
      alert('Неверный пароль! Редактирование отменено.');
    }
  };

  const openNeedsDeleteDialog = (needId, needName) => {
    setNeedsDeleteDialog({
      open: true,
      needId,
      needName
    });
  };

  const handleDeleteNeed = async (password) => {
    if (password === '3395509') {
      try {
        await deleteNeed(needsDeleteDialog.needId);
        setNeedsDeleteDialog({ open: false, needId: null, needName: '' });
        setAlertMessage('Покупка успешно удалена!');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } catch (error) {
        alert('Ошибка при удалении покупки: ' + error.message);
      }
    } else {
      alert('Неверный пароль! Удаление отменено.');
    }
  };

  const handleNeedsAddAuth = (password) => {
    if (password === '3395509') {
      setNeedsAddDialog({ open: false });
      setShowForm(true);
    } else {
      alert('Неверный пароль! Добавление отменено.');
    }
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  if (loading && currentView !== 'needs') {
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
      {/* Хлебные крошки для навигации */}
      {currentView !== 'dashboard' && (
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              component="button"
              variant="body1"
              onClick={handleBackToDashboard}
              sx={{ 
                cursor: 'pointer',
                fontWeight: 600,
                color: 'common.white',
                textDecoration: 'none',
                fontSize: '1rem',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                '&:hover': {
                  textDecoration: 'underline',
                  color: 'primary.light'
                }
              }}
            >
              🏠 Главная
            </Link>
            <Typography 
              color="common.white" 
              sx={{ 
                fontWeight: 600, 
                fontSize: '1rem',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              {currentView === 'warehouse' ? '📦 Склад' : 
               currentView === 'needs' ? '🛒 Купить в лабораторию' : currentView}
            </Typography>
          </Breadcrumbs>
        </Box>
      )}

      {/* Заголовок и кнопки действий для склада */}
      {currentView === 'warehouse' && (
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3" component="h1">
            📦 Склад
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setAddDialog({ open: true })}
            >
              + Добавить позицию
            </Button>
            
            <Button 
              variant="contained"
              onClick={() => exportToExcel(filteredProducts)}
              disabled={filteredProducts.length === 0}
            >
              📊 Выгрузить в Excel
            </Button>
          </Box>
        </Box>
      )}

      {/* Заголовок и кнопки действий для "Купить в лабораторию" */}
      {currentView === 'needs' && (
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3" component="h1">
            🛒 Купить в лабораторию
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setNeedsAddDialog({ open: true })}
            >
              ➕ Добавить покупку
            </Button>
          </Box>
        </Box>
      )}

      {showAlert && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {alertMessage}
        </Alert>
      )}

      {/* Основной контент */}
      {currentView === 'dashboard' ? (
        <Dashboard 
          onNavigate={handleNavigate}
          products={products}
          needsCount={needs.length}
        />
      ) : currentView === 'warehouse' ? (
        <>
          {/* Вкладки категорий */}
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider', 
            mb: 3,
            backgroundColor: 'white',
            borderRadius: 2,
            px: 2,
            boxShadow: 1
          }}>
            <Tabs 
              value={selectedCategory} 
              onChange={handleCategoryChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  minHeight: 48,
                  color: 'text.primary',
                  opacity: 0.7,
                  '&.Mui-selected': {
                    color: 'primary.main',
                    opacity: 1,
                    fontWeight: 'bold'
                  },
                  '&:hover': {
                    color: 'primary.main',
                    opacity: 0.9
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                  height: 3
                }
              }}
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>Все</span>
                    <Chip 
                      label={products.length} 
                      size="small" 
                      color="primary"
                      variant="filled"
                      sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                    />
                  </Box>
                } 
                value="all" 
              />
              {categories.map((category) => (
                <Tab 
                  key={category}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{category}</span>
                      <Chip 
                        label={products.filter(p => p.category === category).length} 
                        size="small" 
                        color="primary"
                        variant="filled"
                        sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                      />
                    </Box>
                  } 
                  value={category} 
                />
              ))}
            </Tabs>
          </Box>

          {/* Таблица товаров */}
          <ProductTable 
            products={filteredProducts}
            onDeleteProduct={openDeleteDialog}
            onEditProduct={openEditDialog}
          />

          {/* Сообщение когда нет данных */}
          {filteredProducts.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="textSecondary">
                {selectedCategory === 'all' ? '📭 Склад пуст. Добавьте первую позицию!' : `📭 В категории "${selectedCategory}" пока нет позиций`}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Данные синхронизируются в реальном времени между всеми устройствами
              </Typography>
            </Box>
          )}

          {filteredProducts.length > 0 && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                💾 Показано: {filteredProducts.length} из {products.length} позиций
                {selectedCategory !== 'all' && ` в категории "${selectedCategory}"`}
              </Typography>
            </Box>
          )}
        </>
      ) : currentView === 'needs' ? (
        <>
          {/* Статистика покупок */}
          <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main">
                    {needs.filter(n => n.status === 'pending').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ⏳ Ожидают покупки
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {needs.filter(n => n.status === 'ordered').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    📦 Заказано
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {needs.filter(n => n.status === 'received').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ✅ Получено
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Таблица покупок */}
          {needsLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Загрузка списка покупок...
              </Typography>
            </Box>
          ) : (
            <>
              <NeedsTable 
                needs={needs}
                onDeleteNeed={openNeedsDeleteDialog}
                onEditNeed={openNeedsEditDialog}
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
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" gutterBottom>
            🚧 Раздел в разработке
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Этот функционал появится в ближайших обновлениях
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={handleBackToDashboard}
          >
            ← Назад на главную
          </Button>
        </Box>
      )}

      {/* Формы для товаров */}
      {showForm && currentView === 'warehouse' && (
        <ProductForm 
          onSubmit={handleAddProduct}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingProduct && (
        <ProductForm 
          onSubmit={handleEditProduct}
          onClose={() => setEditingProduct(null)}
          initialData={editingProduct}
          isEditing={true}
        />
      )}

      {/* Формы для покупок */}
      {showForm && currentView === 'needs' && (
        <NeedsForm 
          onSubmit={handleAddNeed}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingNeed && (
        <NeedsForm 
          onSubmit={handleEditNeed}
          onClose={() => setEditingNeed(null)}
          initialData={editingNeed}
          isEditing={true}
        />
      )}

      {/* Диалоги с паролями для товаров */}
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

      {/* Диалоги с паролями для покупок */}
      <Dialog open={needsAddDialog.open} onClose={() => setNeedsAddDialog({ open: false })}>
        <DialogTitle>Подтверждение добавления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы хотите добавить новую покупку в лабораторию?
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
                handleNeedsAddAuth(e.target.value);
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNeedsAddDialog({ open: false })}>
            Отмена
          </Button>
          <Button 
            onClick={() => {
              const passwordInput = document.querySelector('input[type="password"]');
              handleNeedsAddAuth(passwordInput.value);
            }} 
            color="primary"
            variant="contained"
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={needsDeleteDialog.open} onClose={() => setNeedsDeleteDialog({ open: false, needId: null, needName: '' })}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить покупку: <strong>"{needsDeleteDialog.needName}"</strong>?
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
                handleDeleteNeed(e.target.value);
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNeedsDeleteDialog({ open: false, needId: null, needName: '' })}>
            Отмена
          </Button>
          <Button 
            onClick={() => {
              const passwordInput = document.querySelector('input[type="password"]');
              handleDeleteNeed(passwordInput.value);
            }} 
            color="error"
            variant="contained"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={needsEditDialog.open} onClose={() => setNeedsEditDialog({ open: false, need: null })}>
        <DialogTitle>Подтверждение редактирования</DialogTitle>
        <DialogContent>
          <Typography>
            Вы хотите редактировать покупку: <strong>"{needsEditDialog.need?.name}"</strong>?
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
                handleNeedsEditAuth(e.target.value);
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNeedsEditDialog({ open: false, need: null })}>
            Отмена
          </Button>
          <Button 
            onClick={() => {
              const passwordInput = document.querySelector('input[type="password"]');
              handleNeedsEditAuth(passwordInput.value);
            }} 
            color="primary"
            variant="contained"
          >
            Редактировать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Копирайт */}
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