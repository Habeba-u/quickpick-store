import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/OffersPage.css';
import ProductCard from '../components/ProductCard';

function OffersPage() {
  const { language } = useContext(LanguageContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const translations = {
    en: {
      searchPlaceholder: 'Search for products',
      searchButton: 'Search',
      noProducts: 'No products found.',
      banner1: {
        title: 'Save Up to 60% Off the Grocery Deals!',
        text: 'The Countdown is on! Grab the best deals while stock lasts.',
      },
      banner2: {
        title: 'A Sparkling Homeware Deal!',
        text: 'The Countdown is on! Grab the best deals while stock lasts.',
      },
      banner3: {
        title: 'Glow with Unstoppable Beauty!',
        text: 'The Countdown is on! Grab the best deals while stock lasts.',
      },
      orderNow: 'Order Now',
      sectionTitle: 'View Products',
      loading: 'Loading products...',
      error: 'Error loading products.',
    },
    ar: {
      searchPlaceholder: 'ابحث عن المنتجات',
      searchButton: 'بحث',
      noProducts: 'لم يتم العثور على منتجات.',
      banner1: {
        title: 'وفر حتى 60% على عروض البقالة!',
        text: 'العد التنازلي بدأ! اغتنم أفضل العروض قبل نفاد المخزون.',
      },
      banner2: {
        title: 'عرض رائع للأدوات المنزلية!',
        text: 'العد التنازلي بدأ! اغتنم أفضل العروض قبل نفاد المخزون.',
      },
      banner3: {
        title: 'تألقي بجمال لا يُضاهى!',
        text: 'العد التنازلي بدأ! اغتنم أفضل العروض قبل نفاد المخزون.',
      },
      orderNow: 'اطلب الآن',
      sectionTitle: 'عرض المنتجات',
      loading: 'جارٍ تحميل المنتجات...',
      error: 'خطأ في تحميل المنتجات.',
    },
  };

  const t = translations[language];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // Filter active products
        const activeProducts = data.filter(product => product.active);
        setProducts(activeProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const productsSection1 = products.slice(0, 4);
  const productsSection2 = products.slice(4, 8);
  const productsSection3 = products.slice(8, 12);

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

  const renderProductSection = (products) => (
    <Row className="mb-5">
      {products.length > 0 ? (
        products.map((product) => (
          <Col md={3} key={product.id} className="mb-4">
            <ProductCard product={product} />
          </Col>
        ))
      ) : (
        <Col>
          <p>{t.noProducts}</p>
        </Col>
      )}
    </Row>
  );

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <p>{t.loading}</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <p>{t.error}</p>
      </Container>
    );
  }

  return (
    <div className="offers-page">
      <Container className="py-5">
        <Form onSubmit={handleSearchSubmit} className="search-form mb-5">
          <Row className="justify-content-center">
            <Col xs={12} md={6} lg={5}>
              <div className={`search-container ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Form.Control
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-bar"
                />
                <Button type="submit" className="search-btn">
                  {t.searchButton}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>

        <Row className={`banner banner-1 mb-5 align-items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Col md={6} className={language === 'ar' ? 'text-end' : ''}>
            <h2 className="banner-title">{t.banner1.title}</h2>
            <p className="banner-text">{t.banner1.text}</p>
          </Col>
          <Col md={6} className={language === 'ar' ? 'text-start' : 'text-end'}>
            <Button as={Link} to="/products" className="banner-btn">
              {t.orderNow}
            </Button>
          </Col>
        </Row>

        <h3 className={`section-title mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
          {t.sectionTitle}
        </h3>
        {renderProductSection(productsSection1)}

        <Row className={`banner banner-2 mb-5 align-items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Col md={6} className={language === 'ar' ? 'text-end' : ''}>
            <h2 className="banner-title">{t.banner2.title}</h2>
            <p className="banner-text">{t.banner2.text}</p>
          </Col>
          <Col md={6} className={language === 'ar' ? 'text-start' : 'text-end'}>
            <Button as={Link} to="/products" className="banner-btn">
              {t.orderNow}
            </Button>
          </Col>
        </Row>

        <h3 className={`section-title mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
          {t.sectionTitle}
        </h3>
        {renderProductSection(productsSection2)}

        <Row className={`banner banner-3 mb-5 align-items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Col md={6} className={language === 'ar' ? 'text-end' : ''}>
            <h2 className="banner-title">{t.banner3.title}</h2>
            <p className="banner-text">{t.banner3.text}</p>
          </Col>
          <Col md={6} className={language === 'ar' ? 'text-start' : 'text-end'}>
            <Button as={Link} to="/products" className="banner-btn">
              {t.orderNow}
            </Button>
          </Col>
        </Row>

        <h3 className={`section-title mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
          {t.sectionTitle}
        </h3>
        {renderProductSection(productsSection3)}
      </Container>
    </div>
  );
}

export default OffersPage;
