import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box, Typography, Button, TextField, Card, CardContent,
  Chip, IconButton, Dialog, DialogContent, DialogTitle, DialogActions
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import customerTheme from '../../themes/customerTheme';
import { ShoppingCart, Search, Store, ListAlt, AccountCircle, ArrowBack, CloudUpload } from '@mui/icons-material';
import NearbyStores from './NearbyStores';
import OCRUpload from './ocr_upload';
import RecommendedStores from './RecommendedStores';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../../firebase';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('stores');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMapView, setShowMapView] = useState(false);
  const [showRecommendedStores, setShowRecommendedStores] = useState(false);
  const [showOCRUpload, setShowOCRUpload] = useState(false);
  const [showNotepadDialog, setShowNotepadDialog] = useState(false);
  const [notepadText, setNotepadText] = useState('');
  const [lists, setLists] = useState([]);
  const [registeredStores, setRegisteredStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const sampleOrders = [
    { id: 1, store: 'Grocery Mart', date: '2025-08-01', items: 5, amount: '$24.99', status: 'Delivered' },
    { id: 2, store: 'Fresh Foods', date: '2025-08-02', items: 3, amount: '$12.50', status: 'In Transit' },
    { id: 3, store: 'Veggie Ville', date: '2025-08-05', items: 7, amount: '$40.00', status: 'Processing' },
  ];

  useEffect(() => {
    const fetchRegisteredStores = async () => {
      setLoadingStores(true);
      setFetchError(null);
      try {
        const snap = await getDocs(collection(db, 'shopkeepers'));
        const stores = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRegisteredStores(stores);
      } catch (err) {
        console.error('Error fetching stores:', err);
        setFetchError('Failed to load registered stores');
      } finally {
        setLoadingStores(false);
      }
    };
    fetchRegisteredStores();
  }, []);

  const handleOpenNotepad = () => {
    setNotepadText('');
    setShowNotepadDialog(true);
  };

  const handleSaveNotepad = () => {
    const items = notepadText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const newList = {
      id: Date.now(),
      name: `Grocery List ${lists.length + 1}`,
      items,
      createdAt: new Date().toISOString()
    };

    setLists(prev => [...prev, newList]);
    setShowNotepadDialog(false);
    setNotepadText('');
  };

  const handleOCRSuccess = (text) => {
    const items = text.split('\n').map(l => l.trim()).filter(l => l);
    const newList = {
      id: Date.now(),
      name: `OCR List ${lists.length + 1}`,
      items,
      createdAt: new Date().toISOString()
    };
    setLists(prev => [...prev, newList]);
    setShowOCRUpload(false);
  };

  const handleTabChange = (tab) => {
    if (tab === 'recommended') {
      setShowRecommendedStores(true);
      setActiveTab(''); // Clear activeTab to hide other views
    } else {
      setShowRecommendedStores(false);
      setActiveTab(tab);
      setShowMapView(false);
    }
  };

  return (
    <ThemeProvider theme={customerTheme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Enhanced Header with Logo and Back Button */}
        <Box sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          p: 2,
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          boxShadow: 1
        }}>
          <Box sx={{ 
            maxWidth: '1200px', 
            mx: 'auto', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            {/* Logo and Back Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IconButton 
                  color="inherit" 
                  onClick={() => window.history.back()}
                  sx={{ mr: 1 }}
                >
                  <ArrowBack />
                </IconButton>
              </motion.div>
              
              <motion.div 
                whileHover={{ rotate: 5 }} 
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Replace with your actual logo */}
                <img 
                  src="/logo.png" 
                  alt="GroSnap Logo" 
                  style={{ height: '48px' }} 
                />
              </motion.div>
            </Box>

            {/* User Actions */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <IconButton color="inherit" aria-label="cart">
                  <ShoppingCart />
                </IconButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <IconButton color="inherit" aria-label="account">
                  <AccountCircle />
                </IconButton>
              </motion.div>
            </Box>
          </Box>
        </Box>

        {/* Search Bar */}
        <Box sx={{ p: 2, maxWidth: '1200px', mx: 'auto' }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <TextField
              fullWidth
              placeholder="Search for stores or products..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1 }} />,
                sx: { borderRadius: '12px', bgcolor: 'background.paper' }
              }}
            />
          </motion.div>
        </Box>

        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', maxWidth: '1200px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', px: 2 }}>
            {['stores', 'recommended', 'orders', 'lists'].map(tab => (
              <Button
                key={tab}
                onClick={() => handleTabChange(tab)}
                sx={{
                  color: (activeTab === tab || (tab === 'recommended' && showRecommendedStores)) 
                    ? 'primary.main' : 'text.secondary',
                  borderBottom: (activeTab === tab || (tab === 'recommended' && showRecommendedStores)) 
                    ? '2px solid' : 'none',
                  borderColor: 'primary.main',
                  borderRadius: 0,
                  textTransform: 'capitalize',
                  px: 2,
                  py: 1.5
                }}
              >
                {tab === 'stores' ? 'Nearby Stores' : 
                 tab === 'recommended' ? 'Stores We Recommend' :
                 tab === 'orders' ? 'My Orders' : 
                 'My Lists'}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: 2, maxWidth: '1200px', mx: 'auto' }}>
          {showRecommendedStores ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Box sx={{ mt: 3 }}>
                <RecommendedStores />
              </Box>
            </motion.div>
          ) : (
            <>
              {activeTab === 'stores' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Nearby Stores</Typography>
                  </Box>

                  {showMapView ? (
                    <Box sx={{ height: '500px', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
                      <NearbyStores />
                    </Box>
                  ) : (
                    <NearbyStores listOnly />
                  )}
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Recent Orders</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {sampleOrders.map(order => (
                      <motion.div key={order.id} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                        <Card>
                          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="h6" fontWeight="bold">{order.store}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {order.date} • {order.items} items
                              </Typography>
                            </Box>
                            <Box textAlign="right">
                              <Typography variant="h6" fontWeight="bold">{order.amount}</Typography>
                              <Chip
                                label={order.status}
                                size="small"
                                color={order.status === 'Delivered' ? 'success' : 'primary'}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              )}

              {activeTab === 'lists' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>My Lists</Typography>
                  {lists.length > 0 ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                      {lists.map(list => (
                        <Card key={list.id}>
                          <CardContent>
                            <Typography variant="h6" fontWeight="bold">{list.name}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Created: {new Date(list.createdAt).toLocaleDateString()}
                            </Typography>
                            <Box sx={{ maxHeight: '150px', overflow: 'auto', mb: 2 }}>
                              {list.items.length > 0 ? (
                                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                  {list.items.map((item, idx) => (
                                    <li key={idx}>
                                      <Typography variant="body2">{item}</Typography>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <Typography variant="body2" color="text.secondary">No items</Typography>
                              )}
                            </Box>
                            <Button variant="outlined" fullWidth>View Details</Button>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                      <ListAlt sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        You haven't created any lists yet
                      </Typography>
                      <Button variant="contained" startIcon={<ListAlt />} onClick={handleOpenNotepad} sx={{ mb: 2 }}>
                        Create New List
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={() => setShowOCRUpload(true)}
                        startIcon={<CloudUpload />}
                      >
                        Upload Handwritten List
                      </Button>
                    </Box>
                  )}
                </motion.div>
              )}
            </>
          )}
        </Box>

        {/* OCR Upload Dialog */}
        <Dialog 
          open={showOCRUpload} 
          onClose={() => setShowOCRUpload(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Upload Handwritten List</DialogTitle>
          <DialogContent>
            <OCRUpload onSuccess={handleOCRSuccess} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowOCRUpload(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Notepad Dialog */}
        <Dialog open={showNotepadDialog} onClose={() => setShowNotepadDialog(false)}>
          <DialogTitle>Create New Grocery List</DialogTitle>
          <DialogContent>
            <TextField
              multiline
              rows={10}
              fullWidth
              variant="outlined"
              placeholder="Enter your grocery items, one per line..."
              value={notepadText}
              onChange={(e) => setNotepadText(e.target.value)}
              sx={{ mt: 2, minWidth: '400px' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowNotepadDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveNotepad} variant="contained" color="primary">
              Save List
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default CustomerDashboard;