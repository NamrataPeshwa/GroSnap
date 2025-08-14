import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Typography, Button, Card, CardContent, CardActions,
  TextField, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress, Snackbar, Alert,
  List, ListItem, ListItemText, Chip, Avatar, Badge,
  Select, MenuItem, InputLabel, FormControl, Fab
} from '@mui/material';
import {
  Edit as EditIcon, Add as AddIcon, Delete as DeleteIcon,
  Inventory as InventoryIcon, Store as StoreIcon, Receipt as ReceiptIcon,
  Check as CheckIcon, Close as CloseIcon, Phone as PhoneIcon,
  LocalShipping as ShippingIcon, ShoppingCart as CartIcon,
  AttachMoney as MoneyIcon, Category as CategoryIcon,
  Warehouse as WarehouseIcon, CloudUpload as CloudUploadIcon,
  Search as SearchIcon, FilterList as FilterIcon
} from '@mui/icons-material';
import { ThemeProvider, alpha } from '@mui/material/styles';
import { doc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from '../../../firebase.js';
import shopkeeperTheme from '../../themes/shopkeeperTheme';

const ShopkeeperManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [shopData, setShopData] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: '', 
    stock: '', 
    category: '',
    description: '',
    image: null
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const categories = [
    'Fresh Vegetables',
    'Fresh Fruits',
    'Dairy, Bread and Eggs',
    'Cereals and Breakfast',
    'Atta, Rice and Dal',
    'Oils and Ghee',
    'Masalas',
    'Dry Fruits and Seeds Mix',
    'Biscuits and Cakes',
    'Tea, Coffee and Milk drinks',
    'Snacks and Spreads',
    'Meat and Seafood'
  ];

  // Firebase Functions
  const saveProductsToFirestore = async (updatedProducts) => {
    const shopkeeperId = localStorage.getItem('shopkeeperId');
    if (!shopkeeperId) return;
    
    setSaving(true);
    try {
      const shopRef = doc(db, "shopkeepers", shopkeeperId);
      await updateDoc(shopRef, {
        products: updatedProducts,
        lastUpdated: new Date()
      });
      console.log('Products saved to Firestore successfully');
    } catch (error) {
      console.error('Error saving products:', error);
      showSnackbar('Error saving products to database', 'error');
    } finally {
      setSaving(false);
    }
  };

  const loadShopData = async () => {
    const shopkeeperId = localStorage.getItem('shopkeeperId');
    if (!shopkeeperId) {
      navigate('/shopkeeper/register');
      return;
    }

    try {
      console.log('Loading shop data for:', shopkeeperId);
      const shopDoc = await getDoc(doc(db, "shopkeepers", shopkeeperId));
      
      if (shopDoc.exists()) {
        const data = shopDoc.data();
        console.log('Shop data loaded:', data);
        setShopData(data);
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
        
        // Mock orders for now - you can implement proper order loading later
        setOrders([
          { 
            id: 1, 
            customer: 'John Doe', 
            items: ['Organic Apples (2kg)', 'Free Range Eggs (12pcs)'], 
            status: 'pending',
            date: '2023-05-15',
            total: 1197.75
          },
          { 
            id: 2, 
            customer: 'Jane Smith', 
            items: ['Whole Wheat Bread (2 loaves)'], 
            status: 'pending',
            date: '2023-05-15',
            total: 523.50
          }
        ]);
      } else {
        console.log('No shop document found');
        showSnackbar('Shop data not found. Please register again.', 'error');
        navigate('/shopkeeper/register');
      }
    } catch (error) {
      console.error('Error loading shop data:', error);
      showSnackbar('Error loading shop data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Search and Filter Functions
  const handleSearch = (query) => {
    setSearchQuery(query);
    filterProducts(query, categoryFilter);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    filterProducts(searchQuery, category);
  };

  const filterProducts = (search, category) => {
    let filtered = products;

    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('shopkeeperRegistered');
    if (!isAuthenticated) {
      navigate('/shopkeeper/register');
      return;
    }

    loadShopData();
  }, [navigate]);

  useEffect(() => {
    filterProducts(searchQuery, categoryFilter);
  }, [products]);

  const handleEditProduct = (product) => {
    setEditingProduct({...product});
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    
    const updatedProducts = products.map(p => 
      p.id === editingProduct.id ? {
        ...editingProduct,
        price: parseFloat(editingProduct.price),
        stock: parseInt(editingProduct.stock)
      } : p
    );
    
    setProducts(updatedProducts);
    await saveProductsToFirestore(updatedProducts);
    
    setOpenEditDialog(false);
    setEditingProduct(null);
    showSnackbar('Product updated successfully!', 'success');
  };

  const handleImageUpload = (event, isEdit = false) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditingProduct({...editingProduct, image: reader.result});
        } else {
          setNewProduct({...newProduct, image: reader.result});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category) {
      showSnackbar('Please fill all required fields', 'error');
      return;
    }

    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const productToAdd = {
      ...newProduct,
      id: newId,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      createdAt: new Date().toISOString()
    };
    
    const updatedProducts = [...products, productToAdd];
    setProducts(updatedProducts);
    await saveProductsToFirestore(updatedProducts);
    
    setNewProduct({ name: '', price: '', stock: '', category: '', description: '', image: null });
    setOpenAddDialog(false);
    showSnackbar('Product added successfully!', 'success');
  };

  const handleDeleteProduct = async (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    await saveProductsToFirestore(updatedProducts);
    showSnackbar('Product deleted successfully!', 'info');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAcceptOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'accepted' } : order
    ));
    showSnackbar('Order accepted successfully!', 'success');
  };

  const handleRejectOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'rejected' } : order
    ));
    showSnackbar('Order rejected successfully!', 'info');
  };

  const handleShipOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'shipped' } : order
    ));
    showSnackbar('Order marked as shipped!', 'success');
  };

  if (loading) {
    return (
      <ThemeProvider theme={shopkeeperTheme}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: shopkeeperTheme.palette.background.default
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <CircularProgress color="primary" size={80} />
          </motion.div>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading your shop data...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={shopkeeperTheme}>
      <Box sx={{ 
        p: { xs: 2, md: 4 }, 
        backgroundColor: shopkeeperTheme.palette.background.default,
        minHeight: '100vh'
      }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4,
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2
        }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h2" sx={{ 
              color: shopkeeperTheme.palette.primary.main, 
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              fontSize: { xs: '1.8rem', md: '2.5rem' }
            }}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <StoreIcon sx={{ fontSize: { xs: 30, md: 40 } }} />
              </motion.div>
              {shopData?.shopName || 'My Shop'}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Welcome back, {shopData?.ownerName || 'Shopkeeper'}!
            </Typography>
          </motion.div>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            width: { xs: '100%', md: 'auto' },
            justifyContent: { xs: 'space-between', md: 'flex-end' }
          }}>
            <Badge 
              badgeContent={orders.filter(o => o.status === 'pending').length} 
              color="error"
              component={motion.div}
              whileHover={{ scale: 1.05 }}
            >
              <Button
                variant="outlined"
                startIcon={<ReceiptIcon />}
                onClick={() => setActiveTab(1)}
                sx={{
                  borderColor: shopkeeperTheme.palette.primary.main,
                  color: shopkeeperTheme.palette.primary.main
                }}
              >
                Orders
              </Button>
            </Badge>
            <Button
              variant="contained"
              startIcon={<InventoryIcon />}
              onClick={() => setActiveTab(0)}
              sx={{
                backgroundColor: shopkeeperTheme.palette.primary.main,
                '&:hover': {
                  backgroundColor: shopkeeperTheme.palette.primary.dark
                }
              }}
            >
              Products
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              component={motion.div}
              whileHover={{ y: -5 }}
              sx={{ 
                backgroundColor: alpha(shopkeeperTheme.palette.primary.main, 0.1),
                height: '100%'
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ 
                    bgcolor: shopkeeperTheme.palette.primary.main,
                    width: 56, 
                    height: 56 
                  }}>
                    <InventoryIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="text.secondary">
                      Total Products
                    </Typography>
                    <Typography variant="h4">
                      {products.length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              component={motion.div}
              whileHover={{ y: -5 }}
              sx={{ 
                backgroundColor: alpha(shopkeeperTheme.palette.success.main, 0.1),
                height: '100%'
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ 
                    bgcolor: shopkeeperTheme.palette.success.main,
                    width: 56, 
                    height: 56 
                  }}>
                    <ReceiptIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="text.secondary">
                      Total Orders
                    </Typography>
                    <Typography variant="h4">
                      {orders.length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              component={motion.div}
              whileHover={{ y: -5 }}
              sx={{ 
                backgroundColor: alpha(shopkeeperTheme.palette.warning.main, 0.1),
                height: '100%'
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ 
                    bgcolor: shopkeeperTheme.palette.warning.main,
                    width: 56, 
                    height: 56 
                  }}>
                    <CartIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="text.secondary">
                      Pending Orders
                    </Typography>
                    <Typography variant="h4">
                      {orders.filter(o => o.status === 'pending').length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              component={motion.div}
              whileHover={{ y: -5 }}
              sx={{ 
                backgroundColor: alpha(shopkeeperTheme.palette.info.main, 0.1),
                height: '100%'
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ 
                    bgcolor: shopkeeperTheme.palette.info.main,
                    width: 56, 
                    height: 56 
                  }}>
                    <MoneyIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="text.secondary">
                      Low Stock Items
                    </Typography>
                    <Typography variant="h4">
                      {products.filter(p => p.stock < 10).length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            borderRadius: 4,
            backgroundColor: shopkeeperTheme.palette.background.paper
          }}
        >
          {activeTab === 0 ? (
            <Box>
              {/* Product Management Header */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3,
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2
              }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Product Inventory {saving && <CircularProgress size={20} sx={{ ml: 1 }} />}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenAddDialog(true)}
                  sx={{
                    backgroundColor: shopkeeperTheme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: shopkeeperTheme.palette.primary.dark
                    }
                  }}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Product
                </Button>
              </Box>

              {/* Search and Filter */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mb: 3,
                flexDirection: { xs: 'column', md: 'row' }
              }}>
                <TextField
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon color="primary" sx={{ mr: 1 }} />
                  }}
                  sx={{ flex: 1 }}
                />
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Filter by Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Filter by Category"
                    onChange={(e) => handleCategoryFilter(e.target.value)}
                    startAdornment={<FilterIcon color="primary" sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Products Table */}
              <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ 
                      backgroundColor: shopkeeperTheme.palette.primary.main,
                      '& th': { 
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '1rem'
                      }
                    }}>
                      <TableCell>Product</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Stock</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="h6" color="text.secondary">
                            {products.length === 0 ? 'No products added yet' : 'No products match your search'}
                          </Typography>
                          {products.length === 0 && (
                            <Button
                              variant="outlined"
                              startIcon={<AddIcon />}
                              onClick={() => setOpenAddDialog(true)}
                              sx={{ mt: 2 }}
                            >
                              Add Your First Product
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow 
                          key={product.id}
                          component={motion.tr}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          hover
                          sx={{ '&:last-child td': { border: 0 } }}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                              {product.image && (
                                <Avatar
                                  src={product.image}
                                  alt={product.name}
                                  sx={{ width: 40, height: 40 }}
                                />
                              )}
                              <Box>
                                <Typography fontWeight={500}>
                                  {product.name}
                                </Typography>
                                {product.description && (
                                  <Typography variant="caption" color="text.secondary">
                                    {product.description}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={product.category} 
                              size="small"
                              sx={{ 
                                backgroundColor: alpha(shopkeeperTheme.palette.primary.main, 0.1),
                                color: shopkeeperTheme.palette.primary.dark
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box display="flex" alignItems="center" justifyContent="flex-end">
                              <MoneyIcon color="success" sx={{ mr: 0.5, fontSize: 18 }} />
                              ₹{product.price.toFixed(2)}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Box display="flex" alignItems="center" justifyContent="flex-end">
                              <WarehouseIcon 
                                color={product.stock < 10 ? "error" : "info"} 
                                sx={{ mr: 0.5, fontSize: 18 }} 
                              />
                              <Typography 
                                color={product.stock < 10 ? "error" : "inherit"}
                                fontWeight={product.stock < 10 ? "bold" : "normal"}
                              >
                                {product.stock}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <IconButton 
                                onClick={() => handleEditProduct(product)} 
                                sx={{ 
                                  color: shopkeeperTheme.palette.primary.main,
                                  backgroundColor: alpha(shopkeeperTheme.palette.primary.main, 0.1),
                                  '&:hover': {
                                    backgroundColor: alpha(shopkeeperTheme.palette.primary.main, 0.2)
                                  }
                                }}
                                component={motion.button}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                onClick={() => handleDeleteProduct(product.id)} 
                                sx={{ 
                                  color: shopkeeperTheme.palette.error.main,
                                  backgroundColor: alpha(shopkeeperTheme.palette.error.main, 0.1),
                                  '&:hover': {
                                    backgroundColor: alpha(shopkeeperTheme.palette.error.main, 0.2)
                                  }
                                }}
                                component={motion.button}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Order Management
              </Typography>
              
              {/* Pending Orders Section */}
              {orders.some(o => o.status === 'pending') && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 500,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Chip 
                      label={orders.filter(o => o.status === 'pending').length} 
                      color="error" 
                      size="small"
                    />
                    Pending Approval
                  </Typography>
                  <Grid container spacing={3}>
                    {orders.filter(o => o.status === 'pending').map((order) => (
                      <Grid item xs={12} key={order.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.3 }}
                          layout
                        >
                          <Card
                            component={motion.div}
                            whileHover={{ scale: 1.01 }}
                            sx={{ 
                              borderLeft: `4px solid ${shopkeeperTheme.palette.warning.main}`,
                              position: 'relative'
                            }}
                          >
                            <CardContent>
                              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                  <Typography variant="h6" gutterBottom>
                                    Order #{order.id}
                                  </Typography>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Customer: {order.customer} • {order.date}
                                  </Typography>
                                </Box>
                                <Typography variant="h6" color="primary">
                                  ₹{order.total.toFixed(2)}
                                </Typography>
                              </Box>
                              
                              <List dense sx={{ py: 0 }}>
                                {order.items.map((item, index) => (
                                  <ListItem 
                                    key={index} 
                                    sx={{ py: 0.5, px: 0 }}
                                    component={motion.li}
                                    initial={{ x: -20 }}
                                    animate={{ x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                  >
                                    <ListItemText 
                                      primary={item} 
                                      primaryTypographyProps={{
                                        component: motion.div,
                                        whileHover: { x: 5 }
                                      }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
                              <Button
                                variant="contained"
                                startIcon={<CheckIcon />}
                                onClick={() => handleAcceptOrder(order.id)}
                                sx={{
                                  backgroundColor: shopkeeperTheme.palette.success.main,
                                  color: 'white',
                                  '&:hover': {
                                    backgroundColor: shopkeeperTheme.palette.success.dark
                                  }
                                }}
                                component={motion.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outlined"
                                startIcon={<CloseIcon />}
                                onClick={() => handleRejectOrder(order.id)}
                                sx={{
                                  borderColor: shopkeeperTheme.palette.error.main,
                                  color: shopkeeperTheme.palette.error.main,
                                  '&:hover': {
                                    backgroundColor: alpha(shopkeeperTheme.palette.error.main, 0.1)
                                  }
                                }}
                                component={motion.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Reject
                              </Button>
                            </CardActions>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Accepted Orders Section */}
              {orders.some(o => o.status === 'accepted') && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 500,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Chip 
                      label={orders.filter(o => o.status === 'accepted').length} 
                      color="success" 
                      size="small"
                    />
                    Ready for Shipping
                  </Typography>
                  <Grid container spacing={3}>
                    {orders.filter(o => o.status === 'accepted').map((order) => (
                      <Grid item xs={12} md={6} key={order.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          layout
                        >
                          <Card
                            component={motion.div}
                            whileHover={{ y: -5 }}
                            sx={{ 
                              height: '100%',
                              borderLeft: `4px solid ${shopkeeperTheme.palette.success.main}`
                            }}
                          >
                            <CardContent>
                              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                  <Typography variant="h6" gutterBottom>
                                    Order #{order.id}
                                  </Typography>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Customer: {order.customer} • {order.date}
                                  </Typography>
                                </Box>
                                <Typography variant="h6" color="primary">
                                  ₹{order.total.toFixed(2)}
                                </Typography>
                              </Box>
                              <List dense sx={{ py: 0 }}>
                                {order.items.map((item, index) => (
                                  <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                                    <ListItemText primary={item} />
                                  </ListItem>
                                ))}
                              </List>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
                              <Button
                                variant="outlined"
                                startIcon={<PhoneIcon />}
                                onClick={() => showSnackbar(`Contacting ${order.customer}...`, 'info')}
                                sx={{
                                  borderColor: shopkeeperTheme.palette.primary.main,
                                  color: shopkeeperTheme.palette.primary.main,
                                  '&:hover': {
                                    backgroundColor: alpha(shopkeeperTheme.palette.primary.main, 0.1)
                                  }
                                }}
                                component={motion.button}
                                whileHover={{ scale: 1.05 }}
                              >
                                Contact
                              </Button>
                              <Button
                                variant="contained"
                                startIcon={<ShippingIcon />}
                                onClick={() => handleShipOrder(order.id)}
                                sx={{
                                  backgroundColor: shopkeeperTheme.palette.info.main,
                                  color: 'white',
                                  '&:hover': {
                                    backgroundColor: shopkeeperTheme.palette.info.dark
                                  }
                                }}
                                component={motion.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Ship Order
                              </Button>
                            </CardActions>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Shipped Orders Section */}
              {orders.some(o => o.status === 'shipped') && (
                <Box>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 500,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Chip 
                      label={orders.filter(o => o.status === 'shipped').length} 
                      color="info" 
                      size="small"
                    />
                    Shipped Orders
                  </Typography>
                  <Grid container spacing={3}>
                    {orders.filter(o => o.status === 'shipped').map((order) => (
                      <Grid item xs={12} sm={6} md={4} key={order.id}>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Card sx={{ 
                            height: '100%',
                            borderLeft: `4px solid ${shopkeeperTheme.palette.info.main}`
                          }}>
                            <CardContent>
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" gutterBottom>
                                  Order #{order.id}
                                </Typography>
                                <Chip 
                                  label="SHIPPED" 
                                  color="info" 
                                  size="small"
                                  icon={<ShippingIcon fontSize="small" />}
                                />
                              </Box>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Customer: {order.customer}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                {order.items.length} item(s)
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Total: ₹{order.total.toFixed(2)}
                              </Typography>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* No Orders Message */}
              {orders.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <ReceiptIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    No orders yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Your orders will appear here once customers start placing them.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Paper>

        {/* Floating Action Button for Quick Add */}
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpenAddDialog(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            display: { xs: 'flex', md: 'none' }
          }}
          component={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AddIcon />
        </Fab>

        {/* Edit Product Dialog */}
        <Dialog 
          open={openEditDialog} 
          onClose={() => setOpenEditDialog(false)}
          fullWidth
          maxWidth="sm"
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <DialogTitle sx={{ 
            backgroundColor: shopkeeperTheme.palette.primary.main,
            color: 'white',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <EditIcon />
            Edit Product
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  fullWidth
                  label="Product Name"
                  value={editingProduct?.name || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  InputProps={{
                    startAdornment: (
                      <InventoryIcon color="primary" sx={{ mr: 1 }} />
                    )
                  }}
                />
              </Grid>
              
              {/* Image Upload for Edit */}
              <Grid item xs={12}>
                <Box 
                  sx={{
                    border: '1px dashed',
                    borderColor: shopkeeperTheme.palette.primary.main,
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: alpha(shopkeeperTheme.palette.primary.main, 0.05),
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: alpha(shopkeeperTheme.palette.primary.main, 0.1)
                    }
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    style={{ display: 'none' }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {editingProduct?.image ? (
                      <>
                        <img 
                          src={editingProduct.image} 
                          alt="Product Preview" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '150px',
                            borderRadius: '8px',
                            marginBottom: '8px'
                          }} 
                        />
                        <Typography variant="body2">
                          Click to change image
                        </Typography>
                      </>
                    ) : (
                      <>
                        <CloudUploadIcon 
                          color="primary" 
                          sx={{ fontSize: 40, mb: 1 }} 
                        />
                        <Typography variant="body1" color="primary">
                          Upload Product Image
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Drag & drop or click to browse
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={editingProduct?.description || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  multiline
                  rows={2}
                  placeholder="Brief description of the product..."
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price (₹)"
                  type="number"
                  value={editingProduct?.price || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                  InputProps={{
                    startAdornment: (
                      <MoneyIcon color="primary" sx={{ mr: 1 }} />
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock"
                  type="number"
                  value={editingProduct?.stock || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                  InputProps={{
                    startAdornment: (
                      <WarehouseIcon color="primary" sx={{ mr: 1 }} />
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="edit-category-select-label">Category</InputLabel>
                  <Select
                    labelId="edit-category-select-label"
                    value={editingProduct?.category || ''}
                    label="Category"
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    startAdornment={<CategoryIcon color="primary" sx={{ mr: 1 }} />}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setOpenEditDialog(false)}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit} 
              variant="contained"
              disabled={saving}
              sx={{
                backgroundColor: shopkeeperTheme.palette.primary.main,
                '&:hover': {
                  backgroundColor: shopkeeperTheme.palette.primary.dark
                }
              }}
            >
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Product Dialog */}
        <Dialog 
          open={openAddDialog} 
          onClose={() => {
            setOpenAddDialog(false);
            setNewProduct({ name: '', price: '', stock: '', category: '', description: '', image: null });
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ 
            backgroundColor: shopkeeperTheme.palette.primary.main,
            color: 'white',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <AddIcon />
            Add New Product
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  fullWidth
                  label="Product Name *"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  InputProps={{
                    startAdornment: (
                      <InventoryIcon color="primary" sx={{ mr: 1 }} />
                    )
                  }}
                  required
                />
              </Grid>
              
              {/* Image Upload Section */}
              <Grid item xs={12}>
                <Box 
                  sx={{
                    border: '1px dashed',
                    borderColor: shopkeeperTheme.palette.primary.main,
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: alpha(shopkeeperTheme.palette.primary.main, 0.05),
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: alpha(shopkeeperTheme.palette.primary.main, 0.1),
                      transform: 'translateY(-2px)'
                    }
                  }}
                  component={motion.label}
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {newProduct.image ? (
                      <>
                        <img 
                          src={newProduct.image} 
                          alt="Product Preview" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '150px',
                            borderRadius: '8px',
                            marginBottom: '8px'
                          }} 
                        />
                        <Typography variant="body2" color="primary">
                          Click to change image
                        </Typography>
                      </>
                    ) : (
                      <>
                        <CloudUploadIcon 
                          color="primary" 
                          sx={{ fontSize: 40, mb: 1 }} 
                        />
                        <Typography variant="body1" color="primary">
                          Upload Product Image
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Drag & drop or click to browse
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  multiline
                  rows={2}
                  placeholder="Brief description of the product..."
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price (₹) *"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  InputProps={{
                    startAdornment: (
                      <MoneyIcon color="primary" sx={{ mr: 1 }} />
                    )
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock *"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  InputProps={{
                    startAdornment: (
                      <WarehouseIcon color="primary" sx={{ mr: 1 }} />
                    )
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="category-select-label">Category *</InputLabel>
                  <Select
                    labelId="category-select-label"
                    value={newProduct.category}
                    label="Category *"
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    startAdornment={<CategoryIcon color="primary" sx={{ mr: 1 }} />}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => {
                setOpenAddDialog(false);
                setNewProduct({ name: '', price: '', stock: '', category: '', description: '', image: null });
              }}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddProduct} 
              variant="contained"
              disabled={saving}
              sx={{
                backgroundColor: shopkeeperTheme.palette.primary.main,
                '&:hover': {
                  backgroundColor: shopkeeperTheme.palette.primary.dark
                }
              }}
            >
              {saving ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Adding...
                </>
              ) : (
                'Add Product'
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar with enhanced animations */}
        <AnimatePresence>
          {snackbar.open && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.3 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Alert 
                  onClose={handleCloseSnackbar} 
                  severity={snackbar.severity}
                  sx={{ width: '100%' }}
                  component={motion.div}
                  whileHover={{ scale: 1.02 }}
                >
                  {snackbar.message}
                </Alert>
              </Snackbar>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </ThemeProvider>
  );
};

export default ShopkeeperManagement;