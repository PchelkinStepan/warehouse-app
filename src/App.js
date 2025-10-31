import React, { useState } from 'react';
import {
  Container,
  Box,
  Alert,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';

// Components
import Dashboard from './components/Dashboard/Dashboard';
import { Navigation } from './components/Layout/Navigation';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { WarehouseView } from './components/Warehouse/WarehouseView';
import { NeedsView } from './components/Needs/NeedsView';
import ProductForm from './components/ProductForm/ProductForm';
import NeedsForm from './components/NeedsForm/NeedsForm';

// Hooks
import { useProducts } from './hooks/useProducts';
import { useNeeds } from './hooks/useNeeds';

// Services
import { addProduct, updateProduct, deleteProduct } from './firebase/productsService';
import { addNeed, updateNeed, deleteNeed } from './firebase/needsService';
import { exportToExcel } from './utils/excelExport';

import './App.css';

function App() {
  // State
  const [currentView, setCurrentView] = useState('dashboard');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showNeedsForm, setShowNeedsForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingNeed, setEditingNeed] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [authDialog, setAuthDialog] = useState({
    open: false,
    type: '', // 'product-add', 'needs-add', 'product-edit', 'needs-edit', 'product-delete', 'needs-delete'
    data: null
  });

  // Data Hooks
  const { products, loading: productsLoading } = useProducts();
  const { needs, loading: needsLoading } = useNeeds();

  // Navigation
  const handleNavigate = (view) => setCurrentView(view);
  const handleBackToDashboard = () => setCurrentView('dashboard');

  // Alert Helper
  const showSuccessAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Auth Functions
  const handleAuthCheck = (type, data = null) => {
    setAuthDialog({
      open: true,
      type,
      data
    });
  };

  const handleAuthConfirm = (password) => {
    if (password === '3395509') {
      switch (authDialog.type) {
        case 'product-add':
          setShowProductForm(true);
          break;
        case 'needs-add':
          setShowNeedsForm(true);
          break;
        case 'product-edit':
          setEditingProduct(authDialog.data);
          break;
        case 'needs-edit':
          setEditingNeed(authDialog.data);
          break;
        case 'product-delete':
          executeDeleteProduct(authDialog.data.id, authDialog.data.name);
          break;
        case 'needs-delete':
          executeDeleteNeed(authDialog.data.id, authDialog.data.name);
          break;
        default:
          break;
      }
      setAuthDialog({ open: false, type: '', data: null });
    } else {
      alert('Неверный пароль! Действие отменено.');
    }
  };

  // Product Handlers
  const executeAddProduct = async (productData) => {
    try {
      await addProduct(productData);
      setShowProductForm(false);
      showSuccessAlert('Позиция успешно добавлена!');
    } catch (error) {
      alert('Ошибка при добавлении позиции: ' + error.message);
    }
  };

  const executeEditProduct = async (productData) => {
    try {
      await updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
      showSuccessAlert('Позиция успешно обновлена!');
    } catch (error) {
      alert('Ошибка при обновлении позиции: ' + error.message);
    }
  };

  const executeDeleteProduct = async (productId, productName) => {
    try {
      await deleteProduct(productId);
      showSuccessAlert('Позиция успешно удалена!');
    } catch (error) {
      alert('Ошибка при удалении позиции: ' + error.message);
    }
  };

  // Needs Handlers
  const executeAddNeed = async (needData) => {
    try {
      await addNeed(needData);
      setShowNeedsForm(false);
      showSuccessAlert('Покупка успешно добавлена!');
    } catch (error) {
      alert('Ошибка при добавлении покупки: ' + error.message);
    }
  };

  const executeEditNeed = async (needData) => {
    try {
      await updateNeed(editingNeed.id, needData);
      setEditingNeed(null);
      showSuccessAlert('Покупка успешно обновлена!');
    } catch (error) {
      alert('Ошибка при обновлении покупки: ' + error.message);
    }
  };

  const executeDeleteNeed = async (needId, needName) => {
    try {
      await deleteNeed(needId);
      showSuccessAlert('Покупка успешно удалена!');
    } catch (error) {
      alert('Ошибка при удалении покупки: ' + error.message);
    }
  };

  // UI Handlers
  const openProductAdd = () => handleAuthCheck('product-add');
  const openProductEdit = (product) => handleAuthCheck('product-edit', product);
  const openProductDelete = (productId, productName) => handleAuthCheck('product-delete', { id: productId, name: productName });

  const openNeedsAdd = () => handleAuthCheck('needs-add');
  const openNeedsEdit = (need) => handleAuthCheck('needs-edit', need);
  const openNeedsDelete = (needId, needName) => handleAuthCheck('needs-delete', { id: needId, name: needName });

  // Export
  const handleExport = () => exportToExcel(products);

  // Loading State
  if (productsLoading && currentView !== 'needs') {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Загрузка данных из облака...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Navigation */}
      <Navigation currentView={currentView} onBackToDashboard={handleBackToDashboard} />

      {/* Header */}
      <Header 
        currentView={currentView}
        onExport={handleExport}
        onAdd={currentView === 'warehouse' ? openProductAdd : openNeedsAdd}
        products={products}
        filteredProducts={products}
      />

      {/* Alert */}
      {showAlert && <Alert severity="success" sx={{ mb: 2 }}>{alertMessage}</Alert>}

      {/* Main Content */}
      {currentView === 'dashboard' && (
        <Dashboard 
          onNavigate={handleNavigate}
          products={products}
          needsCount={needs.length}
        />
      )}

      {currentView === 'warehouse' && (
        <WarehouseView 
          products={products}
          onDeleteProduct={openProductDelete}
          onEditProduct={openProductEdit}
          loading={productsLoading}
        />
      )}

      {currentView === 'needs' && (
        <NeedsView 
          needs={needs}
          onDeleteNeed={openNeedsDelete}
          onEditNeed={openNeedsEdit}
          loading={needsLoading}
        />
      )}

      {/* Forms */}
      {showProductForm && (
        <ProductForm 
          onSubmit={executeAddProduct}
          onClose={() => setShowProductForm(false)}
        />
      )}

      {editingProduct && (
        <ProductForm 
          onSubmit={executeEditProduct}
          onClose={() => setEditingProduct(null)}
          initialData={editingProduct}
          isEditing={true}
        />
      )}

      {showNeedsForm && (
        <NeedsForm 
          onSubmit={executeAddNeed}
          onClose={() => setShowNeedsForm(false)}
        />
      )}

      {editingNeed && (
        <NeedsForm 
          onSubmit={executeEditNeed}
          onClose={() => setEditingNeed(null)}
          initialData={editingNeed}
          isEditing={true}
        />
      )}

      {/* Auth Dialog */}
      <Dialog open={authDialog.open} onClose={() => setAuthDialog({ open: false, type: '', data: null })}>
        <DialogTitle>
          {authDialog.type.includes('delete') ? 'Подтверждение удаления' : 
           authDialog.type.includes('edit') ? 'Подтверждение редактирования' : 'Подтверждение добавления'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {authDialog.type.includes('delete') ? `Вы уверены, что хотите удалить ${authDialog.type.includes('product') ? 'позицию' : 'покупку'}: ` : 
             authDialog.type.includes('edit') ? `Вы хотите редактировать ${authDialog.type.includes('product') ? 'позицию' : 'покупку'}: ` : 
             `Вы хотите добавить новую ${authDialog.type.includes('product') ? 'позицию' : 'покупку'}?`}
            
            {authDialog.data && <strong>"{authDialog.data.name}"</strong>}
            {authDialog.type.includes('delete') ? '?' : ''}
          </Typography>
          <Typography variant="body2" color={authDialog.type.includes('delete') ? "error" : "primary"} sx={{ mt: 2 }}>
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
                handleAuthConfirm(e.target.value);
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAuthDialog({ open: false, type: '', data: null })}>
            Отмена
          </Button>
          <Button 
            onClick={() => {
              const passwordInput = document.querySelector('input[type="password"]');
              handleAuthConfirm(passwordInput.value);
            }} 
            color={authDialog.type.includes('delete') ? "error" : "primary"}
            variant="contained"
          >
            {authDialog.type.includes('delete') ? 'Удалить' : 
             authDialog.type.includes('edit') ? 'Редактировать' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Footer */}
      <Footer />
    </Container>
  );
}

export default App;