import React, { useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { LanguageContext } from '../context/LanguageContext'; // Import LanguageContext
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/DealsSection.css';

function DealsSection() {
  const { language } = useContext(LanguageContext); // Access language from context

  // Translations
  const translations = {
    en: {
      sectionTitle: 'Up to -40% QuickPick exclusive deals',
      snacks: 'Snacks',
      babiesCare: 'Babies care',
      personalCare: 'Personal care',
      discountSnacks: '-17%',
      discountBabiesCare: '-10%',
      discountPersonalCare: '-40%',
    },
    ar: {
      sectionTitle: 'خصومات حصرية تصل إلى -40% من QuickPick',
      snacks: 'وجبات خفيفة',
      babiesCare: 'العناية بالأطفال',
      personalCare: 'العناية الشخصية',
      discountSnacks: '-17%',
      discountBabiesCare: '-10%',
      discountPersonalCare: '-40%',
    },
  };

  const t = translations[language];

  return (
    <div className="deals-section py-5">
      <Container>
        {/* Title */}
        <h2 className={`section-title mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
          {t.sectionTitle}
        </h2>

        <Row className="align-items-start">
          {/* Cards Section */}
          <Col md={12}>
            <Row className="justify-content-center">
              {/* Card 1: Snacks */}
              <Col
                md={6}
                lg={4}
                className={`mb-4 col-9 ${language === 'ar' ? 'order-lg-2' : 'order-lg-0'}`}
              >
                <Card className="deal-card shadow-top-left">
                  <div className="layout-back"></div>
                  <div className="discount-badge">{t.discountSnacks}</div>
                  <Card.Img
                    variant="top"
                    src={process.env.PUBLIC_URL + '/assets/snacks.jpg'}
                    alt={t.snacks}
                  />
                  <div className="name-deal">
                    <Card.Title>{t.snacks}</Card.Title>
                  </div>
                </Card>
              </Col>

              {/* Card 2: Babies Care */}
              <Col
                md={6}
                lg={4}
                className={`mb-4 col-9 ${language === 'ar' ? 'order-lg-1' : 'order-lg-1'}`}
              >
                <Card className="deal-card">
                  <div className="layout-back"></div>
                  <div className="discount-badge">{t.discountBabiesCare}</div>
                  <Card.Img
                    variant="top"
                    src={process.env.PUBLIC_URL + '/assets/babies-care.jpg'}
                    alt={t.babiesCare}
                  />
                  <div className="name-deal">
                    <Card.Title>{t.babiesCare}</Card.Title>
                  </div>
                </Card>
              </Col>

              {/* Card 3: Personal Care */}
              <Col
                md={6}
                lg={4}
                className={`mb-4 col-9 ${language === 'ar' ? 'order-lg-0' : 'order-lg-2'}`}
              >
                <Card className="deal-card">
                  <div className="layout-back"></div>
                  <div className="discount-badge">{t.discountPersonalCare}</div>
                  <Card.Img
                    variant="top"
                    src={process.env.PUBLIC_URL + '/assets/personal-care.jpg'}
                    alt={t.personalCare}
                  />
                  <div className="name-deal">
                    <Card.Title>{t.personalCare}</Card.Title>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DealsSection;