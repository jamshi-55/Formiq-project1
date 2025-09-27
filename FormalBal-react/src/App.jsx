import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'; // ⬅️ Added useLocation
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddBar from './components/AddBar';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import User from './pages/User';
import About from './pages/About';
import Bag from './pages/Bag';
import Men from './pages/Men';
import Women from './pages/Women';
import Wishlist from './pages/Wishlist';
import ProductDetails from './pages/Productdetails';
import Order from './pages/Order';
import Payment from './pages/Payment';
import AdressChange from "./pages/AdressChange";
import OrderTrack from './pages/OrderTrack';
import AdminDashboard from './Adminpanel/AdminDashboard';
import AdminOrders from './adminpanel/AdminOrders';
import AdminProducts from './Adminpanel/AdminProducts';
import AdminUsers from './adminpanel/AdminUsers';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const user = JSON.parse(localStorage.getItem("user") || null);
  const location = useLocation(); 
  //const fromAdmin = location
  const hideLayout = location.pathname === '/user';
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!hideLayout && <AddBar />} 
      {!hideLayout && <NavBar />} 

      <main className="flex-grow">
        <Routes>
          <Route path="/user" element={<User />} />
          <Route
            path="/"
            element={
              user && user.email ? (
                <Home />
              ) : (
                <Navigate to="/user" replace />
              )
            }
          />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/bag" element={<Bag />} />
          <Route path="/about" element={<About />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/productdetails/:id" element={<ProductDetails />} />
          <Route path="/order/:id" element={<Order />} />
          <Route path="/order" element={<Order />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/adresschange" element={<AdressChange/>}/>
          <Route path="/ordertrack" element={<OrderTrack />} />

          {/* admin area */}
          <Route path="/admindashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/adminorders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
          <Route path="/adminproducts" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
          <Route path="/adminusers" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
        </Routes>
      </main>

      {!hideLayout && <Footer />} 

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="bg-white shadow-md border border-gray-200"
        bodyClassName="text-gray-800 text-sm"
        progressClassName="bg-teal-600"
      />
    </div>
  );
}

export default App;
