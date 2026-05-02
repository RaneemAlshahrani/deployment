// src/App.jsx - Make sure ProtectedRoute is used correctly
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Customize from "./pages/Customize";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import AdminDashboard from "./pages/AdminDashboard";
import ProductManagement from "./pages/ProductManagement";
import InventoryManagement from "./pages/InventoryManagement";
import ReviewManagement from "./pages/ReviewManagement";
import OrderManagement from "./pages/OrderManagement";
import PromotionsManagement from "./pages/PromotionsManagement";
import TicketManagement from "./pages/TicketManagement";
import FAQTemplates from "./pages/FAQTemplates";



function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  }
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        
        {/* Customer Routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        } />
        <Route path="/customize" element={
          <ProtectedRoute>
            <Customize />
          </ProtectedRoute>
        } />
        <Route path="/contact" element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        } />
        <Route path="/product-details/:id" element={
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/order-history" element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ProductManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/inventory" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <InventoryManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/reviews" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ReviewManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <OrderManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/promotions" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <PromotionsManagement />
          </ProtectedRoute>
        } />
        
        {/* Customer Service Routes */}
        <Route path="/customer-service/tickets" element={
          <ProtectedRoute allowedRoles={["customer-service", "admin"]}>
            <TicketManagement />
          </ProtectedRoute>
        } />
        <Route path="/customer-service/faqs" element={
          <ProtectedRoute allowedRoles={["customer-service", "admin"]}>
            <FAQTemplates />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;