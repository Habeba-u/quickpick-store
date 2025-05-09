import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/ProductPage.css';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { LanguageContext } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { language } = useContext(LanguageContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch product
      const productResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!productResponse.ok) {
        throw new Error('Failed to fetch product');
      }
      const productData = await productResponse.json();
      setProduct(productData);

      // Set initial image
      if (productData.image) {
        setCurrentImage(`${process.env.REACT_APP_API_URL}/storage/${productData.image}`);
      }

      // Fetch related products
      const relatedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}/related`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!relatedResponse.ok) {
        throw new Error('Failed to fetch related products');
      }
      const relatedData = await relatedResponse.json();
      setRelatedProducts(relatedData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [id]);

  const translations = {
    en: {
      loading: 'Loading...',
      error: 'Error loading product.',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      productDescription: 'Product Description',
      ingredients: 'Ingredients / Material',
      instructions: 'How to Use / Instructions',
      weight: 'Weight, Dimensions, etc.',
      returnPolicy: 'Return Policy',
      relatedProducts: 'Related Products',
      reviews: 'Reviews',
      reviewDate: 'March 1, 2023',
      reviewerName: 'John Doe (Verified Purchase)',
      reviewText: 'This is the amazing product! I’m loving it.',
      helpful: 'Was this helpful?',
      addReview: 'Add a Review',
      yourRating: 'Your Rating',
      writeReview: 'Write your review',
      writeReviewPlaceholder: 'Write your review here...',
      submit: 'Submit',
      reviewCount: '(100 reviews)',
      currency: 'LE',
    },
    ar: {
      loading: 'جاري التحميل...',
      error: 'خطأ في تحميل المنتج.',
      addToCart: 'إضافة إلى السلة',
      buyNow: 'اشتري الآن',
      productDescription: 'وصف المنتج',
      ingredients: 'المكونات / المواد',
      instructions: 'كيفية الاستخدام / التعليمات',
      weight: 'الوزن، الأبعاد، إلخ.',
      returnPolicy: 'سياسة الإرجاع',
      relatedProducts: 'منتجات ذات صلة',
      reviews: 'التقييمات',
      reviewDate: '1 مارس 2023',
      reviewerName: 'جون دو (شراء موثق)',
      reviewText: 'هذا المنتج رائع! أنا أحبه.',
      helpful: 'هل كان هذا مفيدًا؟',
      addReview: 'إضافة تقييم',
      yourRating: 'تقييمك',
      writeReview: 'اكتب تقييمك',
      writeReviewPlaceholder: 'اكتب تقييمك هنا...',
      submit: 'إرسال',
      reviewCount: '(100 تقييم)',
      currency: 'جنيه مصري',
    },
  };

  const t = translations[language];

  const thumbnails = product
    ? [
        product.image ? `${process.env.REACT_APP_API_URL}/storage/${product.image}` : '/assets/placeholder.jpg',
        ...(product.gallery_images && Array.isArray(product.gallery_images)
          ? product.gallery_images.map(img => `${process.env.REACT_APP_API_URL}/storage/${img}`)
          : [])
      ]
    : [];

  const handleThumbnailClick = (image, index) => {
    setCurrentImage(image);
    setCurrentIndex(index);
  };

  const handlePrevClick = () => {
    const newIndex = currentIndex === 0 ? thumbnails.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setCurrentImage(thumbnails[newIndex]);
  };

  const handleNextClick = () => {
    const newIndex = currentIndex === thumbnails.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setCurrentImage(thumbnails[newIndex]);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  if (loading) {
    return <div>{t.loading}</div>;
  }

  if (error || !product) {
    return <div>{t.error}</div>;
  }

  const isInWishlist = wishlist.some((item) => item.id === product.id);
  const displayName = language === 'ar' ? product.name_ar || product.name : product.name;

  return (
    <div className="product-page">
      <Container className="py-5">
        <Row className={language === 'ar' ? 'flex-row-reverse' : ''}>
          <Col md={5}>
            <div className="main-image-container">
              <img
                src={currentImage}
                alt={displayName}
                className="main-product-image"
                onError={(e) => {
                  e.target.src = '/assets/placeholder.jpg';
                }}
              />
              <Button
                variant="light"
                className={`carousel-arrow ${language === 'ar' ? 'carousel-arrow-right' : 'carousel-arrow-left'}`}
                onClick={handlePrevClick}
              >
                {language === 'ar' ? <FaChevronRight /> : <FaChevronLeft />}
              </Button>
              <Button
                variant="light"
                className={`carousel-arrow ${language === 'ar' ? 'carousel-arrow-left' : 'carousel-arrow-right'}`}
                onClick={handleNextClick}
              >
                {language === 'ar' ? <FaChevronLeft /> : <FaChevronRight />}
              </Button>
            </div>
            <div className={`thumbnails mt-3 d-flex gap-2 justify-content-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              {thumbnails.map((thumb, index) => (
                <img
                  key={index}
                  src={thumb}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail-image ${currentIndex === index ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(thumb, index)}
                />
              ))}
            </div>
          </Col>

          <Col md={7} className={`product-details ${language === 'ar' ? 'text-end' : 'text-start'}`}>
            <div className={`d-flex ${language === 'ar' ? 'flex-row-reverse' : ''} justify-content-between align-items-center mb-3`}>
              <h1 className="product-title">{displayName}</h1>
              <FaHeart
                className={`wishlist-icon ${isInWishlist ? 'wishlist-active' : ''}`}
                onClick={() => toggleWishlist(product)}
                style={{ cursor: 'pointer' }}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              />
            </div>
            <p className="product-price">
              {language === 'ar' ? `${parseFloat(product.price).toFixed(2)} جنيه مصري` : `${parseFloat(product.price).toFixed(2)} LE`}{' '}
              <span className="original-price">
                {language === 'ar' ? `${(parseFloat(product.price) + 25).toFixed(2)} جنيه مصري` : `${(parseFloat(product.price) + 25).toFixed(2)} LE`}
              </span>
            </p>
            <div className={`product-rating mb-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <FaStar className="star filled" />
              <FaStar className="star filled" />
              <FaStar className="star filled" />
              <FaStar className="star filled" />
              <FaStar className="star" />
              <span className="review-count">{t.reviewCount}</span>
            </div>
            <InputGroup className={`quantity-selector mb-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`} style={{ maxWidth: '150px' }}>
              <Button
                variant="outline-secondary"
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                -
              </Button>
              <Form.Control
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="text-center"
              />
              <Button
                variant="outline-secondary"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </InputGroup>
            <div className={`product-actions d-flex gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Button
                variant="outline-success"
                className="add-to-cart-btn w-50"
                onClick={handleAddToCart}
              >
                {t.addToCart}
              </Button>
              <Button
                variant="success"
                className="buy-now-btn w-50"
                onClick={handleBuyNow}
              >
                {t.buyNow}
              </Button>
            </div>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <h2 className={`section-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              {t.productDescription}
            </h2>
            <div className={`description-section ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              <h5>{t.ingredients}</h5>
              <p>{language === 'ar' ? (product.ingredients_material_ar || product.ingredients_material || 'غير متوفر') : (product.ingredients_material || 'Not available')}</p>
              <h5>{t.instructions}</h5>
              <p>{language === 'ar' ? (product.instructions_ar || product.instructions || 'غير متوفر') : (product.instructions || 'Not available')}</p>
              <h5>{t.weight}</h5>
              <p>{language === 'ar' ? (product.weight_dimensions_ar || product.weight_dimensions || 'غير متوفر') : (product.weight_dimensions || 'Not available')}</p>
              <h5>{t.returnPolicy}</h5>
              <p>{language === 'ar' ? (product.return_policy_ar || product.return_policy || 'غير متوفر') : (product.return_policy || 'Not available')}</p>
            </div>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <h2 className={`section-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              {t.relatedProducts}
            </h2>
            <Row className="justify-content-center">
              {relatedProducts.map((relatedProduct) => (
                <Col
                  sm={6}
                  md={3}
                  key={relatedProduct.id}
                  className={`mb-4 col-9 ${language === 'ar' ? 'order-md-last' : 'order-md-first'}`}
                >
                  <ProductCard
                    product={relatedProduct}
                    className="related-product-card"
                    priceFormatter={(price) => {
                      const numericPrice = parseFloat(price);
                      return language === 'ar'
                        ? `${numericPrice.toFixed(2)} جنيه مصري`
                        : `${numericPrice.toFixed(2)} LE`;
                    }}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <h2 className={`section-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              {t.reviews}
            </h2>
            <Card className="review-card mb-4">
              <Card.Body>
                <div className={`d-flex ${language === 'ar' ? 'flex-row-reverse' : ''} justify-content-between align-items-center mb-2`}>
                  <div className={`review-rating ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <FaStar className="star filled" />
                    <FaStar className="star filled" />
                    <FaStar className="star filled" />
                    <FaStar className="star filled" />
                    <FaStar className="star" />
                  </div>
                  <span className="review-date">{t.reviewDate}</span>
                </div>
                <Card.Title className="reviewer-name">{t.reviewerName}</Card.Title>
                <Card.Text className="review-text">{t.reviewText}</Card.Text>
                <Button variant="link" className="helpful-btn">
                  {t.helpful} <FaHeart className={language === 'ar' ? 'me-1' : 'ms-1'} />
                </Button>
              </Card.Body>
            </Card>

            <h3 className={`add-review-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              {t.addReview}
            </h3>
            <Form className={language === 'ar' ? 'text-end' : ''}>
              <Form.Group className="mb-3">
                <Form.Label>{t.yourRating}</Form.Label>
                <div className={`review-rating-input ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <FaStar className="star filled" />
                  <FaStar className="star filled" />
                  <FaStar className="star filled" />
                  <FaStar className="star" />
                  <FaStar className="star" />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t.writeReview}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder={t.writeReviewPlaceholder}
                />
              </Form.Group>
              <Button variant="success" type="submit">
                {t.submit}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProductPage;
