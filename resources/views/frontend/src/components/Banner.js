import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext'; // Import LanguageContext
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Banner.css';

function Banner() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext); // Access language from context

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate('/search', { state: { searchTerm, fromSearch: true } });
    } else {
      navigate('/search');
    }
  };

  // Translations
  const translations = {
    en: {
      title: 'Make healthy life with Fresh Grocery. Product.',
      titleHighlight: 'Fresh Grocery.',
      subtitle: 'Enter a product name to see what we deliver',
      placeholder: 'Search for products',
      button: 'Search',
    },
    ar: {
      title: 'عش حياة صحية مع منتجات البقالة الطازجة.',
      titleHighlight: 'البقالة الطازجة.',
      subtitle: 'أدخل اسم المنتج لمعرفة ما نقدمه',
      placeholder: 'ابحث عن المنتجات',
      button: 'بحث',
    },
  };

  const t = translations[language];

  return (
    <div className="banner-section d-flex align-items-center container">
      <Container className="p-0">
        <Row className="align-items-center m-0">
          {/* Left Side: Text and Search Input */}
          <Col md={6} className={language === 'ar' ? 'text-end' : 'text-left'}>
            <h1 className="banner-title">
              {t.title.replace(t.titleHighlight, '')}
              <span className="text-success">{t.titleHighlight}</span>
            </h1>
            <p className="banner-subtitle">{t.subtitle}</p>
            <Form onSubmit={handleSearchSubmit}>
              <InputGroup className="custom-input-group">
                <Form.Control
                  type="text"
                  placeholder={t.placeholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="custom-input"
                />
                <Button type="submit" variant="success" className="custom-button">
                  {t.button}
                </Button>
              </InputGroup>
            </Form>
          </Col>

          {/* Right Side: Empty since image is now a background */}
          <Col md={6}></Col>
        </Row>
      </Container>
    </div>
  );
}

export default Banner;
