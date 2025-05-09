import React, { useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/OrderConfirmation.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { jsPDF } from 'jspdf';

function OrderConfirmation() {
  const { language } = useContext(LanguageContext);
  const { state } = useLocation();
  const navigate = useNavigate();
  const orderDetails = state?.orderDetails;

  const translations = {
    en: {
      title: 'Your order is completed!',
      message: 'Thank you. Your Order has been received.',
      order: 'Order',
      paymentMethod: 'Payment Method',
      transactionId: 'Transaction ID',
      estimatedDelivery: 'Estimated Delivery',
      downloadInvoice: 'Download Invoice',
      detailsTitle: 'Order Details',
      products: 'Products',
      noItems: 'No items in this order.',
      subTotal: 'Sub Total',
      shipping: 'Shipping',
      discount: 'Discount',
      taxes: 'Taxes',
      total: 'Total',
      currency: 'EGP',
    },
    ar: {
      title: 'تم اكتمال طلبك!',
      message: 'شكرًا لك. تم استلام طلبك.',
      order: 'الطلب',
      paymentMethod: 'طريقة الدفع',
      transactionId: 'معرف المعاملة',
      estimatedDelivery: 'التسليم المتوقع',
      downloadInvoice: 'تنزيل الفاتورة',
      detailsTitle: 'تفاصيل الطلب',
      products: 'المنتجات',
      noItems: 'لا توجد عناصر في هذا الطلب.',
      subTotal: 'المجموع الفرعي',
      shipping: 'الشحن',
      discount: 'الخصم',
      taxes: 'الضرائب',
      total: 'الإجمالي',
      currency: 'ج.م.',
    },
  };

  const t = translations[language];

  if (!orderDetails) {
    return (
      <Container className="py-5">
        <div className={language === 'ar' ? 'text-end' : 'text-start'}>
          {language === 'ar' ? 'لا توجد تفاصيل طلب متاحة.' : 'No order details available.'}
        </div>
      </Container>
    );
  }

  // Map orderDetails to the expected structure
  const orderId = orderDetails.id || 'N/A';
  const paymentMethod = orderDetails.payment_method || 'N/A';
  const transactionId = `TXN${orderId}${Math.floor(Math.random() * 10000)}`; // Mock transaction ID
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(
    language === 'ar' ? 'ar-EG' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  ); // Mock delivery date (5 days from now)
  const cartItems = orderDetails.items?.map(item => ({
    id: item.product_id,
    name: language === 'ar' && item.product.name_ar ? item.product.name_ar : item.product.name,
    quantity: item.quantity,
    price: item.price,
  })) || [];
  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const shipping = 4.89; // Hardcoded as per Checkout.js
  const total = orderDetails.total || 0;
  const promoCode = orderDetails.promo_code || null;
  const discountPercentage = orderDetails.discount_percentage || 0;
  const discountAmount = (subtotal * discountPercentage) / 100;

  const downloadInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(t.detailsTitle, 20, 20);
    doc.setFontSize(12);
    doc.text(`${t.order}: #${orderId}`, 20, 40);
    doc.text(`${t.paymentMethod}: ${paymentMethod}`, 20, 50);
    doc.text(`${t.transactionId}: ${transactionId}`, 20, 60);
    doc.text(`${t.estimatedDelivery}: ${estimatedDelivery}`, 20, 70);
    doc.setLineWidth(0.5);
    doc.line(20, 80, 190, 80);
    doc.setFontSize(14);
    doc.text(t.products, 20, 90);
    doc.setFontSize(12);
    let yPosition = 100;
    if (cartItems.length > 0) {
      cartItems.forEach((item) => {
        const itemTotal = (parseFloat(item.price) * item.quantity).toFixed(2);
        doc.text(`${item.name} - ${item.quantity} x ${itemTotal} ${t.currency}`, 20, yPosition);
        yPosition += 10;
      });
    } else {
      doc.text(t.noItems, 20, yPosition);
      yPosition += 10;
    }
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    doc.text(`${t.subTotal}: ${parseFloat(subtotal).toFixed(2)} ${t.currency}`, 20, yPosition);
    yPosition += 10;
    doc.text(`${t.shipping}: ${parseFloat(shipping).toFixed(2)} ${t.currency}`, 20, yPosition);
    yPosition += 10;
    if (discountPercentage > 0) {
      doc.text(`${t.discount} (${discountPercentage}%): -${discountAmount.toFixed(2)} ${t.currency}`, 20, yPosition);
      yPosition += 10;
    }
    doc.text(`${t.taxes}: 0.00 ${t.currency}`, 20, yPosition);
    yPosition += 10;
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    doc.setFontSize(14);
    doc.text(`${t.total}: ${parseFloat(total).toFixed(2)} ${t.currency}`, 20, yPosition);
    yPosition += 20;
    doc.setFontSize(10);
    doc.text('Thank you for your purchase!', 20, yPosition);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition + 10);
    doc.save(`invoice_${orderId}.pdf`);
  };

  return (
    <div className="order-confirmation-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <div className="text-center mb-4">
              <i className="bi bi-check-circle-fill check-icon"></i>
              <h1 className="confirmation-title">{t.title}</h1>
              <p className="confirmation-message">{t.message}</p>
            </div>

            <div className="order-info d-flex justify-content-between align-items-center flex-wrap mb-4">
              <div>
                <strong>{t.order}</strong><br />
                #{orderId}
              </div>
              <div>
                <strong>{t.paymentMethod}</strong><br />
                {paymentMethod}
              </div>
              <div>
                <strong>{t.transactionId}</strong><br />
                {transactionId}
              </div>
              <div>
                <strong>{t.estimatedDelivery}</strong><br />
                {estimatedDelivery}
              </div>
              <Button
                variant="warning"
                className="download-btn"
                onClick={downloadInvoice}
              >
                {t.downloadInvoice}
              </Button>
            </div>

            <div className="order-details">
              <h3 className="details-title mb-3">{t.detailsTitle}</h3>
              <div className="mb-3">
                <strong>{t.products}</strong>
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="cart-item-detail">
                      {item.name} - {item.quantity} x {(parseFloat(item.price) * item.quantity).toFixed(2)} {t.currency}
                    </div>
                  ))
                ) : (
                  <div>{t.noItems}</div>
                )}
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>{t.subTotal}</span>
                <span>{parseFloat(subtotal).toFixed(2)} {t.currency}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>{t.shipping}</span>
                <span>{parseFloat(shipping).toFixed(2)} {t.currency}</span>
              </div>
              {discountPercentage > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>{t.discount} ({discountPercentage}%)</span>
                  <span>-{discountAmount.toFixed(2)} {t.currency}</span>
                </div>
              )}
              <div className="d-flex justify-content-between mb-2">
                <span>{t.taxes}</span>
                <span>0.00 {t.currency}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>{t.total}</strong>
                <strong>{parseFloat(total).toFixed(2)} {t.currency}</strong>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OrderConfirmation;
