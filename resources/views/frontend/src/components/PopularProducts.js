import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { LanguageContext } from '../context/LanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/PopularProducts.css';
import ProductCard from '../components/ProductCard';

function PopularProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useContext(LanguageContext);

  // Fetch popular products from the backend
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // Limit to 6 products (you can modify the backend to sort by popularity if needed)
        const limitedProducts = data.slice(0, 6).map(product => ({
          ...product,
          price: parseFloat(product.price), // Ensure price is a number
        }));
        setProducts(limitedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularProducts();
  }, []);

  // Translations
  const translations = {
    en: {
      sectionTitle: 'QuickPick Popular Products',
      loading: 'Loading products...',
      error: 'Error loading products.',
    },
    ar: {
      sectionTitle: 'المنتجات الشعبية من QuickPick',
      loading: 'جارٍ تحميل المنتجات...',
      error: 'خطأ في تحميل المنتجات.',
    },
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="popular-products py-5 text-center">
        <Container>
          <p>{t.loading}</p>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="popular-products py-5 text-center">
        <Container>
          <p>{t.error}</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="popular-products py-5">
      <Container>
        {/* Title */}
        <h2 className={`section-title mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
          {t.sectionTitle}
        </h2>

        {/* Product Cards */}
        <Row className="justify-content-center">
          {products.map((product) => (
            <Col
              md={2}
              key={product.id}
              className={`col-9 mb-4 ${language === 'ar' ? 'order-md-last' : 'order-md-first'}`}
            >
              <ProductCard
                product={product}
                className="popular-product-card"
                cartButtonContent={<i className="bi bi-plus-circle-fill"></i>}
                priceFormatter={(price) => {
                  return language === 'ar'
                    ? `${price.toFixed(2)} جنيه مصري`
                    : `${price.toFixed(2)} LE`;
                }}
                titleClassName="product-title"
                priceAndButtonLayout="inline"
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default PopularProducts;
