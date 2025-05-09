import React, { useContext } from 'react';
import { Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import CustomNavbar from './Navbar';
import FooterSection from './FooterSection';
import { LanguageContext } from '../context/LanguageContext'; // Import LanguageContext
import '../styles/ErrorPage.css';

function ErrorPage() {
  const { language } = useContext(LanguageContext);

  // Translations
  const translations = {
    en: {
      errorCode: '404',
      title: 'oops! Page not found',
      subtitle: 'The page you are looking for cannot be found. Take a break before trying again',
      backToHome: 'Back to Home',
    },
    ar: {
      errorCode: '404',
      title: 'عذرًا! الصفحة غير موجودة',
      subtitle: 'الصفحة التي تبحث عنها غير موجودة. خذ استراحة قبل المحاولة مرة أخرى',
      backToHome: 'العودة إلى الصفحة الرئيسية',
    },
  };

  const t = translations[language];

  return (
    <div className="error-page">
      {/* Header */}
      <CustomNavbar />

      {/* Main Content */}
      <Container className={`text-center py-5 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
        <h1 className="error-code">{t.errorCode}</h1>
        <h2 className="error-title">{t.title}</h2>
        <p className="error-subtitle">{t.subtitle}</p>
        <Button as={Link} to="/" variant="success" className="back-to-home-button">
          {t.backToHome}
        </Button>
      </Container>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}

export default ErrorPage;