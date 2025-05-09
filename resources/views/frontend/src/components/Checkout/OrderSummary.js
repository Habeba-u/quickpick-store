import React, { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import { LanguageContext } from '../../context/LanguageContext';

function OrderSummary({ cart, totalPrice, subtotal, shipping, cashHandlingFee, total, promoCode, discount }) {
    const { language } = useContext(LanguageContext);

    const translations = {
      en: {
        title: 'Order Summary',
        items: 'Items',
        subtotal: 'Sub Total',
        shipping: 'Shipping',
        cashHandlingFee: 'Cash Handling Fee',
        discount: 'Discount',
        total: 'Total',
        currency: 'EGP',
        price: 'EGP {total} x {quantity}',
        placeOrder: 'Place Order',
        emptyCart: 'Your cart is empty.',
      },
      ar: {
        title: 'ملخص الطلب',
        items: 'العناصر',
        subtotal: 'المجموع الفرعي',
        shipping: 'الشحن',
        cashHandlingFee: 'رسوم الدفع عند الاستلام',
        discount: 'الخصم',
        total: 'الإجمالي',
        currency: 'ج.م.',
        price: '{total} ج.م. x {quantity}',
        placeOrder: 'تقديم الطلب',
        emptyCart: 'سلتك فارغة.',
      },
    };

    const t = translations[language];
    const discountAmount = (subtotal * discount) / 100;

    return (
      <Card className="order-summary">
        <Card.Body>
          <h3 className={`summary-title mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
            {t.title}
          </h3>
          {/* Display cart items with name and image */}
          {cart?.length > 0 ? (
            cart.map((item) => {
              const displayName = language === 'ar' && item.name_ar ? item.name_ar : item.name;
              const imageSrc = item.image
                ? `${process.env.REACT_APP_API_URL}/storage/${item.image}`
                : `${process.env.PUBLIC_URL}/assets/placeholder.jpg`;

              return (
                <div key={item.id} className={`d-flex mb-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <img
                    src={imageSrc}
                    alt={displayName}
                    className="cart-item-image me-3"
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                    onError={(e) => {
                      console.warn(`Failed to load image for ${displayName}: ${imageSrc}`);
                      e.target.src = `${process.env.PUBLIC_URL}/assets/placeholder.jpg`;
                    }}
                  />
                  <div className={`flex-grow-1 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                    <h6 className="mb-1">{displayName}</h6>
                    <p className="mb-0">
                      {t.price
                        .replace('{total}', (item.price * item.quantity).toFixed(2))
                        .replace('{quantity}', item.quantity)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className={language === 'ar' ? 'text-end' : 'text-start'}>{t.emptyCart}</p>
          )}
          <div className="summary-details">
            <div className={`d-flex justify-content-between mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <span>{t.items}</span>
              <span>{cart?.length || 0}</span>
            </div>
            <div className={`d-flex justify-content-between mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <span>{t.subtotal}</span>
              <span>{subtotal.toFixed(2)} {t.currency}</span>
            </div>
            <div className={`d-flex justify-content-between mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <span>{t.shipping}</span>
              <span>{shipping.toFixed(2)} {t.currency}</span>
            </div>
            {cashHandlingFee > 0 && (
              <div className={`d-flex justify-content-between mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span>{t.cashHandlingFee}</span>
                <span>{cashHandlingFee.toFixed(2)} {t.currency}</span>
              </div>
            )}
            {discount > 0 && (
              <div className={`d-flex justify-content-between mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span>{t.discount} ({discount}%)</span>
                <span>-{discountAmount.toFixed(2)} {t.currency}</span>
              </div>
            )}
            <hr />
            <div className={`d-flex justify-content-between summary-total ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <strong>{t.total}</strong>
              <strong>{total.toFixed(2)} {t.currency}</strong>
            </div>
          </div>
          <Button
            variant="success"
            className="proceed-btn w-100 mt-4"
            type="submit"
            form="checkoutForm"
          >
            {t.placeOrder}
          </Button>
        </Card.Body>
      </Card>
    );
  }

  export default OrderSummary;
