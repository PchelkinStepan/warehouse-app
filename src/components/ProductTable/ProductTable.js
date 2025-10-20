import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Box,
  Typography,
  Dialog,
  DialogContent,
  IconButton as MuiIconButton
} from '@mui/material';
import { Delete, Edit, Close, ZoomIn } from '@mui/icons-material';

const ProductTable = ({ products, onDeleteProduct, onEditProduct }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (products.length === 0) {
    return null;
  }

  const handleImageClick = (photo, productName) => {
    if (photo) {
      setSelectedImage({ photo, productName });
    }
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="таблица товаров">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: 80 }}>Фото</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Название</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Категория</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: 120 }}>Количество</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Поставщик</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: 140 }}>Дата поступления</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: 200 }}>Описание</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: 150 }}>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow 
                  key={product.id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  <TableCell>
                    {product.photo ? (
                      <Box
                        sx={{
                          position: 'relative',
                          cursor: 'pointer',
                          '&:hover .zoom-icon': {
                            opacity: 1
                          }
                        }}
                        onClick={() => handleImageClick(product.photo, product.name)}
                      >
                        <Box
                          component="img"
                          src={product.photo}
                          alt={product.name}
                          sx={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider'
                          }}
                        />
                        <Box
                          className="zoom-icon"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            '&:hover': {
                              opacity: 1
                            }
                          }}
                        >
                          <ZoomIn sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          backgroundColor: 'grey.100',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1,
                          border: '1px dashed',
                          borderColor: 'grey.300'
                        }}
                      >
                        <Typography variant="caption" color="grey.500">
                          Нет фото
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {product.name}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    {product.category ? (
                      <Chip 
                        label={product.category} 
                        size="small" 
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        —
                      </Typography>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Chip 
                      label={product.quantity} 
                      color={product.quantity > 0 ? "primary" : "default"}
                      variant={product.quantity > 0 ? "filled" : "outlined"}
                    />
                  </TableCell>
                  
                  <TableCell>
                    {product.supplier || (
                      <Typography variant="body2" color="textSecondary">
                        —
                      </Typography>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(product.arrivalDate).toLocaleDateString('ru-RU')}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    {product.notes ? (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 200,
                          wordWrap: 'break-word'
                        }}
                      >
                        {product.notes}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Нет описания
                      </Typography>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        title="Редактировать товар"
                        onClick={() => onEditProduct(product)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => onDeleteProduct(product.id, product.name)}
                        title="Удалить товар"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Модальное окно для просмотра фото */}
      <Dialog 
        open={!!selectedImage} 
        onClose={handleCloseImage}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ position: 'relative', p: 0 }}>
          <MuiIconButton
            onClick={handleCloseImage}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)'
              }
            }}
          >
            <Close />
          </MuiIconButton>
          
          {selectedImage && (
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedImage.productName}
              </Typography>
              <Box
                component="img"
                src={selectedImage.photo}
                alt={selectedImage.productName}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  borderRadius: 1
                }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductTable;