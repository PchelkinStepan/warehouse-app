import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { CategoryTabs } from './CategoryTabs';
import { ProductStats } from './ProductStats';
import ProductTable from '../ProductTable/ProductTable';

export const WarehouseView = ({ 
  products, 
  onDeleteProduct, 
  onEditProduct,
  loading = false 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Получаем уникальные категории из продуктов
  const categories = useMemo(() => {
    const allCategories = products
      .map(product => product.category)
      .filter(category => category && category.trim() !== '');
    
    const uniqueCategories = [...new Set(allCategories)].sort();
    return uniqueCategories;
  }, [products]);

  // Фильтруем продукты по выбранной категории
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  }, [products, selectedCategory]);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">Загрузка склада...</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Вкладки категорий */}
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        products={products}
      />

      {/* Таблица товаров */}
      <ProductTable 
        products={filteredProducts}
        onDeleteProduct={onDeleteProduct}
        onEditProduct={onEditProduct}
      />

      {/* Сообщение когда нет данных */}
      {filteredProducts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="textSecondary">
            {selectedCategory === 'all' 
              ? '📭 Склад пуст. Добавьте первую позицию!' 
              : `📭 В категории "${selectedCategory}" пока нет позиций`
            }
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Данные синхронизируются в реальном времени между всеми устройствами
          </Typography>
        </Box>
      )}

      {/* Статистика */}
      {filteredProducts.length > 0 && (
        <ProductStats 
          filteredCount={filteredProducts.length} 
          totalCount={products.length}
          selectedCategory={selectedCategory}
        />
      )}
    </>
  );
};