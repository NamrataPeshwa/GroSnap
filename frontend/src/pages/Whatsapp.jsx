import React from 'react';
import { Button } from '@mui/material';

const WhatsAppButton = ({ orderDetails }) => {
  const handleWhatsAppNotification = () => {
    const phoneNumber = '919876543210'; // Shopkeeper's WhatsApp number (with country code)
    const message = `New Order Received!%0A%0A
      Order ID: ${orderDetails.id}%0A
      Customer: ${orderDetails.customerName}%0A
      Amount: ₹${orderDetails.total}%0A%0A
      Items:%0A${orderDetails.items.map(item => 
        - `${item.name} (Qty: ${item.quantity})`
      ).join('%0A')}`;

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <Button
      variant="contained"
      color="success"
      onClick={handleWhatsAppNotification}
      sx={{
        mt: 2,
        backgroundColor: '#25D366',
        '&:hover': { backgroundColor: '#128C7E' }
      }}
      startIcon={<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="24" />}
    >
      Notify Shopkeeper via WhatsApp
    </Button>
  );
};

export default WhatsAppButton;