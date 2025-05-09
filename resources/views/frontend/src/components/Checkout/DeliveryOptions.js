import React, { useContext } from 'react';
import { Row, Col, Form, Modal, Button } from 'react-bootstrap';
import { LanguageContext } from '../../context/LanguageContext';

function DeliveryOptions({
  instantDelivery,
  setInstantDelivery,
  scheduleDelivery,
  setScheduleDelivery,
  showScheduleModal,
  setShowScheduleModal,
  deliveryDate,
  setDeliveryDate,
  deliveryTime,
  setDeliveryTime,
  deliveryInstructions,
  setDeliveryInstructions,
  handleInstantDeliveryChange,
  handleScheduleDeliveryChange,
  handleModalClose,
  handleModalSave,
}) {
  const { language } = useContext(LanguageContext);

  // Translations
  const translations = {
    en: {
      instantDelivery: 'Instant delivery',
      scheduleDelivery: 'Delivery schedule',
      scheduleDeliveryTitle: 'Schedule Delivery',
      selectDeliveryDate: 'Select Delivery Date',
      earliestAvailable: 'Earliest Available',
      holidaysDisabled: 'Holidays disabled',
      selectTimeSlot: 'Select Time Slot',
      deliveryAnytime: 'on Delivery anytime on selected day',
      flexibilityNote: 'This option allows for flexibility in delivery timing.',
      deliveryInstructions: 'Delivery Instructions',
      deliveryInstructionsPlaceholder: 'Leave at door, Call when arriving',
      close: 'Close',
      save: 'Save',
      timeSlots: [
        'on 9:00 AM - 12:00 PM',
        'on 12:00 PM - 3:00 PM',
        'on 3:00 PM - 6:00 PM',
        'on 6:00 PM - 9:00 PM',
      ],
    },
    ar: {
      instantDelivery: 'توصيل فوري',
      scheduleDelivery: 'جدولة التوصيل',
      scheduleDeliveryTitle: 'جدولة التوصيل',
      selectDeliveryDate: 'اختر تاريخ التوصيل',
      earliestAvailable: 'أقرب وقت متاح',
      holidaysDisabled: 'الإجازات معطلة',
      selectTimeSlot: 'اختر فترة زمنية',
      deliveryAnytime: 'توصيل في أي وقت في اليوم المحدد',
      flexibilityNote: 'هذا الخيار يسمح بالمرونة في توقيت التوصيل.',
      deliveryInstructions: 'تعليمات التوصيل',
      deliveryInstructionsPlaceholder: 'اترك عند الباب، اتصل عند الوصول',
      close: 'إغلاق',
      save: 'حفظ',
      timeSlots: [
        'من 9:00 صباحًا - 12:00 ظهرًا',
        'من 12:00 ظهرًا - 3:00 عصرًا',
        'من 3:00 عصرًا - 6:00 مساءً',
        'من 6:00 مساءً - 9:00 مساءً',
      ],
    },
  };

  const t = translations[language];

  return (
    <>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Check
            type="checkbox"
            label={t.instantDelivery}
            checked={instantDelivery}
            onChange={handleInstantDeliveryChange}
            className={language === 'ar' ? 'text-end' : 'text-start'}
          />
        </Col>
        <Col md={6}>
          <Form.Check
            type="checkbox"
            label={t.scheduleDelivery}
            checked={scheduleDelivery}
            onChange={handleScheduleDeliveryChange}
            className={language === 'ar' ? 'text-end' : 'text-start'}
          />
        </Col>
      </Row>

      <Modal show={showScheduleModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className={language === 'ar' ? 'text-end w-100' : 'text-start w-100'}>
            {t.scheduleDeliveryTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="deliveryDate">
                <Form.Label className={language === 'ar' ? 'd-block text-end' : ''}>
                  {t.selectDeliveryDate}
                </Form.Label>
                <Form.Control
                  as="select"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className={language === 'ar' ? 'text-end' : 'text-start'}
                >
                  <option>{t.earliestAvailable}</option>
                  <option disabled>{t.holidaysDisabled}</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Label className={language === 'ar' ? 'd-block text-end' : ''}>
                {t.selectTimeSlot}
              </Form.Label>
              <div className={language === 'ar' ? 'text-end' : 'text-start'}>
                {t.timeSlots.map((slot) => (
                  <Form.Check
                    key={slot}
                    type="radio"
                    name="deliveryTime"
                    label={slot}
                    value={slot}
                    checked={deliveryTime === slot}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="mb-2"
                  />
                ))}
              </div>
            </Col>
          </Row>
          <p className={language === 'ar' ? 'text-end' : 'text-start'}>
            {t.deliveryAnytime} <br />
            {t.flexibilityNote}
          </p>
          <Form.Group controlId="deliveryInstructions">
            <Form.Label className={language === 'ar' ? 'd-block text-end' : ''}>
              {t.deliveryInstructions}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={t.deliveryInstructionsPlaceholder}
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              className={language === 'ar' ? 'text-end' : 'text-start'}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className={language === 'ar' ? 'flex-row-reverse' : ''}>
          <Button variant="secondary" onClick={handleModalClose}>
            {t.close}
          </Button>
          <Button variant="success" onClick={handleModalSave}>
            {t.save}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeliveryOptions;