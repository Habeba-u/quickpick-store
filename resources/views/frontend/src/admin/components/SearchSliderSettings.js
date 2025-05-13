import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { LanguageContext } from '../../context/LanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function SearchSliderSettings() {
  const { language } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    slide1_title_en: '',
    slide1_title_ar: '',
    slide1_text_en: '',
    slide1_text_ar: '',
    slide1_button_en: '',
    slide1_button_ar: '',
    slide1_image: null,
    slide2_title_en: '',
    slide2_title_ar: '',
    slide2_text_en: '',
    slide2_text_ar: '',
    slide2_button_en: '',
    slide2_button_ar: '',
    slide2_image: null,
    slide3_title_en: '',
    slide3_title_ar: '',
    slide3_text_en: '',
    slide3_text_ar: '',
    slide3_button_en: '',
    slide3_button_ar: '',
    slide3_image: null,
  });
  const [previewImages, setPreviewImages] = useState({ slide1: null, slide2: null, slide3: null });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/search_slider`, {
          headers: { 'Accept': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        console.log('Raw search slider settings:', data); // Debug raw response
        const settings = {};
        const previews = { slide1: null, slide2: null, slide3: null };
        data.forEach(item => {
          if (item.key.includes('image') && item.image) {
            const imgKey = item.key.split('_')[0];
            previews[imgKey] = `${process.env.REACT_APP_API_URL}/storage/${item.image}`;
            settings[`${imgKey}_image`] = item.image;
          } else {
            settings[item.key] = JSON.parse(item.value);
          }
        });
        setFormData(prev => ({ ...prev, ...settings }));
        setPreviewImages(previews);
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

  const handleImageChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)) {
        setError(language === 'ar' ? 'يرجى تحميل صورة بصيغة JPEG، PNG، أو GIF' : 'Please upload an image in JPEG, PNG, or GIF format');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError(language === 'ar' ? 'حجم الصورة يجب ألا يتجاوز 2 ميجابايت' : 'Image size must not exceed 2MB');
        return;
      }
      setFormData(prev => ({ ...prev, [`${key}_image`]: file }));
      setPreviewImages(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Validate required fields
    const requiredFields = [
      'slide1_title_en', 'slide1_title_ar', 'slide1_text_en', 'slide1_text_ar',
      'slide1_button_en', 'slide1_button_ar',
      'slide2_title_en', 'slide2_title_ar', 'slide2_text_en', 'slide2_text_ar',
      'slide2_button_en', 'slide2_button_ar',
      'slide3_title_en', 'slide3_title_ar', 'slide3_text_en', 'slide3_text_ar',
      'slide3_button_en', 'slide3_button_ar',
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
        return;
      }
    }

    const form = new FormData();
    const settings = [
      { key: 'slide1_title_en', value: formData.slide1_title_en, language: 'en' },
      { key: 'slide1_title_ar', value: formData.slide1_title_ar, language: 'ar' },
      { key: 'slide1_text_en', value: formData.slide1_text_en, language: 'en' },
      { key: 'slide1_text_ar', value: formData.slide1_text_ar, language: 'ar' },
      { key: 'slide1_button_en', value: formData.slide1_button_en, language: 'en' },
      { key: 'slide1_button_ar', value: formData.slide1_button_ar, language: 'ar' },
      { key: 'slide1_image', value: 'image', language: 'en' },
      { key: 'slide2_title_en', value: formData.slide2_title_en, language: 'en' },
      { key: 'slide2_title_ar', value: formData.slide2_title_ar, language: 'ar' },
      { key: 'slide2_text_en', value: formData.slide2_text_en, language: 'en' },
      { key: 'slide2_text_ar', value: formData.slide2_text_ar, language: 'ar' },
      { key: 'slide2_button_en', value: formData.slide2_button_en, language: 'en' },
      { key: 'slide2_button_ar', value: formData.slide2_button_ar, language: 'ar' },
      { key: 'slide2_image', value: 'image', language: 'en' },
      { key: 'slide3_title_en', value: formData.slide3_title_en, language: 'en' },
      { key: 'slide3_title_ar', value: formData.slide3_title_ar, language: 'ar' },
      { key: 'slide3_text_en', value: formData.slide3_text_en, language: 'en' },
      { key: 'slide3_text_ar', value: formData.slide3_text_ar, language: 'ar' },
      { key: 'slide3_button_en', value: formData.slide3_button_en, language: 'en' },
      { key: 'slide3_button_ar', value: formData.slide3_button_ar, language: 'ar' },
      { key: 'slide3_image', value: 'image', language: 'en' },
    ];

    settings.forEach((setting, index) => {
      form.append(`${index}[key]`, setting.key);
      form.append(`${index}[value]`, setting.value);
      form.append(`${index}[language]`, setting.language);
      if (setting.key === 'slide1_image' && formData.slide1_image) {
        form.append(`${index}[image]`, formData.slide1_image);
      } else if (setting.key === 'slide2_image' && formData.slide2_image) {
        form.append(`${index}[image]`, formData.slide2_image);
      } else if (setting.key === 'slide3_image' && formData.slide3_image) {
        form.append(`${index}[image]`, formData.slide3_image);
      }
    });

    // Debug FormData
    console.log('FormData entries:');
    for (let [key, value] of form.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/search_slider`, {
        method: 'POST',
        body: form,
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update settings');
      }
      setMessage(language === 'ar' ? 'تم تحديث الإعدادات بنجاح' : 'Settings updated successfully');
    } catch (err) {
      setError(language === 'ar' ? `خطأ في تحديث الإعدادات: ${err.message}` : `Error updating settings: ${err.message}`);
    }
  };

  return (
    <Container className="py-5">
      <h2 className={`mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
        {language === 'ar' ? 'إعدادات شريط التمرير في البحث' : 'Search Slider Settings'}
      </h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {['slide1', 'slide2', 'slide3'].map((slide, index) => (
          <div key={slide}>
            <h4 className="mt-4">{language === 'ar' ? `الشريحة ${index + 1}` : `Slide ${index + 1}`}</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Form.Label>
                  <Form.Control
                    type="text"
                    name={`${slide}_title_en`}
                    value={formData[`${slide}_title_en`]}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Form.Label>
                  <Form.Control
                    type="text"
                    name={`${slide}_title_ar`}
                    value={formData[`${slide}_title_ar`]}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{language === 'ar' ? 'النص (إنجليزي)' : 'Text (English)'}</Form.Label>
                  <Form.Control
                    type="text"
                    name={`${slide}_text_en`}
                    value={formData[`${slide}_text_en`]}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{language === 'ar' ? 'النص (عربي)' : 'Text (Arabic)'}</Form.Label>
                  <Form.Control
                    type="text"
                    name={`${slide}_text_ar`}
                    value={formData[`${slide}_text_ar`]}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{language === 'ar' ? 'نص الزر (إنجليزي)' : 'Button Text (English)'}</Form.Label>
                  <Form.Control
                    type="text"
                    name={`${slide}_button_en`}
                    value={formData[`${slide}_button_en`]}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{language === 'ar' ? 'نص الزر (عربي)' : 'Button Text (Arabic)'}</Form.Label>
                  <Form.Control
                    type="text"
                    name={`${slide}_button_ar`}
                    value={formData[`${slide}_button_ar`]}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{language === 'ar' ? `صورة الشريحة ${index + 1}` : `Slide ${index + 1} Image`}</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, slide)}
                  />
                  {previewImages[slide] && (
                    <div className="mt-3">
                      <img
                        src={previewImages[slide]}
                        alt={`Slide ${index + 1} Preview`}
                        style={{ maxWidth: '300px', height: 'auto' }}
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </div>
        ))}
        <Button type="submit" variant="primary">
          {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
        </Button>
      </Form>
    </Container>
  );
}

export default SearchSliderSettings;
