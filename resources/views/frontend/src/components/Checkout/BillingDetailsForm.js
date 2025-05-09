import React, { useEffect, useContext } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { LanguageContext } from '../../context/LanguageContext';

function BillingDetailsForm({ billingDetails, setBillingDetails, handleBillingChange, user }) {
  const { language } = useContext(LanguageContext);

  const translations = {
    en: {
      title: 'Billing Details',
      usingAccountDetails: 'Using account details for {email}. You can edit the fields below if needed.',
      firstName: 'First Name*',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
    },
    ar: {
      title: 'تفاصيل الفوترة',
      usingAccountDetails: 'استخدام تفاصيل الحساب لـ {email}. يمكنك تعديل الحقول أدناه إذا لزم الأمر.',
      firstName: 'الاسم الأول*',
      lastName: 'الاسم الأخير',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
    },
  };

  const t = translations[language];

  // Prefill billing details with user account information if available
  useEffect(() => {
    if (user) {
      setBillingDetails({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || billingDetails.phone || '',
      });
    }
  }, [user, setBillingDetails]);

  return (
    <>
      <h2 className={`section-title mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
        {t.title}
      </h2>
      {user && (
        <p className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
          {t.usingAccountDetails.replace('{email}', user.email)}
        </p>
      )}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="firstName">
            <Form.Control
              type="text"
              name="firstName"
              placeholder={t.firstName}
              value={billingDetails.firstName}
              onChange={handleBillingChange}
              required
              className={language === 'ar' ? 'text-end' : 'text-start'}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="lastName">
            <Form.Control
              type="text"
              name="lastName"
              placeholder={t.lastName}
              value={billingDetails.lastName}
              onChange={handleBillingChange}
              className={language === 'ar' ? 'text-end' : 'text-start'}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group controlId="email" className="mb-3">
        <Form.Control
          type="email"
          name="email"
          placeholder={t.email}
          value={billingDetails.email}
          onChange={handleBillingChange}
          className={language === 'ar' ? 'text-end' : 'text-start'}
        />
      </Form.Group>
      <Form.Group controlId="phone" className="mb-3">
        <Form.Control
          type="tel"
          name="phone"
          placeholder={t.phone}
          value={billingDetails.phone}
          onChange={handleBillingChange}
          className={language === 'ar' ? 'text-end' : 'text-start'}
        />
      </Form.Group>
    </>
  );
}

export default BillingDetailsForm;
