import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, ProgressBar, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Cart.css';
import { CartContext } from '../context/CartContext';
import { LanguageContext } from '../context/LanguageContext';
import BorderHeader from '../components/BorderHeader';

function Cart() {
  const { cart, removeFromCart, updateQuantity, itemCount, totalPrice, addToCart } = useContext(CartContext);
  const { language } = useContext(LanguageContext);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [suggestionProduct, setSuggestionProduct] = useState(null); // State for the suggestion product
  const deliveryFee = 4.89;
  const freeDeliveryThreshold = 32.23;
  const remainingForFreeDelivery = (freeDeliveryThreshold - parseFloat(totalPrice)).toFixed(2);
  const progress = (parseFloat(totalPrice) / freeDeliveryThreshold) * 100;

  // Fetch a random product from the database for the suggestion
  useEffect(() => {
    const fetchSuggestionProduct = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch suggestion product');
        }
        const data = await response.json();
        // Pick a random product from the database
        const randomProduct = data[Math.floor(Math.random() * data.length)];
        setSuggestionProduct({
          ...randomProduct,
          price: parseFloat(randomProduct.price),
        });
      } catch (err) {
        console.error('Error fetching suggestion product:', err);
        // Fallback to a default product if fetch fails
        setSuggestionProduct({
          id: 0,
          name: 'Placeholder Product',
          name_ar: 'منتج بديل',
          price: 10.00,
          image: null,
        });
      }
    };
    fetchSuggestionProduct();
  }, []); // Empty dependency array to fetch only on mount

  // Translations (already defined in your code)
  const translations = {
    en: {
      title: 'Cart',
      yourCart: 'Your Cart',
      emptyCart: 'Your cart is empty.',
      cartItem: {
        price: 'EGP {total} x {quantity}',
        brand: 'Garden Fresh',
        lowStock: 'Limited Stock! Only a few left in stock. Order soon.',
        remove: 'Remove',
      },
      orderSummary: {
        title: 'Order Summary',
        almostThere: 'Almost there! Add {amount} EGP for free delivery',
        freeDeliveryUnlocked: 'Free delivery unlocked!',
        estimatedDelivery: 'Estimated delivery: 4 PM - 6 PM',
        subtotal: 'Subtotal ({count} items)',
        deliveryFee: 'Delivery Fee',
        discount: 'Discount',
        discountApplied: 'Promo Code Applied: {percentage}% off',
        estimatedTotal: 'Estimated total',
        currency: 'EGP',
      },
      promoCode: {
        placeholder: 'Enter Promo Code',
        apply: 'Apply',
        invalid: 'Invalid or expired promo code',
        success: 'Promo code applied successfully!',
      },
      checkout: 'Proceed to Checkout',
      suggestions: {
        title: 'Other Suggestion',
        price: 'EGP {price}',
        addToCart: 'Add to Cart',
        seeMore: 'See More Suggestions',
      },
    },
    ar: {
      title: 'سلة التسوق',
      yourCart: 'سلتك',
      emptyCart: 'سلتك فارغة.',
      cartItem: {
        price: '{total} ج.م. x {quantity}',
        brand: 'جاردن فريش',
        lowStock: 'مخزون محدود! بقي القليل في المخزون. اطلب قريبًا.',
        remove: 'إزالة',
      },
      orderSummary: {
        title: 'ملخص الطلب',
        almostThere: 'قاربت على الوصول! أضف {amount} ج.م. للحصول على توصيل مجاني',
        freeDeliveryUnlocked: 'تم فتح التوصيل المجاني!',
        estimatedDelivery: 'التوصيل المتوقع: 4 مساءً - 6 مساءً',
        subtotal: 'المجموع الفرعي ({count} عناصر)',
        deliveryFee: 'رسوم التوصيل',
        discount: 'الخصم',
        discountApplied: 'تم تطبيق رمز الخصم: {percentage}% خصم',
        estimatedTotal: 'الإجمالي المتوقع',
        currency: 'ج.م.',
      },
      promoCode: {
        placeholder: 'أدخل رمز الخصم',
        apply: 'تطبيق',
        invalid: 'رمز الخصم غير صالح أو منتهي الصلاحية',
        success: 'تم تطبيق رمز الخصم بنجاح!',
      },
      checkout: 'المتابعة إلى الدفع',
      suggestions: {
        title: 'اقتراحات أخرى',
        price: '{price} ج.م.',
        addToCart: 'أضف إلى السلة',
        seeMore: 'شاهد المزيد من الاقتراحات',
      },
    },
  };

  const t = translations[language];

  const handlePromoCodeSubmit = async (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/promotions/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ code: promoCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t.promoCode.invalid);
      }

      const data = await response.json();
      setDiscount(data.discount_percentage);
      setPromoSuccess(t.promoCode.success);
    } catch (err) {
      console.error('Error validating promo code:', err);
      setPromoError(err.message);
      setDiscount(0);
    }
  };

  const subtotal = parseFloat(totalPrice);
  const discountAmount = (subtotal * discount) / 100;
  const discountedTotal = subtotal - discountAmount + deliveryFee;

  return (
    <div className="cart-page">
      <div className="border-header">
        <h1 className={`cart-title text-center mb-5 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
          {t.title}
        </h1>
      </div>
      <Container className="py-5">
        <Row>
          {/* Left Side: Cart Items */}
          <Col md={8}>
            <h2 className={`section-title mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              {t.yourCart}
            </h2>
            {cart.length > 0 ? (
              cart.map((item) => {
                const displayName = language === 'ar' && item.name_ar ? item.name_ar : item.name;
                const imageSrc = item.image
                  ? `${process.env.REACT_APP_API_URL}/storage/${item.image}`
                  : '/assets/placeholder.jpg';

                console.log(`Cart item image URL for ${displayName}:`, imageSrc);

                return (
                  <Card className="cart-item mb-3" key={item.id}>
                    <Card.Body>
                      <Row className={`align-items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <Col xs={12} md={2}>
                          <img
                            src={imageSrc}
                            alt={displayName}
                            className="cart-item-image"
                            onError={(e) => {
                              console.warn(`Failed to load image for ${displayName}: ${imageSrc}`);
                              e.target.src = '/assets/placeholder.jpg';
                            }}
                          />
                        </Col>
                        <Col xs={12} md={6} className={`text-center mt-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                          <h5 className="cart-item-name">{displayName}</h5>
                          <p className="cart-item-price">
                            {t.cartItem.price
                              .replace('{total}', (item.price * item.quantity).toFixed(2))
                              .replace('{quantity}', item.quantity)}
                          </p>
                          <p className="cart-item-brand">{item.brand || t.cartItem.brand}</p>
                          {item.stockStatus === 'Low Stock' && (
                            <p className="cart-item-stock low-stock">
                              {t.cartItem.lowStock}
                            </p>
                          )}
                        </Col>
                        <Col xs={12} md={2} className="text-center">
                          <div className={`quantity-selector d-flex align-items-center justify-content-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="quantity mx-2">{item.quantity}</span>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </Col>
                        <Col xs={12} md={2} className="text-center mt-3">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            {t.cartItem.remove}
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                );
              })
            ) : (
              <p className={language === 'ar' ? 'text-end' : 'text-start'}>{t.emptyCart}</p>
            )}
          </Col>

          {/* Right Side: Order Summary */}
          <Col md={4}>
            <Card className="order-summary mb-4">
              <Card.Body>
                <h3 className={`summary-title mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                  {remainingForFreeDelivery > 0
                    ? t.orderSummary.almostThere.replace('{amount}', remainingForFreeDelivery)
                    : t.orderSummary.freeDeliveryUnlocked}
                </h3>
                <ProgressBar now={progress} className="mb-3" />
                <p className={`estimated-delivery mb-2 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                  {t.orderSummary.estimatedDelivery}
                </p>
                <h4 className={`summary-subtitle ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                  {t.orderSummary.title}
                </h4>
                <div className="summary-details">
                  <div className={`d-flex justify-content-between mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <span>{t.orderSummary.subtotal.replace('{count}', itemCount)}</span>
                    <span>{totalPrice} {t.orderSummary.currency}</span>
                  </div>
                  <div className={`d-flex justify-content-between mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <span>{t.orderSummary.deliveryFee}</span>
                    <span>{deliveryFee.toFixed(2)} {t.orderSummary.currency}</span>
                  </div>
                  {discount > 0 && (
                    <div className={`d-flex justify-content-between mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <span>{t.orderSummary.discount}</span>
                      <span>-{discountAmount.toFixed(2)} {t.orderSummary.currency}</span>
                    </div>
                  )}
                  <hr />
                  <div className={`d-flex justify-content-between summary-total ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <strong>{t.orderSummary.estimatedTotal}</strong>
                    <strong>
                      {discountedTotal.toFixed(2)} {t.orderSummary.currency}
                    </strong>
                  </div>
                </div>
                <Form onSubmit={handlePromoCodeSubmit} className="promo-code-form mt-3">
                  <Form.Control
                    type="text"
                    placeholder={t.promoCode.placeholder}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className={`mb-2 ${language === 'ar' ? 'text-end' : 'text-start'}`}
                  />
                  {promoError && <Alert variant="danger">{promoError}</Alert>}
                  {promoSuccess && <Alert variant="success">{promoSuccess}</Alert>}
                  {promoCode && (
                    <Button variant="outline-secondary" type="submit" className="w-100">
                      {t.promoCode.apply}
                    </Button>
                  )}
                </Form>
                <Button
                  variant="success"
                  className="checkout-btn w-100 mt-3"
                  as={Link}
                  to="/checkout"
                  state={{ promoCode, discount }}
                  disabled={cart.length === 0}
                >
                  {t.checkout}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Suggestions Section - Always show a random product from the database */}
        {suggestionProduct && (
          <Row className="mt-5">
            <Col md={8}>
              <h2 className={`section-title mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                {t.suggestions.title}
              </h2>
              <Row>
                <Col md={12}>
                  <div className={`suggestion-card d-flex align-items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <img
                      src={suggestionProduct.image
                        ? `${process.env.REACT_APP_API_URL}/storage/${suggestionProduct.image}`
                        : '/assets/placeholder.jpg'}
                      alt={language === 'ar' && suggestionProduct.name_ar ? suggestionProduct.name_ar : suggestionProduct.name}
                      className="suggestion-image me-3 ms-3"
                      onError={(e) => {
                        console.warn(`Failed to load suggestion image: ${suggestionProduct.image}`);
                        e.target.src = '/assets/placeholder.jpg';
                      }}
                    />
                    <div className={`suggestion-details d-flex align-items-center justify-content-between flex-grow-1 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <div className={`col-9 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                        <h5 className="suggestion-name">
                          {language === 'ar' && suggestionProduct.name_ar ? suggestionProduct.name_ar : suggestionProduct.name}
                        </h5>
                        <p className="suggestion-price">
                          {t.suggestions.price.replace('{price}', suggestionProduct.price.toFixed(2))}
                        </p>
                      </div>
                      <div className="col-md-3 text-center">
                        <Button
                          variant="success"
                          className="add-to-cart-btn"
                          onClick={() => addToCart(suggestionProduct, 1)}
                        >
                          {t.suggestions.addToCart}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col className="text-center">
                  <Button variant="link" className="fw-bolder" as={Link} to="/offers">
                    {t.suggestions.seeMore}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default Cart;
