import React, { useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext'; // Import LanguageContext
import '../styles/Verification.css';

function Verification() {
  const { language } = useContext(LanguageContext);

  // Translations
  const translations = {
    en: {
      title: 'verify',
      subtitle: 'Please enter the code we sent you your E-mail',
      resendText: "Didn't receive the code?",
      resendLink: 'Resend Code',
      verifyButton: 'Verify',
    },
    ar: {
      title: 'التحقق',
      subtitle: 'يرجى إدخال الرمز الذي أرسلناه إلى بريدك الإلكتروني',
      resendText: 'لم تتلق الرمز؟',
      resendLink: 'إعادة إرسال الرمز',
      verifyButton: 'تحقق',
    },
  };

  const t = translations[language];

  return (
    <div className="verification-page">
      <Container fluid className="h-100">
        <Row className="h-100">
          {/* Left Side: Image */}
          <Col md={6} className="d-none d-md-block verification-image-col">
            <img
              src={`${process.env.PUBLIC_URL}/assets/verification-image.png`}
              alt="Hand holding grocery bag"
              className="verification-image"
              onError={(e) => {
                console.warn(`Failed to load verification image: ${process.env.PUBLIC_URL}/assets/verification-image.png`);
                e.target.src = `${process.env.PUBLIC_URL}/assets/placeholder.jpg`;
              }}
            />
          </Col>

          {/* Right Side: Verification Form */}
          <Col md={6} className="d-flex align-items-center justify-content-center">
            <div className="verification-form">
              <h2 className={`verification-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                {t.title}
              </h2>
              <p className={`verification-subtitle ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                {t.subtitle}
              </p>
              <Form className={`d-flex justify-content-center gap-2 mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Form.Control
                  type="text"
                  maxLength="1"
                  className={`code-input ${language === 'ar' ? 'text-end' : 'text-start'}`}
                  placeholder=""
                />
                <Form.Control
                  type="text"
                  maxLength="1"
                  className={`code-input ${language === 'ar' ? 'text-end' : 'text-start'}`}
                  placeholder=""
                />
                <Form.Control
                  type="text"
                  maxLength="1"
                  className={`code-input ${language === 'ar' ? 'text-end' : 'text-start'}`}
                  placeholder=""
                />
                <Form.Control
                  type="text"
                  maxLength="1"
                  className={`code-input ${language === 'ar' ? 'text-end' : 'text-start'}`}
                  placeholder=""
                />
              </Form>
              <p className={`resend-text text-center ${language === 'ar' ? 'flex-row-reverse d-flex justify-content-center' : ''}`}>
                {t.resendText}{' '}
                <Link to="#" className="resend-link">
                  {t.resendLink}
                </Link>
              </p>
              <Button variant="success" type="submit" className="verify-button w-100">
                {t.verifyButton}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Verification;