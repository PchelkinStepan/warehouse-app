import { 
  ref, 
  push, 
  update, 
  remove, 
  onValue
} from 'firebase/database';
import { db } from './config';

// Референс к коллекции потребностей
const needsRef = ref(db, 'needs');

// Подписаться на обновления потребностей
export const subscribeToNeeds = (callback) => {
  const unsubscribe = onValue(needsRef, (snapshot) => {
    const needsData = snapshot.val();
    const needs = needsData ? Object.keys(needsData).map(key => ({
      id: key,
      ...needsData[key]
    })) : [];
    
    // Сортируем по приоритету и дате (высокий приоритет и новые сверху)
    needs.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      return priorityDiff !== 0 ? priorityDiff : new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    callback(needs);
  });

  return unsubscribe;
};

// Добавить новую потребность
export const addNeed = async (needData) => {
  try {
    const newNeedRef = push(needsRef);
    await update(newNeedRef, {
      ...needData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
    return newNeedRef.key;
  } catch (error) {
    console.error('Ошибка при добавлении потребности:', error);
    throw error;
  }
};

// Обновить потребность
export const updateNeed = async (needId, needData) => {
  try {
    const needRef = ref(db, `needs/${needId}`);
    await update(needRef, {
      ...needData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ошибка при обновлении потребности:', error);
    throw error;
  }
};

// Удалить потребность
export const deleteNeed = async (needId) => {
  try {
    const needRef = ref(db, `needs/${needId}`);
    await remove(needRef);
  } catch (error) {
    console.error('Ошибка при удалении потребности:', error);
    throw error;
  }
};