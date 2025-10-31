import { useState, useEffect } from 'react';
import { subscribeToProducts } from '../firebase/productsService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToProducts((productsData) => {
      setProducts(productsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { products, loading };
};