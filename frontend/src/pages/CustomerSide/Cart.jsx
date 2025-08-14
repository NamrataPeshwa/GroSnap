import React from "react";
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Avatar,
  Button,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Paper,
  Container
} from "@mui/material";
import { 
  ShoppingCart, 
  ArrowBack,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  
  // Sample cart data - in a real app this would come from state management
  const [cartItems, setCartItems] = React.useState([
    { id: 1, name: "Organic Tomatoes", quantity: 2, price: 50, image: "/images/tomatoes.jpg" },
    { id: 2, name: "Pure Honey", quantity: 1, price: 200, image: "/images/honey.jpg" },
    { id: 3, name: "Whole Wheat Bread", quantity: 1, price: 45, image: "/images/bread.jpg" }
  ]);

  const theme = {
    primary: "#2E7D32",
    secondary: "#FF5722",
    background: "#F5F5F5"
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleIncreaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const handleDecreaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    ));
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    const orderDetails = {
      id: `ORD-${Date.now()}`,
      items: cartItems,
      total: calculateTotal(),
      customerName: "John Doe", // Replace with actual customer name
      date: new Date().toLocaleString()
    };

    // Send WhatsApp notifications
    sendWhatsAppNotifications(orderDetails);

    // Navigate to order confirmation
    navigate('/customer/OrderPlaced', { state: { orderDetails } });
  };

  const sendWhatsAppNotifications = (order) => {
    // Replace with actual phone numbers
    const customerPhone = "919876543210"; // Customer WhatsApp number
    const shopkeeperPhone = "919876543210"; // Shopkeeper WhatsApp number

    // Customer notification
    const customerMsg = `An order has been placed please check you dashboard!%0A%0AOrder ID: ${order.id}%0ADate: ${order.date}%0ATotal: ₹${order.total}%0A%0AContact the Customer when Order is ready!`;
    window.open(`https://wa.me/${customerPhone}?text=${customerMsg}`, '_blank');

    // Shopkeeper notification
    const shopkeeperMsg = `NEW ORDER!%0A%0AOrder ID: ${order.id}%0ACustomer: ${order.customerName}%0ADate: ${order.date}%0ATotal: ₹${order.total}%0A%0AItems:%0A${order.items.map(item => 
      `- ${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`
    ).join('%0A')}`;
    window.open(`https://wa.me/${shopkeeperPhone}?text=${shopkeeperMsg}`, '_blank');
  };

  return (
    <Box sx={{ backgroundColor: theme.background, minHeight: "100vh" }}>
      {/* Header with Back Button and Cart Title */}
      <AppBar position="static" sx={{ backgroundColor: theme.primary }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Shopping Cart
          </Typography>
          <Badge badgeContent={cartItems.length} color="secondary">
            <ShoppingCart />
          </Badge>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3 }}>
        {cartItems.length === 0 ? (
          <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Looks like you haven't added any items yet
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/customer')}
              sx={{ 
                backgroundColor: theme.primary,
                "&:hover": { backgroundColor: "#1B5E20" }
              }}
            >
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <>
            {/* Cart Items List */}
            <Paper elevation={3} sx={{ mb: 3 }}>
              <List>
                {cartItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          onClick={() => handleRemoveItem(item.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar 
                          alt={item.name} 
                          src={item.image} 
                          sx={{ width: 56, height: 56, mr: 2 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        secondary={`₹${item.price} per item`}
                        primaryTypographyProps={{ fontWeight: "medium" }}
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        ml: 2
                      }}>
                        <IconButton 
                          onClick={() => handleDecreaseQuantity(item.id)}
                          size="small"
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ px: 1 }}>{item.quantity}</Typography>
                        <IconButton 
                          onClick={() => handleIncreaseQuantity(item.id)}
                          size="small"
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography sx={{ 
                        fontWeight: 'bold', 
                        ml: 3,
                        minWidth: 80,
                        textAlign: 'right'
                      }}>
                        ₹{item.price * item.quantity}
                      </Typography>
                    </ListItem>
                    {index < cartItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>

            {/* Order Summary */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Order Summary
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mb: 1
              }}>
                <Typography>Subtotal:</Typography>
                <Typography>₹{calculateTotal()}</Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mb: 1
              }}>
                <Typography>Delivery Fee:</Typography>
                <Typography>₹40</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mb: 2
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Total:
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  ₹{calculateTotal() + 40}
                </Typography>
              </Box>
            </Paper>

            {/* Checkout Button */}
            <Button
              variant="contained"
              fullWidth
              onClick={handleCheckout}
              sx={{
                backgroundColor: theme.secondary,
                "&:hover": { backgroundColor: "#E64A19" },
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 'bold'
              }}
            >
              Proceed to Checkout (₹{calculateTotal() + 40})
            </Button>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Cart;