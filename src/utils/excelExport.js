import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (products) => {
  if (!products || products.length === 0) {
    alert('Нет данных для экспорта!');
    return;
  }

  // Подготавливаем данные для Excel
  const excelData = products.map(product => ({
    'ID': product.id,
    'Название товара': product.name,
    'Категория': product.category || 'Не указана',
    'Количество': product.quantity,
    'Поставщик': product.supplier || 'Не указан',
    'Дата поступления': formatDate(product.arrivalDate),
    'Описание': product.notes || '',
    'Дата создания': formatDate(product.createdAt)
  }));

  // Создаем рабочую книгу и лист
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  
  // Настраиваем ширину колонок
  const columnWidths = [
    { wch: 15 }, // ID
    { wch: 30 }, // Название
    { wch: 20 }, // Категория
    { wch: 12 }, // Количество
    { wch: 25 }, // Поставщик
    { wch: 15 }, // Дата поступления
    { wch: 15 }, // Срок годности
    { wch: 40 }, // Заметки
    { wch: 15 }  // Дата создания
  ];
  worksheet['!cols'] = columnWidths;

  // Добавляем лист в книгу
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Товары склада');

  // Генерируем файл и скачиваем
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const fileName = `склад_данные_${new Date().toISOString().split('T')[0]}.xlsx`;
  saveAs(data, fileName);
};

// Вспомогательная функция для форматирования дат
const formatDate = (dateString) => {
  if (!dateString) return '—';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  } catch (error) {
    return '—';
  }
};

// Дополнительная функция для экспорта с фильтрацией
export const exportFilteredToExcel = (products, filters = {}) => {
  let filteredProducts = products;
  
  // Применяем фильтры если они есть
  if (filters.category) {
    filteredProducts = filteredProducts.filter(
      product => product.category === filters.category
    );
  }
  
  if (filters.supplier) {
    filteredProducts = filteredProducts.filter(
      product => product.supplier === filters.supplier
    );
  }
  
  exportToExcel(filteredProducts);
};