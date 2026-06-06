import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Shipping from './pages/Shipping';
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import Chat from './pages/Chat';

// Admin Pages
import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import ProductEdit from './pages/admin/ProductEdit';
import OrderList from './pages/admin/OrderList';
import OrderDetails from './pages/admin/OrderDetails';
import CouponList from './pages/admin/CouponList';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } />
                  <Route path="/wishlist" element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  } />
                  <Route path="/shipping" element={
                    <ProtectedRoute>
                      <Shipping />
                    </ProtectedRoute>
                  } />
                  <Route path="/payment" element={
                    <ProtectedRoute>
                      <Payment />
                    </ProtectedRoute>
                  } />
                  <Route path="/placeorder" element={
                    <ProtectedRoute>
                      <PlaceOrder />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } />
                  <Route path="/chat" element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  } />

                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={
                    <AdminRoute>
                      <Dashboard />
                    </AdminRoute>
                  } />
                  <Route path="/admin/products" element={
                    <AdminRoute>
                      <ProductList />
                    </AdminRoute>
                  } />
                  <Route path="/admin/product/:id/edit" element={
                    <AdminRoute>
                      <ProductEdit />
                    </AdminRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <AdminRoute>
                      <OrderList />
                    </AdminRoute>
                  } />
                  <Route path="/admin/order/:id" element={
                    <AdminRoute>
                      <OrderDetails />
                    </AdminRoute>
                  } />
                  <Route path="/admin/coupons" element={
                    <AdminRoute>
                      <CouponList />
                    </AdminRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
