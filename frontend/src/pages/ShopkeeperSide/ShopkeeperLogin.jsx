import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { 
  Box, Paper, Typography, TextField, Button, Grid, InputAdornment, IconButton, Divider, Alert 
} from '@mui/material';
import { Store, Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { motion } from 'framer-motion';
import shopkeeperTheme from '../../themes/shopkeeperTheme';

const ShopkeeperLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Firebase login logic here...
    console.log('Login form submitted:', formData);
    navigate('/shopkeeper/manage');
  };

  return (
    <ThemeProvider theme={shopkeeperTheme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, maxWidth: '500px', width: '100%' }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Store sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Shopkeeper Login</Typography>
              <Typography variant="body1" color="text.secondary">
                Access your GroSnap shop dashboard
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
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

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button fullWidth size="large" variant="contained" type="submit" sx={{ py: 1.5, borderRadius: 2 }}>
                      Login
                    </Button>
                  </motion.div>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" textAlign="center">
                    Don't have an account?{' '}
                    <Link to="/shopkeeper/register" style={{ color: shopkeeperTheme.palette.primary.main, fontWeight: 'bold' }}>
                      Register here
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

export default ShopkeeperLogin;
