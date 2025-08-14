import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card,
  CardContent,
  Chip,
  Avatar,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Store, ArrowBack, LocationOn, LocalOffer, DirectionsWalk, ShoppingCart } from '@mui/icons-material';

const RecommendedStores = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Mock user location (in a real app, you'd get this from geolocation API)
  useEffect(() => {
    // This would normally come from browser geolocation
    setUserLocation({
      lat: 12.9716,
      lng: 77.5946
    });
  }, []);

  // Function to calculate distance (simplified for demo)
  const calculateDistance = (storeLocation) => {
    if (!userLocation || !storeLocation) return 'Distance not available';
    
    // This is a simplified calculation - in a real app you'd use proper geodistance
    const distance = Math.floor(Math.random() * 10) + 1; // Random distance for demo
    return `${distance} km away`;
  };

  const handleShopNow = (storeId) => {
    // Navigate to Grocery page with store ID
    navigate('/customer/Grocery', { state: { storeId } });
  };

  useEffect(() => {
    // 6 Dummy stores with distances
    const dummyStores = [
      {
        id: '1',
        name: 'Swarnagiri Stores',
        address: 'Gokulam Main Road, Gokulam',
        discount: '15% off first order',
        location: { lat: 12.9716, lng: 77.5946 } // Same as user for demo
      },
      {
        id: '2',
        name: 'Bhairaveshwara Stores',
        address: 'Near Marimallappa School,4th Stage, Vijay Nagar',
        discount: 'Free delivery',
        location: { lat: 12.9816, lng: 77.6046 } // Nearby
      },
      {
        id: '3',
        name: 'Aaradhya Grocery Stores',
        address: '23/A, New Sayyaji Rao Road, Chamraj Mohalla',
        discount: '10% off bulk orders',
        location: { lat: 12.9616, lng: 77.5846 } // Nearby
      },
      {
        id: '4',
        name: 'Aramane Stores',
        address: 'Temple Road, Vani Vilas Mohalla',
        discount: 'Buy 1L Oil Get 1Kg Rava Free',
        location: { lat: 12.9516, lng: 77.5746 } // Farther
      },
      {
        id: '5',
        name: 'Kamalamma Stores',
        address: '#87/A Devaraj Urs Rd',
        discount: '20% off premium items',
        location: { lat: 12.9916, lng: 77.6146 } // Farther
      },
      {
        id: '6',
        name: 'Akshya Grocery Centre',
        address: '7th Main, 3rd Stage, Gokulam',
        discount: 'Senior discount available',
        location: { lat: 12.9416, lng: 77.5646 } // Farthest
      }
    ];
    
    setStores(dummyStores);
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Stores We Recommend
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: '1fr 1fr', 
            md: '1fr 1fr 1fr' 
          }, 
          gap: 3 
        }}>
          {stores.map(store => (
            <Card 
              key={store.id}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      width: 56, 
                      height: 56,
                      mr: 2
                    }}
                  >
                    <Store />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {store.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <DirectionsWalk sx={{ color: 'text.secondary', fontSize: 18, mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {calculateDistance(store.location)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                  <Typography variant="body2" color="text.secondary">
                    {store.address}
                  </Typography>
                </Box>

                {store.discount && (
                  <Chip
                    icon={<LocalOffer fontSize="small" />}
                    label={store.discount}
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </CardContent>

              {/* Shop Now Button */}
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  onClick={() => handleShopNow(store.id)}
                  sx={{
                    backgroundColor: '#2E7D32', // Green color
                    '&:hover': {
                      backgroundColor: '#1B5E20' // Darker green on hover
                    }
                  }}
                >
                  Shop Now
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default RecommendedStores;