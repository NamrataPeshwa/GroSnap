import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword } from "firebase/auth"; 
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from '../../../firebase.js';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  InputAdornment,
  IconButton,
  Divider,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import shopkeeperTheme from '../../themes/shopkeeperTheme';
import { 
  Store, 
  Visibility, 
  VisibilityOff, 
  Phone, 
  Email, 
  Person, 
  Home,
  Lock,
  ArrowBack
} from '@mui/icons-material';

const ShopkeeperRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    shopName: '',
    shopAddress: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'agreeTerms' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      setLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      console.log('Creating user in Firebase Auth...');
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;
      console.log('User created successfully:', user.uid);

      const shopData = {
        shopName: formData.shopName,
        ownerName: formData.name,
        ownerEmail: formData.email,
        phone: formData.phone,
        shopAddress: formData.shopAddress,
        createdAt: new Date(),
        status: 'active',
        categories: [],
        products: [],
        lastUpdated: new Date()
      };

      console.log('Preparing to save shop data:', shopData);
      const shopRef = doc(db, "shopkeepers", user.uid);
      console.log('Document reference created:', shopRef.path);

      await setDoc(shopRef, shopData);
      console.log('Shop data saved successfully');

      localStorage.setItem('shopkeeperRegistered', 'true');
      localStorage.setItem('shopkeeperId', user.uid);
      
      navigate('/shopkeeper/manage');

    } catch (error) {
      console.error("Full registration error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already in use. Please login instead.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'permission-denied':
          errorMessage = 'Database write permission denied. Contact support.';
          break;
        default:
          errorMessage = error.message || 'Registration failed. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={shopkeeperTheme}>
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} sx={{ 
            p: { xs: 2, sm: 4 }, 
            borderRadius: 4,
            maxWidth: '800px',
            width: '100%'
          }}>
            <Box sx={{ mb: 4, textAlign: 'center', position: 'relative' }}>
              <Button 
                startIcon={<ArrowBack />} 
                sx={{ position: 'absolute', left: 0, top: 0 }}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
              <Store sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Register Your Shop
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join our platform and grow your business
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Shop Name"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Store color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Shop Address"
                    name="shopAddress"
                    value={formData.shopAddress}
                    onChange={handleChange}
                    required
                    multiline
                    rows={3}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Home color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    helperText="Minimum 6 characters"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                    helperText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? "Passwords don't match" : ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        name="agreeTerms" 
                        checked={formData.agreeTerms} 
                        onChange={handleChange}
                        color="primary"
                        required
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the <Link to="/terms" style={{ color: shopkeeperTheme.palette.primary.main }}>Terms and Conditions</Link> and <Link to="/privacy" style={{ color: shopkeeperTheme.palette.primary.main }}>Privacy Policy</Link>
                      </Typography>
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      type="submit"
                      disabled={loading || !formData.agreeTerms}
                      sx={{ py: 1.5, borderRadius: 2 }}
                    >
                      {loading ? (
                        <>
                          <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                          Registering...
                        </>
                      ) : (
                        'Register My Shop'
                      )}
                    </Button>
                  </motion.div>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" textAlign="center">
                    Already have an account?{' '}
                    <Link 
                      to="/shopkeeper/login" 
                      style={{ 
                        color: shopkeeperTheme.palette.primary.main,
                        fontWeight: 'bold'
                      }}
                    >
                      Login here
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </motion.div>
      </Box>
    </ThemeProvider>
  );
};

export default ShopkeeperRegister;