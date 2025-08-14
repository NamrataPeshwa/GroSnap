import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowBack, ShoppingCart, Person } from "@mui/icons-material";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  AppBar, 
  Toolbar, 
  IconButton,
  Divider,
  InputBase,
  Paper,
  Badge
} from "@mui/material";
import { 
  ShoppingBasket, 
  LocalGroceryStore, 
  Kitchen, 
  BreakfastDining, 
  Search,
  DeliveryDining
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const GroceryCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState("Fresh Vegetables");
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Customer theme colors
  const theme = {
    primary: "#2E7D32", // Green
    secondary: "#FF5722", // Orange
    background: "#F5F5F5",
    text: "#333333",
    lightText: "#757575",
  };

  // Sample data structure
  const categories = [
    {
      name: "Fresh Vegetables",
      icon: <LocalGroceryStore fontSize="large" />,
      products: ["Tomatoes", "Potatoes", "Onions", "Carrots", "Cucumbers"],
      offers: ["10% off on seasonal veggies", "Buy 2kg get 100g free"]
    },
    {
      name: "Fresh Fruits",
      icon: <LocalGroceryStore fontSize="large" />,
      products: ["Apples", "Bananas", "Oranges", "Grapes", "Mangoes"],
      offers: ["15% off on imported fruits", "Combo packs available"]
    },
    {
      name: "Dairy, Bread & Eggs",
      icon: <Kitchen fontSize="large" />,
      products: ["Milk", "Eggs", "Cheese", "Butter", "Bread"],
      offers: ["Buy 2 milk packets get 1 free", "Egg dozen at discounted price"]
    },
    {
      name: "Cereals & Breakfast",
      icon: <BreakfastDining fontSize="large" />,
      products: ["Corn Flakes", "Oats", "Muesli", "Granola", "Wheat Flakes"],
      offers: ["20% off on premium brands", "Healthy breakfast combo"]
    },
    {
      name: "Atta, Rice & Dal",
      icon: <Kitchen fontSize="large" />,
      products: ["Wheat Flour", "Basmati Rice", "Toor Dal", "Chana Dal", "Moong Dal"],
      offers: ["Buy 5kg get 500g free", "Combo discounts available"]
    },
    {
      name: "Oils and Ghee",
      icon: <Kitchen fontSize="large" />,
      products: ["Sunflower Oil", "Olive Oil", "Mustard Oil", "Cow Ghee", "Vegetable Ghee"],
      offers: ["10% off on 5L packs", "Premium oils at discount"]
    }
  ];

  const snackCategories = [
    { name: "Biscuits & Cookies", offer: "10% off on premium brands" },
    { name: "Chips & Crisps", offer: "Buy 2 get 1 free" },
    { name: "Soft Drinks", offer: "Combo offers available" },
    { name: "Juices", offer: "Fresh juices discount" },
    { name: "Chocolates", offer: "Valentine special offers" },
    { name: "Nuts & Dry Fruits", offer: "Buy in bulk and save" }
  ];

  const popularProducts = [
    { name: "Organic Honey", offer: "20% off this week" },
    { name: "Premium Coffee", offer: "Buy 2 get 10% off" },
    { name: "Green Tea", offer: "Antioxidant rich" },
    { name: "Protein Bars", offer: "High protein snack" }
  ];

  const handleAddToCart = (productName) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.name === productName);
      if (existingItem) {
        return prevItems.map(item =>
          item.name === productName 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevItems, { name: productName, quantity: 1 }];
    });
    navigate('/Customer/cart');
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Box sx={{ backgroundColor: theme.background, minHeight: "100vh" }}>
      {/* Grosnap Navbar */}
      <AppBar position="static" sx={{ backgroundColor: theme.primary }}>
        <Toolbar>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IconButton color="inherit" onClick={() => window.history.back()}>
              <ArrowBack />
            </IconButton>
          </motion.div>
          <motion.div whileHover={{ rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
            <img src="/logo.png" alt="GroSnap Logo" style={{ height: '48px', marginLeft: '8px' }} />
          </motion.div>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton color="inherit">
              <Person />
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate('/cart')}>
              <Badge badgeContent={getTotalItems()} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {/* Search Bar */}
        <Paper
          component="form"
          sx={{ 
            p: '2px 4px', 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            borderRadius: 2,
            boxShadow: 1
          }}
        >
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <Search />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search for products..."
            inputProps={{ 'aria-label': 'search products' }}
          />
        </Paper>

        {/* Delivery Info */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "flex-end", 
          mb: 2,
          alignItems: "center"
        }}>
          <DeliveryDining sx={{ mr: 1, color: theme.secondary }} />
          <Typography variant="subtitle1" color="text.secondary">
            Delivery in 28 MINS
          </Typography>
        </Box>

        {/* Categories Section */}
        <Typography variant="h5" sx={{ 
          mb: 2, 
          fontWeight: "bold", 
          color: theme.primary,
          borderBottom: `2px solid ${theme.secondary}`,
          pb: 1,
          width: "fit-content"
        }}>
          GROCERY & KITCHEN
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {categories.map((category) => (
            <Grid item xs={6} sm={4} md={3} key={category.name}>
              <Card
                onClick={() => setSelectedCategory(category.name)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: selectedCategory === category.name ? theme.primary : "white",
                  color: selectedCategory === category.name ? "white" : theme.text,
                  transition: "all 0.3s ease",
                  borderRadius: 2,
                  boxShadow: 1,
                  "&:hover": { 
                    backgroundColor: theme.primary,
                    color: "white",
                    transform: "translateY(-2px)",
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box sx={{ 
                    color: selectedCategory === category.name ? "white" : theme.primary,
                    mb: 1 
                  }}>
                    {category.icon}
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Products Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ 
            mb: 2, 
            fontWeight: "bold",
            color: theme.primary,
            display: "flex",
            alignItems: "center"
          }}>
            {selectedCategory}
            <Typography variant="body2" sx={{ 
              ml: 2, 
              color: theme.secondary,
              fontWeight: "medium"
            }}>
              {categories.find(cat => cat.name === selectedCategory)?.offers[0]}
            </Typography>
          </Typography>
          
          <Grid container spacing={2}>
            {categories
              .find((cat) => cat.name === selectedCategory)
              ?.products.map((product) => (
                <Grid item xs={6} sm={4} md={3} key={product}>
                  <Card sx={{ 
                    borderRadius: 2,
                    boxShadow: 1,
                    "&:hover": { 
                      boxShadow: 3,
                      transform: "translateY(-2px)"
                    },
                    transition: "all 0.3s ease"
                  }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="body1" sx={{ 
                        mb: 1, 
                        fontWeight: "bold",
                        color: theme.primary
                      }}>
                        {product}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        mb: 1, 
                        color: theme.secondary,
                        fontSize: "0.75rem"
                      }}>
                        {categories.find(cat => cat.name === selectedCategory)?.offers[1]}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ShoppingBasket />}
                        onClick={() => handleAddToCart(product)}
                        sx={{ 
                          mt: 1,
                          backgroundColor: theme.secondary,
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "#E64A19"
                          }
                        }}
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>

        {/* Additional Categories Section */}
        <Typography variant="h5" sx={{ 
          mt: 4, 
          mb: 2, 
          fontWeight: "bold", 
          color: theme.primary,
          borderBottom: `2px solid ${theme.secondary}`,
          pb: 1,
          width: "fit-content"
        }}>
          SNACKS & DRINKS
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {snackCategories.map((item) => (
            <Grid item xs={6} sm={4} md={3} key={item.name}>
              <Card sx={{
                borderRadius: 2,
                boxShadow: 1,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3
                },
                transition: "all 0.3s ease"
              }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="subtitle1" sx={{ 
                    color: theme.text,
                    fontWeight: "bold",
                    mb: 1
                  }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: theme.secondary,
                    fontSize: "0.75rem",
                    mb: 1
                  }}>
                    {item.offer}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ShoppingBasket />}
                    onClick={() => handleAddToCart(item.name)}
                    sx={{ 
                      backgroundColor: theme.secondary,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "#E64A19"
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 3 }} />

        {/* Popular Products Section */}
        <Typography variant="h5" sx={{ 
          mb: 2, 
          fontWeight: "bold", 
          color: theme.primary,
          borderBottom: `2px solid ${theme.secondary}`,
          pb: 1,
          width: "fit-content"
        }}>
          POPULAR PRODUCTS
        </Typography>
        <Grid container spacing={2}>
          {popularProducts.map((product) => (
            <Grid item xs={6} sm={3} key={product.name}>
              <Card sx={{
                borderRadius: 2,
                boxShadow: 1,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3
                },
                transition: "all 0.3s ease"
              }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: "bold",
                    color: theme.primary,
                    mb: 1
                  }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: theme.secondary,
                    mb: 1,
                    fontSize: "0.75rem"
                  }}>
                    {product.offer}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ShoppingBasket />}
                    onClick={() => handleAddToCart(product.name)}
                    sx={{ 
                      backgroundColor: theme.secondary,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "#E64A19"
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default GroceryCategories;