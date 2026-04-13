import React from "react";
import { Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "../pages/user/layout/MainLayout";

// User Pages
import Home from "../pages/user/Home";
import About from "../pages/user/AboutPage";
import QuizPage from "../pages/user/QuizPage";
import Recommendations from "../pages/user/Recommendations";
import CartPage from "../pages/user/CartPage";
import ProductsPage from "../pages/user/ProductPage";
import ContactSection from "../pages/user/ContactPage";
import TrackOrder from "../pages/user/TrackOrder";


// Auth Pages
import UserRegister from "../pages/user/UserRegister";
import UserLogin from "../pages/user/UserLogin";

// Admin
import AdminApp from "../pages/admin/AdminApp";

// Not Found
import NotFound from "../pages/user/NotFound";
import PrivacyPolicy from "../pages/user/PrivacyPolicy";
import TermsOfService from "../pages/user/TermsOfServices";
import ReturnExchangePage from "../pages/user/ReturnExchange";
import PerfumeDetailPage from "../pages/user/PerfumeDetailPage";


const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= MAIN LAYOUT ROUTES ================= */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<PerfumeDetailPage />} />
        <Route path="/contact" element={<ContactSection />} />
        <Route path="/track-order" element={<TrackOrder />} /> {/* New route for order tracking */}
        <Route path="/returns" element={<ReturnExchangePage />} /> {/* Reusing TrackOrder component for returns */}
        <Route path="/privacy" element={<PrivacyPolicy />} /> {/* New route for privacy policy */}
        <Route path="/terms" element={<TermsOfService />} /> {/* Reusing PrivacyPolicy component for terms */}
      </Route>

      {/* QUIZ ROUTE */}
      <Route path="/quiz" element={<QuizPage />} />

      {/* ================= AUTH ROUTES (NO NAVBAR/FOOTER) ================= */}
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user/login" element={<UserLogin />} />

      {/* ================= ADMIN ROUTES (NO NAVBAR/FOOTER) ================= */}
      <Route path="/admin/*" element={<AdminApp />} />

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;

