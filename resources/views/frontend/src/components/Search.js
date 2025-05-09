import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Dropdown, Pagination, Carousel } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/SearchPage.css';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

function Search() {
  const { language, setLanguage } = useContext(LanguageContext);
  const { addToCart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('Best Selling');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const productsPerPage = 16;
  const location = useLocation();

  // Translations
  const translations = {
    en: {
      searchPlaceholder: 'Search for products',
      searchButton: 'Search',
      noProducts: 'No products found.',
      categoryLabel: 'Category:',
      sortLabel: 'Sort by:',
      all: 'All',
      bestSelling: 'Best Selling',
      priceLowToHigh: 'Price Low to High',
      priceHighToLow: 'Price High to Low',
      languageLabel: 'Language:',
      loading: 'Loading products...',
      error: 'Error loading products.',
      slides: [
        {
          title: 'Glow with Unstoppable Beauty!',
          text: 'The Countdown is on! Grab the best deals while stock lasts.',
          buttonText: 'Order Now',
        },
        {
          title: 'Save Up to 60% Off the Grocery Deals!',
          text: 'The Countdown is on! Grab the best deals while stock lasts.',
          buttonText: 'Order Now',
        },
        {
          title: 'A Sparkling Homeware Deal!',
          text: 'The Countdown is on! Grab the best deals while stock lasts.',
          buttonText: 'Order Now',
        },
      ],
    },
    ar: {
      searchPlaceholder: 'ابحث عن المنتجات',
      searchButton: 'بحث',
      noProducts: 'لم يتم العثور على منتجات.',
      categoryLabel: 'الفئة:',
      sortLabel: 'ترتيب حسب:',
      all: 'الكل',
      bestSelling: 'الأكثر مبيعًا',
      priceLowToHigh: 'السعر من الأقل إلى الأعلى',
      priceHighToLow: 'السعر من الأعلى إلى الأقل',
      languageLabel: 'اللغة:',
      loading: 'جارٍ تحميل المنتجات...',
      error: 'خطأ في تحميل المنتجات.',
      slides: [
        {
          title: 'تألقي بجمال لا يُضاهى!',
          text: 'العد التنازلي بدأ! اغتنم أفضل العروض قبل نفاد المخزون.',
          buttonText: 'اطلب الآن',
        },
        {
          title: 'وفر حتى 60% على عروض البقالة!',
          text: 'العد التنازلي بدأ! اغتنم أفضل العروض قبل نفاد المخزون.',
          buttonText: 'اطلب الآن',
        },
        {
          title: 'عرض رائع للأدوات المنزلية!',
          text: 'العد التنازلي بدأ! اغتنم أفضل العروض قبل نفاد المخزون.',
          buttonText: 'اطلب الآن',
        },
      ],
    },
  };

  const t = translations[language];

  useEffect(() => {
    if (location.state?.fromSearch && location.state?.searchTerm) {
      setSearchTerm(location.state.searchTerm);
    } else {
      setSearchTerm('');
      setCurrentPage(1);
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // Fetch categories
        const categoriesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/categories`, {
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          credentials: token ? undefined : 'include',
        });

        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }

        const categoriesData = await categoriesResponse.json();
        const visibleCategories = categoriesData.filter(category => category.visibility);
        // Map category names for the dropdown
        const categoryNames = visibleCategories.map(category => ({
          en: category.name,
          ar: category.name_ar || category.name,
        }));
        setCategories(['All', ...categoryNames]);

        // Fetch products
        const params = {
          search: searchTerm,
          category: selectedCategory === 'All' ? '' : selectedCategory,
          sort: sortOption,
        };
        const productsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/products`, {
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          credentials: token ? undefined : 'include',
          params,
        });

        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }

        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchTerm, selectedCategory, sortOption]);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortSelect = (option) => {
    const sortOptionInEnglish =
      option === t.bestSelling
        ? translations.en.bestSelling
        : option === t.priceLowToHigh
        ? translations.en.priceLowToHigh
        : option === t.priceHighToLow
        ? translations.en.priceHighToLow
        : translations.en.bestSelling;
    setSortOption(sortOptionInEnglish);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  };

  const slides = [
    {
      image: `${process.env.PUBLIC_URL}/assets/offer-banner3.jpeg`,
      fallbackImage: `${process.env.PUBLIC_URL}/assets/placeholder.jpg`,
      title: t.slides[0].title,
      text: t.slides[0].text,
      buttonText: t.slides[0].buttonText,
      buttonLink: '/products',
    },
    {
      image: `${process.env.PUBLIC_URL}/assets/offer-banner1.jpeg`,
      fallbackImage: `${process.env.PUBLIC_URL}/assets/placeholder.jpg`,
      title: t.slides[1].title,
      text: t.slides[1].text,
      buttonText: t.slides[1].buttonText,
      buttonLink: '/products',
    },
    {
      image: `${process.env.PUBLIC_URL}/assets/offer-banner2.jpeg`,
      fallbackImage: `${process.env.PUBLIC_URL}/assets/placeholder.jpg`,
      title: t.slides[2].title,
      text: t.slides[2].text,
      buttonText: t.slides[2].buttonText,
      buttonLink: '/products',
    },
  ];

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
    <div className="search-page">
      <Container className="py-5">
        {/* Language Switcher */}
        <Row className="mb-4">
          <Col className="text-end">
            <Dropdown onSelect={handleLanguageSelect}>
              <Dropdown.Toggle variant="outline-secondary" id="language-dropdown">
                {t.languageLabel} {language === 'en' ? 'English' : 'العربية'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="en">English</Dropdown.Item>
                <Dropdown.Item eventKey="ar">العربية</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        <Form onSubmit={handleSearchSubmit} className="search-form mb-4">
          <Row className="justify-content-center">
            <Col xs={12} md={6} lg={5}>
              <div className={`search-container ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Form.Control
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className={`search-bar ${language === 'ar' ? 'text-end' : 'text-start'}`}
                />
                <Button type="submit" className="search-btn">
                  {t.searchButton}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>

        <Row className="mb-5">
          <Col>
            <Carousel className="custom-carousel" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
              {slides.map((slide, index) => (
                <Carousel.Item key={index}>
                  <div className="slider-image">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="d-block w-100"
                      style={{ height: '300px', objectFit: 'cover' }}
                      onError={(e) => {
                        console.warn(`Failed to load slide image: ${slide.image}`);
                        e.target.src = slide.fallbackImage;
                      }}
                    />
                    <div className="slider-overlay">
                      <div className={`slider-content ${language === 'ar' ? 'text-end' : 'text-center'}`}>
                        <h2 className="slider-title">{slide.title}</h2>
                        <p className="slider-text">{slide.text}</p>
                        <Button as={Link} to={slide.buttonLink} className="slider-btn">
                          {slide.buttonText}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>

        <Row>
          <Col>
            <Row className={`mb-4 align-items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Col md={6} className="mb-2 mb-md-0">
                <Dropdown onSelect={handleCategorySelect}>
                  <Dropdown.Toggle variant="outline-secondary" id="category-dropdown">
                    {t.categoryLabel}{' '}
                    {selectedCategory === 'All' ? t.all : language === 'ar' ? categories.find(cat => cat.en === selectedCategory)?.ar || selectedCategory : selectedCategory}
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                    {categories.map((category) => (
                      <Dropdown.Item key={typeof category === 'string' ? category : category.en} eventKey={typeof category === 'string' ? category : category.en}>
                        {typeof category === 'string' ? (category === 'All' ? t.all : category) : (language === 'ar' ? category.ar : category.en)}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col md={6} className={language === 'ar' ? 'text-md-start' : 'text-md-end'}>
                <Dropdown onSelect={handleSortSelect}>
                  <Dropdown.Toggle variant="outline-secondary" id="sort-dropdown">
                    {t.sortLabel}{' '}
                    {sortOption === translations.en.bestSelling
                      ? t.bestSelling
                      : sortOption === translations.en.priceLowToHigh
                      ? t.priceLowToHigh
                      : t.priceHighToLow}
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                    <Dropdown.Item eventKey={t.bestSelling}>{t.bestSelling}</Dropdown.Item>
                    <Dropdown.Item eventKey={t.priceLowToHigh}>{t.priceLowToHigh}</Dropdown.Item>
                    <Dropdown.Item eventKey={t.priceHighToLow}>{t.priceHighToLow}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>

            <Row>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <Col md={3} key={product.id} className="mb-4">
                    <ProductCard product={product} />
                  </Col>
                ))
              ) : (
                <Col className={language === 'ar' ? 'text-end' : 'text-start'}>
                  <p>{t.noProducts}</p>
                </Col>
              )}
            </Row>

            {totalPages > 1 && (
              <Row className="mt-4">
                <Col className="text-center">
                  <Pagination style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages).keys()].map((page) => (
                      <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => handlePageChange(page + 1)}
                      >
                        {page + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Search;
