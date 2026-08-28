import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";
import AccountDetails from "./pages/AccountDetails";
import Dashboard from "./pages/Dashboard";
import FAQ from "./pages/FAQ";
import HappyCustomers from "./pages/HappyCustomers";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import ReferEarn from "./pages/ReferEarn";
import Register from "./pages/Register";
import AdminAccounts from "./pages/admin/AdminAccounts";
import AdminCustomerProofs from "./pages/admin/AdminCustomerProofs";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFaqs from "./pages/admin/AdminFaqs";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminSettings from "./pages/admin/AdminSettings";

const App = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<Home />} />
      <Route path="marketplace" element={<Marketplace />} />
      <Route path="marketplace/:game" element={<Marketplace />} />
      <Route path="account/:id" element={<AccountDetails />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="refer-earn" element={<ReferEarn />} />
      <Route path="happy-customers" element={<HappyCustomers />} />
      <Route path="faq" element={<FAQ />} />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="payment/:orderId"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="payment-success"
        element={
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Route>

    <Route path="admin/login" element={<AdminLogin />} />
    <Route
      path="admin"
      element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="accounts" element={<AdminAccounts />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="settings" element={<AdminSettings />} />
      <Route path="customer-proofs" element={<AdminCustomerProofs />} />
      <Route path="faqs" element={<AdminFaqs />} />
    </Route>
  </Routes>
);

export default App;
