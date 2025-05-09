import React, { useContext } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext'; // Use the theme context
import '../styles/Navbar.css';
import '../styles/Main.css';
import { useLocation } from 'react-router-dom';

function CustomNavbar() {
  const { user, logout } = useContext(AuthContext);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { theme, toggleTheme } = useTheme(); // Access theme and toggleTheme from context
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const translations = {
    en: {
      promo: 'Get 5% Off your first order, Promo:ORDER5',
      location: '1234 Market Street, Countryland',
      changeLocation: 'Change Location',
      home: 'Home',
      browseProducts: 'Browse products',
      specialOffers: 'Special Offers',
      categories: 'Categories',
      trackOrder: 'Track Order',
      wishlist: 'Wishlist',
      loginSignup: 'Login/Signup',
      logout: 'Logout',
      toggleLanguage: language === 'en' ? 'العربية' : 'English',
    },
    ar: {
      promo: 'احصل على خصم 5% على طلبك الأول، كود الخصم: ORDER5',
      location: '1234 شارع السوق، بلد الريف',
      changeLocation: 'تغيير الموقع',
      home: 'الرئيسية',
      browseProducts: 'تصفح المنتجات',
      specialOffers: 'العروض الخاصة',
      categories: 'الفئات',
      trackOrder: 'تتبع الطلب',
      wishlist: 'قائمة الأمنيات',
      loginSignup: 'تسجيل الدخول / التسجيل',
      logout: 'تسجيل الخروج',
      toggleLanguage: language === 'en' ? 'العربية' : 'English',
    },
  };

  const t = translations[language];

  return (
    <>
      {/* Top Bar */}
      <div>
        <Container>
          <div className="top-bar row justify-content-between align-items-center">
            <div className="two-sec text-center col-lg-9 d-flex justify-content-between align-items-center">
              <div className={`me-3 header-text ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                <i className="bi bi-star-fill text-warning me-1"></i>{' '}
                {t.promo}{' '}
                <a href="/#" className="ms-2 orders">
                  <strong className="theme-color ms-2 orders">{language === 'en' ? 'Promo:ORDER5' : 'كود:ORDER5'}</strong>
                </a>
              </div>
              <div className={`me-3 header-text ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                <i className="bi bi-geo-alt-fill me-1"></i>{' '}
                {t.location}{' '}
                <a href="/#" className="ms-2 orders">{t.changeLocation}</a>
              </div>
            </div>

            <div className="col-lg-2 cart-section text-white">
              <div className="row align-items-center">
                <div className="first-section col-4">
                  <Button
                    variant="link"
                    onClick={toggleTheme}
                    className="theme-toggle-btn-icon"
                    title={theme === 'light' ? (language === 'en' ? 'Switch to Dark Mode' : 'التحويل إلى الوضع الداكن') : (language === 'en' ? 'Switch to Light Mode' : 'التحويل إلى الوضع الفاتح')}
                  >
                    <i className={`bi ${theme === 'light' ? 'bi-moon-fill' : 'bi-sun-fill'}`}></i>
                  </Button>
                </div>
                <div className="second-section col-4">
                  <Link to="/wishlist" className="wishlist-icon-link">
                    <i className="bi bi-heart-fill"></i>
                  </Link>
                </div>
                <div className="third-section col-4">
                  <Button
                    variant="link"
                    onClick={toggleLanguage}
                    className="language-toggle-btn"
                    title={language === 'en' ? 'Switch to Arabic' : 'التحويل إلى الإنجليزية'}
                  >
                    <i className="bi bi-translate"></i>{' '}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navbar */}
      <BootstrapNavbar
        bg={theme === 'light' ? 'light' : 'dark'}
        variant={theme === 'light' ? 'light' : 'dark'}
        expand="lg"
        className="navbar py-3"
      >
        <Container>
          <BootstrapNavbar.Brand as={Link} to="/" className={language === 'ar' ? 'ms-4' : 'me-4'}>
            <img
              src={process.env.PUBLIC_URL + '/assets/quickpick-logo.png'}
              alt={language === 'en' ? 'QuickPick Logo' : 'شعار QuickPick'}
              className={`d-inline-block align-top ${language === 'ar' ? 'ms-2' : 'me-2'}`}
            />
          </BootstrapNavbar.Brand>

          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className={language === 'ar' ? 'ms-auto' : 'me-auto'}>
              <Nav.Link as={Link} to="/home" className={`mx-2 ${isActive('/home') ? 'active' : ''}`}>
                {t.home}
              </Nav.Link>
              <Nav.Link as={Link} to="/search" className={`mx-2 ${isActive('/search') ? 'active' : ''}`}>
                {t.browseProducts}
              </Nav.Link>
              <Nav.Link as={Link} to="/offers" className={`mx-2 ${isActive('/offers') ? 'active' : ''}`}>
                {t.specialOffers}
              </Nav.Link>
              <Nav.Link as={Link} to="/categories" className={`mx-2 ${isActive('/categories') ? 'active' : ''}`}>
                {t.categories}
              </Nav.Link>
              <Nav.Link as={Link} to="/track-order" className={`mx-2 ${isActive('/track-order') ? 'active' : ''}`}>
                {t.trackOrder}
              </Nav.Link>
              <Nav.Link as={Link} to="/wishlist" className={`mx-2 ${isActive('/wishlist') ? 'active' : ''}`}>
                {t.wishlist}
              </Nav.Link>
            </Nav>
            <div className="d-flex align-items-center">
              {user ? (
                <>
                  <Link to="/account/myaccount" className="user-icon-btn">
                    <img
                      src={process.env.PUBLIC_URL + '/assets/icon-user.png'}
                      alt={language === 'en' ? 'User Profile' : 'الملف الشخصي'}
                      className={`d-inline-block align-top ${language === 'ar' ? 'ms-2' : 'me-2'}`}
                    />
                  </Link>
                  <Button
                    variant="outline-danger"
                    onClick={handleLogout}
                    className={language === 'ar' ? 'me-2 logout-btn' : 'ms-2 logout-btn'}
                  >
                    {t.logout}
                  </Button>
                </>
              ) : (
                <Link to="/login" className="btn btn-success rounded-pill">
                  <i className={`bi bi-person-circle ${language === 'ar' ? 'ms-1' : 'me-1'}`}></i>{' '}
                  {t.loginSignup}
                </Link>
              )}
            </div>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
    </>
  );
}

export default CustomNavbar;
