import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { LanguageContext } from '../context/LanguageContext'; // Import LanguageContext
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/CounterSection.css';

function CounterSection() {
  const { language } = useContext(LanguageContext); // Access language from context

  // Translations
  const translations = {
    en: {
      registered: 'Registered',
      ordersDelivered: 'Orders Delivered',
      foodItems: 'Food Items',
    },
    ar: {
      registered: 'مسجل',
      ordersDelivered: 'طلبات تم تسليمها',
      foodItems: 'عناصر غذائية',
    },
  };

  const t = translations[language];

  return (
    <Container className="counter-section">
      <Row className={language === 'ar' ? 'flex-row-reverse' : ''}>
        <Col md={4} className={language === 'ar' ? 'text-center' : 'text-center counter-border'}>
          <div className="counter-box">
            <h2 className="counter-number">546+</h2>
            <p className="counter-label">{t.registered}</p>
          </div>
        </Col>
        <Col md={4} className="text-center counter-border">
          <div className="counter-box">
            <h2 className="counter-number">789,900+</h2>
            <p className="counter-label">{t.ordersDelivered}</p>
          </div>
        </Col>
        <Col md={4} className={language === 'ar' ? 'text-center counter-border' : 'text-center'}>
          <div className="counter-box">
            <h2 className="counter-number">17,457+</h2>
            <p className="counter-label">{t.foodItems}</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CounterSection;