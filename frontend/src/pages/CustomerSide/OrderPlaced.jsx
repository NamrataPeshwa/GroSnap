import React from "react";
import { 
  Box, 
  Typography, 
  Button,
  Container,
  Paper,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip
} from "@mui/material";
import { 
  CheckCircle, 
  ShoppingCart, 
  Home,
  ArrowBack,
  Receipt,
  LocalShipping
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

export default function OrderPlaced() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const orderDetails = state?.orderDetails || {
    id: `ORD-${Date.now()}`,
    items: [
      { name: "Organic Tomatoes", quantity: 2, price: 50 },
      { name: "Pure Honey", quantity: 1, price: 200 }
    ],
    total: 300,
    date: new Date().toLocaleString(),
    status: "confirmed"
  };

  const calculateTotal = () => {
    return orderDetails.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  };

  const handleViewOrderDetails = () => {
    // In a real app, this would navigate to order details page
    alert(`Showing details for order ${orderDetails.id}`);
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header with Logo and Back Button */}
      <AppBar position="static" sx={{ backgroundColor: "#2E7D32", boxShadow: "none" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          
          <Box 
            component="img"
            src="/logo.png"
            alt="Company Logo" 
            sx={{ height: 40, mr: 2 }}
          />
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Order Confirmation
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <CheckCircle color="success" sx={{ fontSize: 80, mb: 2 }} />
          
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Order Placed Successfully!
          </Typography>
          
          <Typography variant="h5" color="text.secondary" paragraph>
            Thank you for shopping with us
          </Typography>
          
          <Chip 
            label={`Order ID: ${orderDetails.id}`} 
            color="primary" 
            icon={<Receipt />}
            sx={{ mb: 3, fontSize: '1rem', p: 1.5 }}
          />
          
          <Divider sx={{ my: 3 }} />
          
          {/* Order Summary */}
          <Box sx={{ 
            backgroundColor: '#f5f5f5', 
            p: 3, 
            borderRadius: 2,
            textAlign: 'left',
            mb: 3
          }}>
            <Typography variant="h6" paragraph sx={{ fontWeight: 'bold' }}>
              Order Summary
            </Typography>
            
            <List dense>
              {orderDetails.items?.map((item, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText 
                    primary={`${item.name} (Qty: ${item.quantity})`}
                    secondary={`₹${item.price} each`}
                  />
                  <Typography variant="body1">
                    ₹{item.price * item.quantity}
                  </Typography>
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1" paragraph>
                <strong>Subtotal:</strong>
              </Typography>
              <Typography variant="body1">
                <strong>₹{calculateTotal()}</strong>
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1" paragraph>
                <strong>Delivery Fee:</strong>
              </Typography>
              <Typography variant="body1">
                <strong>₹40</strong>
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" paragraph>
                <strong>Total Amount:</strong>
              </Typography>
              <Typography variant="h6">
                <strong>₹{calculateTotal() + 40}</strong>
              </Typography>
            </Box>
          </Box>
          
          {/* Delivery Information */}
          <Box sx={{ 
            backgroundColor: '#e8f5e9', 
            p: 3, 
            borderRadius: 2,
            textAlign: 'left',
            mb: 3
          }}>
            <Typography variant="h6" paragraph sx={{ fontWeight: 'bold' }}>
              <LocalShipping sx={{ verticalAlign: 'middle', mr: 1 }} />
              Delivery Information
            </Typography>
            <Typography variant="body2" paragraph>
              • Your order has been confirmed and is being processed
            </Typography>
            <Typography variant="body2" paragraph>
              • Expected delivery: Whenever you are ready
            </Typography>
            <Typography variant="body2">
              • You'll receive updates from the Shopkeeper
            </Typography>
          </Box>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={handleViewOrderDetails}
              sx={{ 
                px: 4,
                backgroundColor: "#FF5722",
                '&:hover': {
                  backgroundColor: "#E64A19"
                }
              }}
            >
              View Order Details
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Home />}
              onClick={() => navigate('/customer')}
              sx={{ 
                px: 4,
                borderColor: "#2E7D32",
                color: "#2E7D32",
                '&:hover': {
                  backgroundColor: "#e8f5e9"
                }
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}