import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Banner.css';

function Banner() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [content, setContent] = useState({
    title: { en: '', ar: '' },
    subtitle: { en: '', ar: '' },
    placeholder: { en: '', ar: '' },
    button: { en: '', ar: '' },
    image: { en: '', ar: '' },
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/banner`, {
          headers: { 'Accept': 'application/json' },
          credentials: 'include',
        });
        console.log('Fetch response status:', response.status, response.statusText);
        if (!response.ok) throw new Error('Failed to fetch banner settings');
        const data = await response.json();
        console.log('Raw banner settings:', data);
        const contentMap = {
          title: { en: '', ar: '' },
          subtitle: { en: '', ar: '' },
          placeholder: { en: '', ar: '' },
          button: { en: '', ar: '' },
          image: { en: '', ar: '' },
        };
        data.forEach(item => {
          if (item.key === 'banner_image_en') {
            contentMap.image.en = item.image ? `${process.env.REACT_APP_API_URL}/storage/${item.image}` : '';
          } else if (item.key === 'banner_image_ar') {
            contentMap.image.ar = item.image ? `${process.env.REACT_APP_API_URL}/storage/${item.image}` : '';
          } else {
            const key = item.key.split('_')[0];
            const lang = item.language;
            try {
              contentMap[key][lang] = JSON.parse(item.value);
            } catch (e) {
              console.error(`Failed to parse value for ${item.key}:`, item.value);
            }
          }
        });
        console.log('Processed banner content:', contentMap);
        setContent(contentMap);
      } catch (error) {
        console.error('Error fetching banner content:', error);
      }
    };
    fetchContent();
  }, []);

  // Debug image loading
  useEffect(() => {
    if (content.image[language]) {
      const img = new Image();
      img.src = content.image[language];
      img.onerror = () => console.error('Failed to load banner image:', content.image[language]);
    }
  }, [content.image, language]);

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

  const t = {
    title: content.title[language] || (language === 'ar' ? 'عش حياة صحية مع منتجات البقالة الطازجة.' : 'Make healthy life with Fresh Grocery. Product.'),
    subtitle: content.subtitle[language] || (language === 'ar' ? 'أدخل اسم المنتج لمعرفة ما نقدمه' : 'Enter a product name to see what we deliver'),
    placeholder: content.placeholder[language] || (language === 'ar' ? 'ابحث عن المنتجات' : 'Search for products'),
    button: content.button[language] || (language === 'ar' ? 'بحث' : 'Search'),
  };

  return (
    <div
      className="banner-section d-flex align-items-center container"
      style={{
        backgroundImage: `url(${content.image[language] || `${process.env.PUBLIC_URL}/assets/default-banner.jpg`})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '400px',
      }}
    >
      <Container className="p-0">
        <Row className="align-items-center m-0">
          <Col md={6} className={language === 'ar' ? 'text-end' : 'text-left'}>
            <h1 className="banner-title">{t.title}</h1>
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
          <Col md={6}></Col>
        </Row>
      </Container>
    </div>
  );
}

export default Banner;
