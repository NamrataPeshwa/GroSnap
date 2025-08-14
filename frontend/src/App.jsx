import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import LandingPage from "./pages/Landing";
import CustomerDashboard from "./pages/CustomerSide/CustomerDashboard";
import ShopkeeperDashboard from "./pages/ShopkeeperSide/ShopkeeperDashboard";
import CustomerSignup from "./pages/CustomerSide/Register";
import CustomerLogin from "./pages/CustomerSide/Login";
import ShopkeeperRegister from "./pages/ShopkeeperSide/ShopkeeperRegister";
import ShopkeeperLogin from "./pages/ShopkeeperSide/ShopkeeperLogin";
import ShopkeeperManagement from "./pages/ShopkeeperSide/ShopkeeperManagement";
import IntroGroSnap from "./pages/IntroGroSnap";
import GroceryCategories from "./pages/CustomerSide/Grocery";
import CustomerProfile from "./pages/CustomerSide/CustomerProfile";
import Cart from "./pages/CustomerSide/Cart";
import OCRUpload from "./pages/CustomerSide/ocr_upload";
import OrderPlaced from "./pages/CustomerSide/OrderPlaced";

function AppContent() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (showIntro) {
      // If intro has animation, keep it for a few seconds
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 3000); // adjust time as needed
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  if (showIntro) {
    return (
      <IntroGroSnap
        onFinish={() => {
          setShowIntro(false);
        }}
      />
    );
  }

  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Customer */}
      <Route path="/customer/dashboard" element={<CustomerDashboard />} />
      <Route path="/customer/signup" element={<CustomerSignup />} />
      <Route path="/customer/login" element={<CustomerLogin />} />
      <Route path="/customer/Grocery" element={<GroceryCategories />} />
      <Route path="/customer/profile" element={<CustomerProfile />} />
      <Route path="/customer/Cart" element={<Cart />} />
      <Route path="/customer/OrderPlaced" element={<OrderPlaced />} />

      {/* Shopkeeper */}
      <Route path="/shopkeeper" element={<ShopkeeperDashboard />} />
      <Route path="/shopkeeper/register" element={<ShopkeeperRegister />} />
      <Route path="/shopkeeper/login" element={<ShopkeeperLogin />} />
      <Route path="/shopkeeper/manage" element={<ShopkeeperManagement />} />
      
      
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
