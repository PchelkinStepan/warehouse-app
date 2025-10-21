import { 
    ref, 
    push, 
    update, 
    remove, 
    onValue,
    off 
  } from 'firebase/database';
  import { db } from './config';
  
  // Референс к коллекции товаров
  const productsRef = ref(db, 'products');
  
  // Подписаться на обновления товаров
  export const subscribeToProducts = (callback) => {
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const productsData = snapshot.val();
      const products = productsData ? Object.keys(productsData).map(key => ({
        id: key,
        ...productsData[key]
      })) : [];
      
      // Сортируем по дате создания (новые сверху)
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      callback(products);
    });
  
    return unsubscribe;
  };
  
  // Добавить новый товар
  export const addProduct = async (productData) => {
    try {
      const newProductRef = push(productsRef);
      await update(newProductRef, {
        ...productData,
        createdAt: new Date().toISOString()
      });
      return newProductRef.key;
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
      throw error;
    }
  };
  
  // Обновить товар
  export const updateProduct = async (productId, productData) => {
    try {
      const productRef = ref(db, `products/${productId}`);
      await update(productRef, {
        ...productData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Ошибка при обновлении товара:', error);
      throw error;
    }
  };
  
  // Удалить товар
  export const deleteProduct = async (productId) => {
    try {
      const productRef = ref(db, `products/${productId}`);
      await remove(productRef);
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
      throw error;
    }
  };