import React, { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button, Typography, Box } from '@mui/material';
import { useTheme } from '@emotion/react';

// Theme configuration for landing page
const landingTheme = createTheme({
  palette: {
    primary: {
      main: '#e11d48', // rose-600
    },
    secondary: {
      main: '#f59e0b', // amber-500
    },
    background: {
      default: '#fff7ed', // amber-50
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
    },
  },
});

const LandingSection = () => {
  const [activeTab, setActiveTab] = useState('customer');
  const controls = useAnimation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const handleNavigation = (role) => {
    if (role === 'customer') {
      navigate('/customer/signup');
    } else {
      navigate('/shopkeeper/register');
    }
  };

  return (
    <ThemeProvider theme={landingTheme}>
      <section className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 flex flex-col items-center px-4 py-10 overflow-hidden relative">
        {/* Floating background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div 
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-rose-100/30 blur-3xl"
          ></motion.div>
          <motion.div 
            animate={{
              x: [0, -40, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-amber-100/30 blur-3xl"
          ></motion.div>
        </div>

        {/* Navigation Bar with Logo */}
        <motion.nav 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl flex justify-between items-center bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm z-10 mb-12"
        >
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* GroSnap Logo - Replace with your actual logo file */}
              <img 
                src="/logo.png" 
                alt="GroSnap " 
                className="h-20" 
              />
              {/* Alternative if you have a local file:
              <img 
                src="/images/grosnap-logo.png" 
                alt="GroSnap Logo" 
                className="h-10" 
              /> */}
            </motion.div>
          </div>
          <div className="flex gap-4 sm:gap-6 text-sm sm:text-base font-medium">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 rounded-lg hover:bg-rose-100/50 text-rose-600 transition-all duration-200 font-semibold"
            >
              <Link to="/customer/signup">Customer Sign Up</Link>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(244, 63, 94, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:shadow-lg transition-all duration-200 font-semibold"
            >
              <Link to="/shopkeeper/login">Shopkeeper Sign Up</Link>
            </motion.div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="text-center mt-8 max-w-4xl px-4 relative z-10"
        >
          <motion.div variants={itemVariants} className="mb-2">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-rose-600 uppercase rounded-full bg-rose-100">
              Revolutionizing Grocery Shopping
            </span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight">
            Fresh Groceries, <br className="hidden sm:block" />
            <span className="relative inline-block">
              <span className="relative z-10">Delivered with Care</span>
              <svg className="absolute bottom-0 left-0 w-full h-3 -z-10 text-amber-300" viewBox="0 0 200 20">
                <path 
                  d="M0,10 C50,5 100,15 200,10" 
                  stroke="currentColor" 
                  fill="none" 
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg sm:text-xl text-gray-600 mt-6 max-w-2xl mx-auto">
            Experience the future of grocery shopping with direct connections between customers and local shops. Quality, convenience, and community - all in one place.
          </motion.p>
          
          <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(244, 63, 94, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-full hover:shadow-md transition-all font-medium text-sm sm:text-base"
              onClick={() => handleNavigation('customer')}
            >
              I'm a Customer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(245, 158, 11, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-amber-600 border border-amber-200 rounded-full hover:bg-amber-50 transition-all font-medium text-sm sm:text-base"
              onClick={() => handleNavigation('shopkeeper')}
            >
              I'm a Shopkeeper
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Animated Features Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-24 w-full max-w-6xl mx-auto px-6 py-12 relative z-10"
        >
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
            >
              Why Choose GroSnap?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              We bridge the gap between local shops and customers with innovative features
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-6 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-8 h-8 ${index % 2 === 0 ? 'text-rose-500' : 'text-amber-500'}`}>
                    <path fillRule="evenodd" d={feature.icon} clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-24 w-full max-w-6xl mx-auto px-6 py-12 bg-white rounded-3xl shadow-sm relative z-10"
        >
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
            >
              How GroSnap Works
            </motion.h2>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    viewport={{ once: true }}
                    className="flex gap-4"
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${index % 2 === 0 ? 'bg-rose-500' : 'bg-amber-500'}`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-rose-400/20 to-amber-400/20 rounded-2xl blur-lg opacity-75"></div>
                <div className="relative bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl overflow-hidden border border-rose-100">
                  <img 
                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                    alt="GroSnap app interface" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-24 w-full max-w-4xl mx-auto px-8 py-12 bg-gradient-to-r from-rose-500 to-amber-500 rounded-2xl shadow-lg text-center relative overflow-hidden z-10"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to transform your grocery experience?</h3>
            <p className="text-rose-100 mb-8 max-w-2xl mx-auto">Join thousands of happy customers and shop owners who are already enjoying the benefits of GroSnap.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-rose-600 rounded-full hover:bg-gray-50 transition-all font-semibold"
                onClick={() => handleNavigation('customer')}
              >
                Get Started as Customer
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full hover:bg-white/10 transition-all font-semibold"
                onClick={() => handleNavigation('shopkeeper')}
              >
                Register Your Shop
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-24 w-full max-w-6xl mx-auto px-6 py-8 text-center text-sm text-gray-600 z-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img 
                src="/logo.png" 
                alt="GroSnap Logo" 
                className="h-12" 
              />
            </div>
            <div className="flex gap-6 mb-4 md:mb-0">
              <a href="#" className="hover:text-rose-600 transition-colors">About</a>
              <a href="#" className="hover:text-rose-600 transition-colors">Features</a>
              <a href="#" className="hover:text-rose-600 transition-colors">Contact</a>
              <a href="#" className="hover:text-rose-600 transition-colors">Privacy</a>
            </div>
            <div className="flex justify-center gap-4">
              {socialLinks.map((social) => (
                <motion.a 
                  key={social.name}
                  whileHover={{ y: -3 }}
                  href={social.url} 
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-rose-100 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p>© {new Date().getFullYear()} GroSnap. All rights reserved.</p>
          </div>
        </motion.footer>
      </section>
    </ThemeProvider>
  );
};

// Data for features
const features = [
  {
    title: "Handwritten List Recognition",
    description: "Upload your handwritten grocery list and we'll match it with products from local stores.",
    icon: "M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0121 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 017.5 16.125V3.375z"
  },
  {
    title: "Direct Shop Connection",
    description: "Communicate directly with shopkeepers for special requests or custom orders.",
    icon: "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-5.342M12 20.904a48.627 48.627 0 01-8.232-4.41m8.232-4.41a48.627 48.627 0 018.232 4.41m-16.464 0a50.565 50.565 0 012.658-.813A59.903 59.903 0 0112 3.493c2.82 0 5.523.38 8.04 1.085m-16.464 0A50.697 50.697 0 0112 13.49"
  },
  {
    title: "Flexible Payment Options",
    description: "Pay online or in cash when you receive your order, as you prefer.",
    icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  }
];

// Data for steps
const steps = [
  {
    title: "Sign Up",
    description: "Create an account as a customer or register your shop in minutes."
  },
  {
    title: "Browse or List",
    description: "Customers can browse nearby stores, shopkeepers can list their products."
  },
  {
    title: "Place or Receive Orders",
    description: "Customers place orders, shopkeepers receive instant notifications."
  },
  {
    title: "Deliver or Pick Up",
    description: "Get your groceries delivered or pick them up at your convenience."
  }
];



// Data for social links
const socialLinks = [
  {
    name: "Facebook",
    url: "https://facebook.com",
    icon: "M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"
  },
  {
    name: "Instagram",
    url: "https://instagram.com",
    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
  },
  {
    name: "Twitter",
    url: "https://twitter.com",
    icon: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
  }
];

export default LandingSection;