import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import CartTest from './components/CartTest';
import Profile from './components/Profile';
import Orders from './components/Orders';
import Wishlist from './components/Wishlist';
import Navbar from './components/Navbar';
import Compare from './components/Compare';
import Checkout from './components/Checkout';

function App() {
  return (
    <ToastProvider>
      <ErrorBoundary>
        <Router basename="/">
          <div className="App">
            <Navbar />
            <main role="main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/cart-test" element={<CartTest />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/checkout" element={<Checkout />} />
                {/* Catch-all route for debugging */}
                <Route path="*" element={<div>Page not found. Available routes: /, /login, /register, /products, /cart, /cart-test, /profile, /orders, /wishlist, /compare, /checkout</div>} />
              </Routes>
            </main>
          </div>
        </Router>
      </ErrorBoundary>
    </ToastProvider>
  );
}

export default App;