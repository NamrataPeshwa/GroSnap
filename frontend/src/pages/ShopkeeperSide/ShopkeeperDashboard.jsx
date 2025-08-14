import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Button, Card, CardContent, Avatar, Badge, IconButton, List, ListItem, ListItemText, Divider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import shopkeeperTheme from '../../themes/shopkeeperTheme';
import { Store, Inventory, Receipt, Add, Notifications, AccountCircle } from '@mui/icons-material';

const ShopkeeperDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New order from Ramesh Kumar', time: '10 min ago', read: false },
    { id: 2, text: 'Payment received for order #1234', time: '2 hours ago', read: true },
    { id: 3, text: 'New review received', time: '1 day ago', read: true }
  ]);

  // Mock data
  const recentOrders = [
    {
      id: 1,
      customer: "Ramesh Kumar",
      items: 8,
      amount: "₹1,245",
      status: "Pending",
      time: "10 min ago"
    },
    {
      id: 2,
      customer: "Priya Sharma",
      items: 5,
      amount: "₹890",
      status: "Preparing",
      time: "45 min ago"
    },
    {
      id: 3,
      customer: "Amit Patel",
      items: 12,
      amount: "₹1,890",
      status: "Ready for Delivery",
      time: "2 hours ago"
    }
  ];

  const inventoryItems = [
    {
      id: 1,
      name: "Fortune Sunflower Oil",
      category: "Cooking Oil",
      price: "₹210",
      stock: 24,
      lowStock: false
    },
    {
      id: 2,
      name: "Aashirvaad Atta",
      category: "Flour",
      price: "₹290",
      stock: 12,
      lowStock: false
    },
    {
      id: 3,
      name: "Amul Butter",
      category: "Dairy",
      price: "₹50",
      stock: 3,
      lowStock: true
    }
  ];

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <ThemeProvider theme={shopkeeperTheme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Header */}
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', mx: 'auto' }}>
            <Typography variant="h6" fontWeight="bold">GroSnap Shopkeeper</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit">
                <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton color="inherit">
                <AccountCircle />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', maxWidth: '1200px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', px: 2 }}>
            <Button
              onClick={() => setActiveTab('dashboard')}
              sx={{
                color: activeTab === 'dashboard' ? 'primary.main' : 'text.secondary',
                borderBottom: activeTab === 'dashboard' ? '2px solid' : 'none',
                borderColor: 'primary.main',
                borderRadius: 0
              }}
            >
              Dashboard
            </Button>
            <Button
              onClick={() => setActiveTab('orders')}
              sx={{
                color: activeTab === 'orders' ? 'primary.main' : 'text.secondary',
                borderBottom: activeTab === 'orders' ? '2px solid' : 'none',
                borderColor: 'primary.main',
                borderRadius: 0
              }}
            >
              Orders
            </Button>
            <Button
              onClick={() => setActiveTab('inventory')}
              sx={{
                color: activeTab === 'inventory' ? 'primary.main' : 'text.secondary',
                borderBottom: activeTab === 'inventory' ? '2px solid' : 'none',
                borderColor: 'primary.main',
                borderRadius: 0
              }}
            >
              Inventory
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: 2, maxWidth: '1200px', mx: 'auto' }}>
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">Today's Orders</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>12</Typography>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">Revenue</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>₹8,450</Typography>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">Items Low in Stock</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>5</Typography>
                  </CardContent>
                </Card>
              </Box>

              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Recent Orders</Typography>
              <Card>
                <List>
                  {recentOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ListItem 
                        secondaryAction={
                          <Button 
                            variant="contained" 
                            size="small"
                            color={
                              order.status === 'Pending' ? 'primary' : 
                              order.status === 'Preparing' ? 'warning' : 
                              'success'
                            }
                          >
                            {order.status}
                          </Button>
                        }
                      >
                        <ListItemText
                          primary={order.customer}
                          secondary={`${order.items} items • ${order.amount}`}
                        />
                      </ListItem>
                      {index < recentOrders.length - 1 && <Divider />}
                    </motion.div>
                  ))}
                </List>
              </Card>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>All Orders</Typography>
              <Card>
                <List>
                  {[...recentOrders, ...recentOrders].map((order, index) => (
                    <motion.div
                      key={`${order.id}-${index}`}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ListItem 
                        secondaryAction={
                          <Button 
                            variant="contained" 
                            size="small"
                            color={
                              order.status === 'Pending' ? 'primary' : 
                              order.status === 'Preparing' ? 'warning' : 
                              'success'
                            }
                          >
                            {order.status}
                          </Button>
                        }
                      >
                        <ListItemText
                          primary={`Order #${1000 + index} - ${order.customer}`}
                          secondary={`${order.items} items • ${order.amount} • ${order.time}`}
                        />
                      </ListItem>
                      {index < recentOrders.length * 2 - 1 && <Divider />}
                    </motion.div>
                  ))}
                </List>
              </Card>
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Inventory</Typography>
                <Button variant="contained" startIcon={<Add />}>
                  Add Product
                </Button>
              </Box>
              <Card>
                <List>
                  {inventoryItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ListItem 
                        secondaryAction={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography 
                              color={item.lowStock ? 'error' : 'text.primary'}
                              sx={{ fontWeight: item.lowStock ? 'bold' : 'normal' }}
                            >
                              {item.stock} left
                            </Typography>
                            <Button variant="outlined" size="small">
                              Edit
                            </Button>
                          </Box>
                        }
                      >
                        <ListItemText
                          primary={item.name}
                          secondary={item.category}
                        />
                        <Typography variant="body1" sx={{ mr: 3, fontWeight: 'bold' }}>
                          {item.price}
                        </Typography>
                      </ListItem>
                      {index < inventoryItems.length - 1 && <Divider />}
                    </motion.div>
                  ))}
                </List>
              </Card>
            </motion.div>
          )}
        </Box>

        {/* Notifications Panel */}
        {activeTab === 'dashboard' && (
          <Box sx={{ 
            position: 'fixed', 
            top: 0, 
            right: 0, 
            width: { xs: '100%', sm: '350px' }, 
            height: '100vh', 
            bgcolor: 'background.paper', 
            boxShadow: 3,
            transform: 'translateX(100%)',
            transition: 'transform 0.3s',
            zIndex: 1200,
            // Add state to control visibility
          }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Notifications</Typography>
              <Button size="small">Mark all as read</Button>
            </Box>
            <List>
              {notifications.map((notification) => (
                <ListItem 
                  key={notification.id} 
                  sx={{ bgcolor: notification.read ? 'background.default' : 'action.selected' }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <ListItemText
                    primary={notification.text}
                    secondary={notification.time}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default ShopkeeperDashboard;