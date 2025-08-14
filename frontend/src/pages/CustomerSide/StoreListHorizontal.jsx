// StoreListHorizontal.js
import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const kmToMinutes = (km) => Math.round((km / 5) * 60);

const StoreListHorizontal = ({ stores }) => {
  if (!stores || stores.length === 0) return null;

  return (
    <Box sx={{
      overflowX: 'auto',
      display: 'flex',
      gap: 2,
      pb: 2,
      mt: 2
    }}>
      {stores.map(store => (
        <Card
          key={store.id}
          sx={{
            minWidth: 250,
            flex: '0 0 auto',
            boxShadow: 3,
            borderRadius: 2
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {store.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {store.type}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              🚶‍♂️ {kmToMinutes(store.distance)} min ({store.distance.toFixed(2)} km)
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default StoreListHorizontal;
