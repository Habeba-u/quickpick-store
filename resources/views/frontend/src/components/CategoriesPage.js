import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/CategoriesPage.css';

function CategoriesPage() {
  const { language } = useContext(LanguageContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Translations for static content
  const translations = {
    en: {
      title: 'Categories',
      searchPlaceholder: 'Search for categories',
      noCategories: 'No categories found.',
      loading: 'Loading categories...',
      error: 'Error loading categories.',
      tabs: {
        all: 'All',
        mostPopular: 'Most Popular',
        essentials: 'Essentials',
      },
    },
    ar: {
      title: 'الفئات',
      searchPlaceholder: 'ابحث عن الفئات',
      noCategories: 'لم يتم العثور على فئات.',
      loading: 'جارٍ تحميل الفئات...',
      error: 'خطأ في تحميل الفئات.',
      tabs: {
        all: 'الكل',
        mostPopular: 'الأكثر شيوعًا',
        essentials: 'الأساسيات',
      },
    },
  };

  const t = translations[language];

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // If using Sanctum
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/categories`, {
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          credentials: token ? undefined : 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        // Filter only visible categories
        const visibleCategories = data.filter(category => category.visibility);
        setCategories(visibleCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Filter categories based on search and tabs
  const filteredCategories = categories.filter((category) => {
    const categoryName = language === 'ar' ? category.name_ar || category.name : category.name;
    // Search filter
    if (searchTerm && !categoryName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Tab filter (adjust logic based on your criteria for "Most Popular" and "Essentials")
    if (activeTab === 'all') return true;
    if (activeTab === 'mostPopular') {
      // Example: Define popular categories by name or add a field like `is_popular` in the database
      const popularNames = language === 'ar'
        ? ['الفواكه والخضروات', 'منتجات الألبان', 'المشروبات'] // Adjust based on your data
        : ['Fruits and Vegetables', 'Dairy', 'Beverages'];
      return popularNames.includes(categoryName);
    }
    if (activeTab === 'essentials') {
      const essentialNames = language === 'ar'
        ? ['اللحوم والدواجن', 'المأكولات البحرية']
        : ['Meat & Poultry', 'Seafood'];
      return essentialNames.includes(categoryName);
    }
    return true;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

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
    <div className="categories-page">
      <Container className="py-5">
        {/* Title */}
        <h1 className={`categories-title mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
          {t.title}
        </h1>

        {/* Search Bar and Tabs */}
        <div className={`d-flex justify-content-between align-items-center mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Form.Control
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-bar"
          />
        </div>

        {/* Tabs */}
        <Nav
          variant="tabs"
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key)}
          className={`mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}
          style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
        >
          <Nav.Item>
            <Nav.Link eventKey="all">{t.tabs.all}</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="mostPopular">{t.tabs.mostPopular}</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="essentials">{t.tabs.essentials}</Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Categories Grid */}
        <Row>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <Col md={4} lg={3} key={category.id} className="mb-4">
                <Link to={`/category/${category.id}`} className="category-link">
                  <Card className="category-card">
                    <Card.Img
                      variant="top"
                      src={category.image ? `${process.env.REACT_APP_API_URL}/storage/${category.image}` : '/assets/placeholder.jpg'}
                      alt={language === 'ar' ? category.name_ar || category.name : category.name}
                      className="category-image"
                      onError={(e) => {
                        e.target.src = '/assets/placeholder.jpg'; // Fallback image
                      }}
                    />
                    <Card.Body>
                      <Card.Title className={`category-name ${language === 'ar' ? 'text-center' : 'text-center'}`}>
                        {language === 'ar' ? category.name_ar || category.name : category.name}
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))
          ) : (
            <Col>
              <p>{t.noCategories}</p>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default CategoriesPage;
