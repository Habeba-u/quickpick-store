import React, { useContext } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { LanguageContext } from '../../context/LanguageContext';

function PaymentMethodForm({
  paymentMethod,
  setPaymentMethod,
  showCardModal,
  setShowCardModal,
  selectedCard,
  saveCard,
  handleSaveCardChange,
}) {
  const { language } = useContext(LanguageContext);

  // Translations
  const translations = {
    en: {
      title: 'Select Payment Method',
      paymentNote: 'All payments are secured and encrypted.',
      creditDebitCard: 'Credit / Debit Card',
      changeCard: 'Change Card',
      selectOrAddCard: 'Select or Add Card',
      selectedCard: 'Selected Card',
      expires: 'Expires',
      saveCard: 'Save card for future purchases',
      mobileWallets: 'Mobile Wallets',
      cashOnDelivery: 'Cash on Delivery',
      cashNote: 'Please prepare the exact amount if possible. +10 EGP cash handling fee',
      applePay: 'Apple Pay',
      googlePay: 'Google Pay',
    },
    ar: {
      title: 'اختر طريقة الدفع',
      paymentNote: 'جميع المدفوعات مؤمنة ومشفرة.',
      creditDebitCard: 'بطاقة ائتمان / خصم',
      changeCard: 'تغيير البطاقة',
      selectOrAddCard: 'اختر أو أضف بطاقة',
      selectedCard: 'البطاقة المحددة',
      expires: 'تنتهي في',
      saveCard: 'حفظ البطاقة لعمليات الشراء المستقبلية',
      mobileWallets: 'محافظ الهاتف المحمول',
      cashOnDelivery: 'الدفع عند الاستلام',
      cashNote: 'يرجى تحضير المبلغ الدقيق إن أمكن. +10 ج.م. رسوم الدفع عند الاستلام',
      applePay: 'Apple Pay',
      googlePay: 'Google Pay',
    },
  };

  const t = translations[language];

  return (
    <>
      <h2 className={`section-title mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
        {t.title}
      </h2>
      <p className={`payment-note mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
        {t.paymentNote}
      </p>

      <Card className="payment-method-card mb-3">
        <Card.Body>
          <Form.Check
            type="radio"
            name="paymentMethod"
            label={t.creditDebitCard}
            value="card"
            checked={paymentMethod === 'card'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}
          />
          {paymentMethod === 'card' && (
            <>
              <Button
                variant="outline-success"
                className="mb-3"
                onClick={() => setShowCardModal(true)}
              >
                {selectedCard ? t.changeCard : t.selectOrAddCard}
              </Button>
              {selectedCard && (
                <div className={`selected-card mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                  <h5>{t.selectedCard}</h5>
                  <p>
                    {selectedCard.number} ({t.expires} {selectedCard.expiry})
                  </p>
                </div>
              )}
              <Form.Check
                type="checkbox"
                label={t.saveCard}
                checked={saveCard}
                onChange={handleSaveCardChange}
                className={language === 'ar' ? 'text-end' : 'text-start'}
              />
            </>
          )}
        </Card.Body>
      </Card>

      <Card className="payment-method-card mb-3">
        <Card.Body>
          <Form.Check
            type="radio"
            name="paymentMethod"
            label={t.mobileWallets}
            value="mobile"
            checked={paymentMethod === 'mobile'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}
          />
          {paymentMethod === 'mobile' && (
            <Row className={language === 'ar' ? 'flex-row-reverse' : ''}>
              <Col md={6}>
                <Button variant="outline-secondary" className="w-100">
                  {t.applePay}
                </Button>
              </Col>
              <Col md={6}>
                <Button variant="outline-secondary" className="w-100">
                  {t.googlePay}
                </Button>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      <Card className="payment-method-card mb-3">
        <Card.Body>
          <Form.Check
            type="radio"
            name="paymentMethod"
            label={t.cashOnDelivery}
            value="cash"
            checked={paymentMethod === 'cash'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className={language === 'ar' ? 'text-end' : 'text-start'}
          />
          <p className={`payment-note mt-2 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
            {t.cashNote}
          </p>
        </Card.Body>
      </Card>
    </>
  );
}

export default PaymentMethodForm;