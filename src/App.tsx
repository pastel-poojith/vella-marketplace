import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Storefront Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Account Pages
import { ProfilePage } from './pages/account/ProfilePage';
import { OrdersPage } from './pages/account/OrdersPage';
import { OrderDetailPage } from './pages/account/OrderDetailPage';
import { WishlistPage } from './pages/account/WishlistPage';
import { AddressesPage } from './pages/account/AddressesPage';
import { ClaimsPage } from './pages/account/ClaimsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminReturnsPage } from './pages/admin/AdminReturnsPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminSuppliersPage } from './pages/admin/AdminSuppliersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Static Pages
import { AboutPage } from './pages/static/AboutPage';
import { ContactPage } from './pages/static/ContactPage';
import { ShippingPolicyPage } from './pages/static/ShippingPolicyPage';
import { ReturnsPage } from './pages/static/ReturnsPage';
import { ReturnsPolicyPage } from './pages/static/ReturnsPolicyPage';
import { PrivacyPage } from './pages/static/PrivacyPage';
import { TermsPage } from './pages/static/TermsPage';
import { FaqPage } from './pages/static/FaqPage';
import { TrackOrderPage } from './pages/static/TrackOrderPage';
import { NotFoundPage } from './pages/static/NotFoundPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Storefront with Global Layout */}
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/shop"
        element={
          <Layout>
            <ShopPage />
          </Layout>
        }
      />
      <Route
        path="/product/:slug"
        element={
          <Layout>
            <ProductPage />
          </Layout>
        }
      />
      <Route
        path="/cart"
        element={
          <Layout>
            <CartPage />
          </Layout>
        }
      />
      <Route
        path="/checkout"
        element={
          <Layout>
            <CheckoutPage />
          </Layout>
        }
      />
      <Route
        path="/order-confirmation/:orderNumber"
        element={
          <Layout>
            <OrderConfirmationPage />
          </Layout>
        }
      />

      {/* Auth */}
      <Route
        path="/login"
        element={
          <Layout>
            <LoginPage />
          </Layout>
        }
      />
      <Route
        path="/signup"
        element={
          <Layout>
            <SignupPage />
          </Layout>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <Layout>
            <ForgotPasswordPage />
          </Layout>
        }
      />

      {/* Customer Account */}
      <Route
        path="/account"
        element={
          <Layout>
            <ProfilePage />
          </Layout>
        }
      />
      <Route
        path="/account/orders"
        element={
          <Layout>
            <OrdersPage />
          </Layout>
        }
      />
      <Route
        path="/account/orders/:id"
        element={
          <Layout>
            <OrderDetailPage />
          </Layout>
        }
      />
      <Route
        path="/account/wishlist"
        element={
          <Layout>
            <WishlistPage />
          </Layout>
        }
      />
      <Route
        path="/account/addresses"
        element={
          <Layout>
            <AddressesPage />
          </Layout>
        }
      />
      <Route
        path="/claims"
        element={
          <Layout>
            <ClaimsPage />
          </Layout>
        }
      />
      <Route
        path="/account/claims"
        element={
          <Layout>
            <ClaimsPage />
          </Layout>
        }
      />

      {/* Admin Dashboard */}
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/products" element={<AdminProductsPage />} />
      <Route path="/admin/categories" element={<AdminCategoriesPage />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />
      <Route path="/admin/returns" element={<AdminReturnsPage />} />
      <Route path="/admin/customers" element={<AdminCustomersPage />} />
      <Route path="/admin/suppliers" element={<AdminSuppliersPage />} />
      <Route path="/admin/settings" element={<AdminSettingsPage />} />

      {/* Static / Policy Pages */}
      <Route
        path="/about"
        element={
          <Layout>
            <AboutPage />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <ContactPage />
          </Layout>
        }
      />
      <Route
        path="/shipping"
        element={
          <Layout>
            <ShippingPolicyPage />
          </Layout>
        }
      />
      <Route
        path="/returns"
        element={
          <Layout>
            <ReturnsPage />
          </Layout>
        }
      />
      <Route
        path="/returns-policy"
        element={
          <Layout>
            <ReturnsPolicyPage />
          </Layout>
        }
      />
      <Route
        path="/privacy"
        element={
          <Layout>
            <PrivacyPage />
          </Layout>
        }
      />
      <Route
        path="/terms"
        element={
          <Layout>
            <TermsPage />
          </Layout>
        }
      />
      <Route
        path="/faq"
        element={
          <Layout>
            <FaqPage />
          </Layout>
        }
      />
      <Route
        path="/track-order"
        element={
          <Layout>
            <TrackOrderPage />
          </Layout>
        }
      />

      {/* 404 Catch All */}
      <Route
        path="*"
        element={
          <Layout>
            <NotFoundPage />
          </Layout>
        }
      />
    </Routes>
  );
};

export default App;
