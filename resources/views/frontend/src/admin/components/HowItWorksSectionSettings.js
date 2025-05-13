import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { LanguageContext } from '../../context/LanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function HowItWorksSectionSettings() {
  const { language } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    section_title_en: '',
    section_title_ar: '',
    tab1_en: '',
    tab1_ar: '',
    tab2_en: '',
    tab2_ar: '',
    tab3_en: '',
    tab3_ar: '',
    tab4_en: '',
    tab4_ar: '',
    tab5_en: '',
    tab5_ar: '',
    variant1_card1_title_en: '',
    variant1_card1_title_ar: '',
    variant1_card1_subtitle_en: '',
    variant1_card1_subtitle_ar: '',
    variant1_card2_title_en: '',
    variant1_card2_title_ar: '',
    variant1_card2_subtitle_en: '',
    variant1_card2_subtitle_ar: '',
    variant1_card3_title_en: '',
    variant1_card3_title_ar: '',
    variant1_card3_subtitle_en: '',
    variant1_card3_subtitle_ar: '',
    variant1_description_en: '',
    variant1_description_ar: '',
    variant2_card1_title_en: '',
    variant2_card1_title_ar: '',
    variant2_card1_subtitle_en: '',
    variant2_card1_subtitle_ar: '',
    variant2_card2_title_en: '',
    variant2_card2_title_ar: '',
    variant2_card2_subtitle_en: '',
    variant2_card2_subtitle_ar: '',
    variant2_card3_title_en: '',
    variant2_card3_title_ar: '',
    variant2_card3_subtitle_en: '',
    variant2_card3_subtitle_ar: '',
    variant2_description_en: '',
    variant2_description_ar: '',
    variant3_card1_title_en: '',
    variant3_card1_title_ar: '',
    variant3_card1_subtitle_en: '',
    variant3_card1_subtitle_ar: '',
    variant3_card2_title_en: '',
    variant3_card2_title_ar: '',
    variant3_card2_subtitle_en: '',
    variant3_card2_subtitle_ar: '',
    variant3_card3_title_en: '',
    variant3_card3_title_ar: '',
    variant3_card3_subtitle_en: '',
    variant3_card3_subtitle_ar: '',
    variant3_description_en: '',
    variant3_description_ar: '',
    variant4_title_en: '',
    variant4_title_ar: '',
    variant4_description_en: '',
    variant4_description_ar: '',
    variant4_description_below_en: '',
    variant4_description_below_ar: '',
    variant5_title_en: '',
    variant5_title_ar: '',
    variant5_description_en: '',
    variant5_description_ar: '',
    variant5_description_below_en: '',
    variant5_description_below_ar: '',
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/how_it_works_section`, {
          headers: { 'Accept': 'application/json' },
          credentials: 'include',
        });
        console.log('Fetch how it works settings response status:', response.status, response.statusText);
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        console.log('Raw how it works settings:', data);
        const settings = {};
        data.forEach(item => {
          try {
            settings[item.key] = JSON.parse(item.value);
          } catch (e) {
            console.error(`Failed to parse value for ${item.key}:`, item.value);
          }
        });
        setFormData(prev => ({ ...prev, ...settings }));
      } catch (err) {
        setError(language === 'ar' ? 'خطأ في تحميل الإعدادات' : 'Error loading settings');
      }
    };
    fetchSettings();
  }, [language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Validate required fields
    const requiredFields = Object.keys(formData);
    for (const field of requiredFields) {
      if (!formData[field]) {
        console.warn(`Field ${field} is empty`);
        setError(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
        return;
      }
    }

    const form = new FormData();
    const settings = Object.keys(formData).map((key) => ({
      key,
      value: formData[key],
      language: key.endsWith('_en') ? 'en' : 'ar',
    }));

    settings.forEach((setting, index) => {
      form.append(`${index}[key]`, setting.key);
      form.append(`${index}[value]`, setting.value);
      form.append(`${index}[language]`, setting.language);
    });

    console.log('FormData entries:');
    for (let [key, value] of form.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/how_it_works_section`, {
        method: 'POST',
        body: form,
        credentials: 'include',
      });
      console.log('Submit response status:', response.status, response.statusText);
      const responseData = await response.json();
      console.log('Submit response data:', responseData);
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update settings');
      }
      setMessage(language === 'ar' ? 'تم تحديث الإعدادات بنجاح' : 'Settings updated successfully');
    } catch (err) {
      console.error('Submit error:', err);
      setError(language === 'ar' ? `خطأ في تحديث الإعدادات: ${err.message}` : `Error updating settings: ${err.message}`);
    }
  };

  return (
    <Container className="py-5">
      <h2 className={`mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
        {language === 'ar' ? 'إعدادات قسم كيفية العمل' : 'How It Works Section Settings'}
      </h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <h4 className="mb-3">{language === 'ar' ? 'العنوان الرئيسي' : 'Section Title'}</h4>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="section_title_en"
                value={formData.section_title_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="section_title_ar"
                value={formData.section_title_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <h4 className="mb-3">{language === 'ar' ? 'عناوين علامات التبويب' : 'Tab Titles'}</h4>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'علامة التبويب 1 (إنجليزي)' : 'Tab 1 (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="tab1_en"
                value={formData.tab1_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'علامة التبويب 1 (عربي)' : 'Tab 1 (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="tab1_ar"
                value={formData.tab1_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'علامة التبويب 2 (إنجليزي)' : 'Tab 2 (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="tab2_en"
                value={formData.tab2_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'علامة التبويب 2 (عربي)' : 'Tab 2 (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="tab2_ar"
                value={formData.tab2_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'علامة التبويب 3 (إنجليزي)' : 'Tab 3 (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="tab3_en"
                value={formData.tab3_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'علامة التبويب 3 (عربي)' : 'Tab 3 (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="tab3_ar"
                value={formData.tab3_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'علامة التبويب 4 (إنجليزي)' : 'Tab 4 (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="tab4_en"
                value={formData.tab4_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'علامة التبويب 4 (عربي)' : 'Tab 4 (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="tab4_ar"
                value={formData.tab4_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'علامة التبويب 5 (إنجليزي)' : 'Tab 5 (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="tab5_en"
                value={formData.tab5_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'علامة التبويب 5 (عربي)' : 'Tab 5 (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="tab5_ar"
                value={formData.tab5_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <h4 className="mb-3">{language === 'ar' ? 'علامة التبويب 1 - كيف يعمل QuickPick' : 'Tab 1 - How QuickPick Works'}</h4>
        <h5>{language === 'ar' ? 'البطاقة 1' : 'Card 1'}</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant1_card1_title_en"
                value={formData.variant1_card1_title_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant1_card1_title_ar"
                value={formData.variant1_card1_title_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (إنجليزي)' : 'Subtitle (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant1_card1_subtitle_en"
                value={formData.variant1_card1_subtitle_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (عربي)' : 'Subtitle (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant1_card1_subtitle_ar"
                value={formData.variant1_card1_subtitle_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <h5>{language === 'ar' ? 'البطاقة 2' : 'Card 2'}</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant1_card2_title_en"
                value={formData.variant1_card2_title_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant1_card2_title_ar"
                value={formData.variant1_card2_title_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (إنجليزي)' : 'Subtitle (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant1_card2_subtitle_en"
                value={formData.variant1_card2_subtitle_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (عربي)' : 'Subtitle (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant1_card2_subtitle_ar"
                value={formData.variant1_card2_subtitle_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <h5>{language === 'ar' ? 'البطاقة 3' : 'Card 3'}</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant1_card3_title_en"
                value={formData.variant1_card3_title_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant1_card3_title_ar"
                value={formData.variant1_card3_title_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (إنجليزي)' : 'Subtitle (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant1_card3_subtitle_en"
                value={formData.variant1_card3_subtitle_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (عربي)' : 'Subtitle (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant1_card3_subtitle_ar"
                value={formData.variant1_card3_subtitle_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="variant1_description_en"
                value={formData.variant1_description_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-5">
              <Form.Label>{language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="variant1_description_ar"
                value={formData.variant1_description_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <h4 className="mb-3">{language === 'ar' ? 'علامة التبويب 2 - طرق الدفع' : 'Tab 2 - Payment Methods'}</h4>
        <h5>{language === 'ar' ? 'البطاقة 1' : 'Card 1'}</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant2_card1_title_en"
                value={formData.variant2_card1_title_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant2_card1_title_ar"
                value={formData.variant2_card1_title_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (إنجليزي)' : 'Subtitle (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant2_card1_subtitle_en"
                value={formData.variant2_card1_subtitle_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (عربي)' : 'Subtitle (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant2_card1_subtitle_ar"
                value={formData.variant2_card1_subtitle_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <h5>{language === 'ar' ? 'البطاقة 2' : 'Card 2'}</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant2_card2_title_en"
                value={formData.variant2_card2_title_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant2_card2_title_ar"
                value={formData.variant2_card2_title_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (إنجليزي)' : 'Subtitle (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant2_card2_subtitle_en"
                value={formData.variant2_card2_subtitle_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (عربي)' : 'Subtitle (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant2_card2_subtitle_ar"
                value={formData.variant2_card2_subtitle_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <h5>{language === 'ar' ? 'البطاقة 3' : 'Card 3'}</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant2_card3_title_en"
                value={formData.variant2_card3_title_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant2_card3_title_ar"
                value={formData.variant2_card3_title_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (إنجليزي)' : 'Subtitle (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant2_card3_subtitle_en"
                value={formData.variant2_card3_subtitle_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (عربي)' : 'Subtitle (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant2_card3_subtitle_ar"
                value={formData.variant2_card3_subtitle_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="variant2_description_en"
                value={formData.variant2_description_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-5">
              <Form.Label>{language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="variant2_description_ar"
                value={formData.variant2_description_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <h4 className="mb-3">{language === 'ar' ? 'علامة التبويب 3 - تتبع الطلب' : 'Tab 3 - Order Tracking'}</h4>
        <h5>{language === 'ar' ? 'البطاقة 1' : 'Card 1'}</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant3_card1_title_en"
                value={formData.variant3_card1_title_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant3_card1_title_ar"
                value={formData.variant3_card1_title_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (إنجليزي)' : 'Subtitle (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant3_card1_subtitle_en"
                value={formData.variant3_card1_subtitle_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (عربي)' : 'Subtitle (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant3_card1_subtitle_ar"
                value={formData.variant3_card1_subtitle_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <h5>{language === 'ar' ? 'البطاقة 2' : 'Card 2'}</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant3_card2_title_en"
                value={formData.variant3_card2_title_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant3_card2_title_ar"
                value={formData.variant3_card2_title_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (إنجليزي)' : 'Subtitle (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant3_card2_subtitle_en"
                value={formData.variant3_card2_subtitle_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (عربي)' : 'Subtitle (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant3_card2_subtitle_ar"
                value={formData.variant3_card2_subtitle_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <h5>{language === 'ar' ? 'البطاقة 3' : 'Card 3'}</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant3_card3_title_en"
                value={formData.variant3_card3_title_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant3_card3_title_ar"
                value={formData.variant3_card3_title_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (إنجليزي)' : 'Subtitle (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant3_card3_subtitle_en"
                value={formData.variant3_card3_subtitle_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان الفرعي (عربي)' : 'Subtitle (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant3_card3_subtitle_ar"
                value={formData.variant3_card3_subtitle_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="variant3_description_en"
                value={formData.variant3_description_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-5">
              <Form.Label>{language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="variant3_description_ar"
                value={formData.variant3_description_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <h4 className="mb-3">{language === 'ar' ? 'علامة التبويب 4 - الخصومات' : 'Tab 4 - Discounts'}</h4>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant4_title_en"
                value={formData.variant4_title_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant4_title_ar"
                value={formData.variant4_title_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="variant4_description_en"
                value={formData.variant4_description_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="variant4_description_ar"
                value={formData.variant4_description_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'الوصف السفلي (إنجليزي)' : 'Description Below (English)'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="variant4_description_below_en"
                value={formData.variant4_description_below_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-5">
              <Form.Label>{language === 'ar' ? 'الوصف السفلي (عربي)' : 'Description Below (Arabic)'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="variant4_description_below_ar"
                value={formData.variant4_description_below_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <h4 className="mb-3">{language === 'ar' ? 'علامة التبويب 5 - التوفر' : 'Tab 5 - Availability'}</h4>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant5_title_en"
                value={formData.variant5_title_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="variant5_title_ar"
                value={formData.variant5_title_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="variant5_description_en"
                value={formData.variant5_description_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="variant5_description_ar"
                value={formData.variant5_description_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'الوصف السفلي (إنجليزي)' : 'Description Below (English)'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="variant5_description_below_en"
                value={formData.variant5_description_below_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-5">
              <Form.Label>{language === 'ar' ? 'الوصف السفلي (عربي)' : 'Description Below (Arabic)'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="variant5_description_below_ar"
                value={formData.variant5_description_below_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="primary">
          {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
        </Button>
      </Form>
    </Container>
  );
}

export default HowItWorksSectionSettings;
