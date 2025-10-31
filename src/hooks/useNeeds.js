import { useState, useEffect } from 'react';
import { subscribeToNeeds } from '../firebase/needsService';

export const useNeeds = () => {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToNeeds((needsData) => {
      setNeeds(needsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { needs, loading };
};