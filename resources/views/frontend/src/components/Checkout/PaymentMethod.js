import React, { useContext, useState } from 'react';
import { Row, Col, Form, Card, Modal, Button, Alert } from 'react-bootstrap';
import { WalletContext } from '../../context/WalletContext';
import { LanguageContext } from '../../context/LanguageContext';

function PaymentMethod({
  paymentMethod,
  setPaymentMethod,
  showCardModal,
  setShowCardModal,
  selectedCard,
  setSelectedCard,
  saveCard,
  setSaveCard,
  cards,
  setCards,
  newCard,
  setNewCard,
  handleSaveCardChange,
  handleCardModalClose,
  handleNewCardChange,
  handleSaveNewCard,
  handleSelectCard,
  totalPrice,
}) {
  const { walletBalance } = useContext(WalletContext);
  const { language } = useContext(LanguageContext);
  const [walletError, setWalletError] = useState('');

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
      wallet: 'QuickPick Wallet (Balance: {balance} EGP)',
      walletError: 'Insufficient wallet balance for this purchase.',
      cashOnDelivery: 'Cash on Delivery',
      cashNote: 'Please prepare the exact amount if possible. +10 EGP cash handling fee',
      selectOrAddCardTitle: 'Select or Add Card',
      savedCards: 'Saved Cards',
      noSavedCards: 'No saved cards found.',
      addNewCard: 'Add New Card',
      cardNumber: 'Card Number *',
      cardNumberPlaceholder: '0000 0000 0000 0000',
      expiryDate: 'Expiry Date *',
      expiryPlaceholder: 'MM/YY',
      cvc: 'CVC *',
      cvcPlaceholder: '123',
      holderName: 'Holder Name *',
      holderNamePlaceholder: 'Cardholder Name',
      cardType: 'Card Type *',
      visa: 'Visa',
      mastercard: 'Mastercard',
      close: 'Close',
      saveCardButton: 'Save Card',
      select: 'Select',
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
      wallet: 'محفظة QuickPick (الرصيد: {balance} ج.م.)',
      walletError: 'رصيد المحفظة غير كافٍ لهذا الشراء.',
      cashOnDelivery: 'الدفع عند الاستلام',
      cashNote: 'يرجى تحضير المبلغ الدقيق إن أمكن. +10 ج.م. رسوم الدفع عند الاستلام',
      selectOrAddCardTitle: 'اختر أو أضف بطاقة',
      savedCards: 'البطاقات المحفوظة',
      noSavedCards: 'لم يتم العثور على بطاقات محفوظة.',
      addNewCard: 'إضافة بطاقة جديدة',
      cardNumber: 'رقم البطاقة *',
      cardNumberPlaceholder: '0000 0000 0000 0000',
      expiryDate: 'تاريخ الانتهاء *',
      expiryPlaceholder: 'MM/YY',
      cvc: 'CVC *',
      cvcPlaceholder: '123',
      holderName: 'اسم حامل البطاقة *',
      holderNamePlaceholder: 'اسم حامل البطاقة',
      cardType: 'نوع البطاقة *',
      visa: 'فيزا',
      mastercard: 'ماستركارد',
      close: 'إغلاق',
      saveCardButton: 'حفظ البطاقة',
      select: 'اختر',
    },
  };

  const t = translations[language];

  // Check if wallet balance is sufficient when selecting wallet payment
  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
    if (value === 'wallet') {
      if (walletBalance < parseFloat(totalPrice)) {
        setWalletError(t.walletError);
      } else {
        setWalletError('');
      }
    } else {
      setWalletError('');
    }
  };

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
            onChange={(e) => handlePaymentMethodChange(e.target.value)}
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
            label={t.wallet.replace('{balance}', walletBalance.toFixed(2))}
            value="wallet"
            checked={paymentMethod === 'wallet'}
            onChange={(e) => handlePaymentMethodChange(e.target.value)}
            className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}
          />
          {paymentMethod === 'wallet' && walletError && (
            <Alert variant="danger" className={language === 'ar' ? 'text-end' : 'text-start'}>
              {walletError}
            </Alert>
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
            onChange={(e) => handlePaymentMethodChange(e.target.value)}
            className={language === 'ar' ? 'text-end' : 'text-start'}
          />
          <p className={`payment-note mt-2 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
            {t.cashNote}
          </p>
        </Card.Body>
      </Card>

      <Modal show={showCardModal} onHide={handleCardModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className={language === 'ar' ? 'text-end w-100' : 'text-start w-100'}>
            {t.selectOrAddCardTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cards.length > 0 ? (
            <>
              <h5 className={language === 'ar' ? 'text-end' : 'text-start'}>{t.savedCards}</h5>
              {cards.map((card) => (
                <Card key={card.id} className="mb-3">
                  <Card.Body>
                    <div className={`d-flex justify-content-between align-items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <div className={language === 'ar' ? 'text-end' : 'text-start'}>
                        <strong>{card.number}</strong>
                        <p>{t.expires} {card.expiry}</p>
                      </div>
                      <Button variant="success" onClick={() => handleSelectCard(card)}>
                        {t.select}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </>
          ) : (
            <p className={language === 'ar' ? 'text-end' : 'text-start'}>{t.noSavedCards}</p>
          )}
          <h5 className={language === 'ar' ? 'text-end' : 'text-start'}>{t.addNewCard}</h5>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className={language === 'ar' ? 'd-block text-end' : ''}>{t.cardNumber}</Form.Label>
              <Form.Control
                type="text"
                name="number"
                value={newCard.number}
                onChange={handleNewCardChange}
                placeholder={t.cardNumberPlaceholder}
                required
                className={language === 'ar' ? 'text-end' : 'text-start'}
              />
            </Form.Group>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className={language === 'ar' ? 'd-block text-end' : ''}>{t.expiryDate}</Form.Label>
                  <Form.Control
                    type="text"
                    name="expiry"
                    value={newCard.expiry}
                    onChange={handleNewCardChange}
                    placeholder={t.expiryPlaceholder}
                    required
                    className={language === 'ar' ? 'text-end' : 'text-start'}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className={language === 'ar' ? 'd-block text-end' : ''}>{t.cvc}</Form.Label>
                  <Form.Control
                    type="text"
                    name="cvc"
                    value={newCard.cvc}
                    onChange={handleNewCardChange}
                    placeholder={t.cvcPlaceholder}
                    required
                    className={language === 'ar' ? 'text-end' : 'text-start'}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className={language === 'ar' ? 'd-block text-end' : ''}>{t.holderName}</Form.Label>
              <Form.Control
                type="text"
                name="holderName"
                value={newCard.holderName}
                onChange={handleNewCardChange}
                placeholder={t.holderNamePlaceholder}
                required
                className={language === 'ar' ? 'text-end' : 'text-start'}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className={language === 'ar' ? 'd-block text-end' : ''}>{t.cardType}</Form.Label>
              <Form.Select
                name="type"
                value={newCard.type}
                onChange={handleNewCardChange}
                required
                className={language === 'ar' ? 'text-end' : 'text-start'}
              >
                <option value="Visa">{t.visa}</option>
                <option value="Mastercard">{t.mastercard}</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className={language === 'ar' ? 'flex-row-reverse' : ''}>
          <Button variant="secondary" onClick={handleCardModalClose}>
            {t.close}
          </Button>
          <Button variant="success" onClick={handleSaveNewCard}>
            {t.saveCardButton}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PaymentMethod;