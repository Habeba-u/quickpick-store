import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Categories from './pages/Categories';
import { SearchProvider } from './context/SearchContext';
import { CartProvider } from './context/CartContext';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUp';
import VerificationPage from './pages/VerificationPage';
import ErrorPage from './components/ErrorPage';
import WishlistPage from './pages/WishListPage';
import OffersPage from './pages/OffersPage';
import ProductPage from './components/ProductPage';
import CartPage from './pages/CartPage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MyOrdersPage from './pages/MyOrdersPage';
import ManageAddressPage from './pages/ManageAddressPage';
import PaymentMethodPage from './pages/PaymentMethodPage';
import ChangePassword from './pages/ChangePassword';
import MyAccountPage from './pages/MyAccountPage';
import Layout from './pages/Layout';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import TrackOrderPage from './pages/TrackOrderPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import { WishlistProvider } from './context/WishlistContext';
import { WalletProvider } from './context/WalletContext';
import { LanguageProvider } from './context/LanguageContext';
import CookiesPolicyPage from './pages/CookiesPolicyPage';
import MyWalletPage from './pages/MyWalletPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
// Admin Pages
import AdminLoginPage from './admin/pages/AdminLoginPage';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import AdminCategoriesPage from './admin/pages/AdminCategoriesPage';
import AdminCategoryCreatePage from './admin/pages/AdminCategoryCreatePage';
import AdminCategoryEditPage from './admin/pages/AdminCategoryEditPage';
import AdminProductsPage from './admin/components/AdminProductsPage';
import AdminProductCreatePage from './admin/components/AdminProductCreatePage';
import AdminProductEditPage from './admin/components/AdminProductEditPage';
import AdminUsersPage from './admin/components/AdminUsersPage';
import AdminOrdersPage from './admin/components/AdminOrdersPage';
import AdminOrderDetailPage from './admin/components/AdminOrderDetailPage';
import AdminUserCreatePage from './admin/components/AdminUserCreatePage';
import AdminUserEditPage from './admin/components/AdminUserEditPage';
import AdminUserViewPage from './admin/components/AdminUserViewPage';
import AdminPromotionsPage from './admin/components/AdminPromotionsPage';
import Settings from './admin/components/Settings';
import BannerSettings from './admin/components/BannerSettings';
import PromoSectionSettings from './admin/components/PromoSectionSettings';
import SearchSliderSettings from './admin/components/SearchSliderSettings';
import OffersPageSettings from './admin/components/OffersPageSettings';
import HowItWorksSectionSettings from './admin/components/HowItWorksSectionSettings';
import PromoBannerSectionSettings from './admin/components/PromoBannerSectionSettings';
import PolicyPagesSettings from './admin/components/PolicyPagesSettings';


// Protected Route Component for Admin
function ProtectedAdminRoute({ children }) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('ProtectedAdminRoute - user:', user); // Log the user object
    const isAdmin = user?.is_admin === true; // Explicitly check for true
    console.log('ProtectedAdminRoute - isAdmin:', isAdmin);
    return isAdmin ? children : <Navigate to="/admin/login" />;
}

function App() {
    return (
        <AuthProvider>
            <WishlistProvider>
                <SearchProvider>
                    <ThemeProvider>
                        <WalletProvider>
                            <CartProvider>
                                <LanguageProvider>
                                    <Routes>
                                        {/* Public Routes */}
                                        <Route element={<Layout />}>
                                            <Route path="/" element={<Home />} />
                                            <Route path="/quickpick-grocery" element={<Home />} />
                                            <Route path="/home" element={<Home />} />
                                            <Route path="/categories" element={<Categories />} />
                                            <Route path="/category/:id" element={<CategoryPage />} />
                                            <Route path="/offers" element={<OffersPage />} />
                                            <Route path="/wishlist" element={<WishlistPage />} />
                                            <Route path="/search" element={<SearchPage />} />
                                            <Route path="/product/:id" element={<ProductPage />} />
                                            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                                            <Route path="/cookies-policy" element={<CookiesPolicyPage />} />
                                            <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
                                            <Route path="/cart" element={<CartPage />} />
                                            <Route path="/track-order" element={<TrackOrderPage />} />
                                            <Route path="/checkout" element={<CheckoutPage />} />
                                            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                                            <Route path="/account/myaccount" element={<MyAccountPage />} />
                                            <Route path="/account/my-orders" element={<MyOrdersPage />} />
                                            <Route path="/account/my-wallet" element={<MyWalletPage />} />
                                            <Route path="/account/manage-address" element={<ManageAddressPage />} />
                                            <Route path="/account/payment-method" element={<PaymentMethodPage />} />
                                            <Route path="/account/change-password" element={<ChangePassword />} />
                                        </Route>
                                        <Route path="/login" element={<LoginPage />} />
                                        <Route path="/signup" element={<SignUpPage />} />
                                        <Route path="/verify" element={<VerificationPage />} />
                                        {/* Admin Routes */}
                                        <Route path="/admin/login" element={<AdminLoginPage />} />
                                        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboardPage /></ProtectedAdminRoute>} />
                                        <Route path="/admin/categories" element={<ProtectedAdminRoute><AdminCategoriesPage /></ProtectedAdminRoute>} />
                                        <Route path="/admin/categories/create" element={<ProtectedAdminRoute><AdminCategoryCreatePage /></ProtectedAdminRoute>} />
                                        <Route path="/admin/categories/edit/:id" element={<ProtectedAdminRoute><AdminCategoryEditPage /></ProtectedAdminRoute>} />
                                        <Route path="/admin/products" element={<AdminProductsPage />} />
                                        <Route path="/admin/products/create" element={<AdminProductCreatePage />} />
                                        <Route path="/admin/products/edit/:id" element={<AdminProductEditPage />} />
                                        <Route path="/admin/orders" element={<AdminOrdersPage />} />
                                        <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
                                        <Route path="/admin/users" element={<ProtectedAdminRoute><AdminUsersPage /></ProtectedAdminRoute>} />
                                        <Route path="/admin/users/create" element={<ProtectedAdminRoute><AdminUserCreatePage /></ProtectedAdminRoute>} />
                                        <Route path="/admin/users/:id" element={<ProtectedAdminRoute><AdminUserViewPage /></ProtectedAdminRoute>} />
                                        <Route path="/admin/users/edit/:id" element={<ProtectedAdminRoute><AdminUserEditPage /></ProtectedAdminRoute>} />
                                        <Route path="/admin/promotions" element={<AdminPromotionsPage />} />
                                        <Route path="/admin/reports" element={<ProtectedAdminRoute><div>Reports Page</div></ProtectedAdminRoute>} />
                                        <Route path="/admin/settings" element={<Settings />} />
                                        <Route path="/admin/settings/banner" element={<BannerSettings />} />
                                        <Route path="/admin/settings/promo_section" element={<PromoSectionSettings />} />
                                        <Route path="/admin/settings/search_slider" element={<SearchSliderSettings />} />
                                        <Route path="/admin/settings/offers_page" element={<OffersPageSettings />} />
                                        <Route path="/admin/settings/how_it_works_section" element={<HowItWorksSectionSettings />} />
                                        <Route path="/admin/settings/promo_banner_section" element={<PromoBannerSectionSettings />} />
                                        <Route path="/admin/settings/policy_pages" element={<PolicyPagesSettings />} />
                                        <Route path="*" element={<ErrorPage />} />
                                    </Routes>
                                </LanguageProvider>
                            </CartProvider>
                        </WalletProvider>
                    </ThemeProvider>
                </SearchProvider>
            </WishlistProvider>
        </AuthProvider>
    );
}

export default App;
