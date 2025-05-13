import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { LanguageContext } from '../../context/LanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function OffersPageSettings() {
  const { language } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    banner1_title_en: '',
    banner1_title_ar: '',
    banner1_text_en: '',
    banner1_text_ar: '',
    banner1_image: null,
    banner2_title_en: '',
    banner2_title_ar: '',
    banner2_text_en: '',
    banner2_text_ar: '',
    banner2_image: null,
    banner3_title_en: '',
    banner3_title_ar: '',
    banner3_text_en: '',
    banner3_text_ar: '',
    banner3_image: null,
  });
  const [previewImages, setPreviewImages] = useState({ banner1: null, banner2: null, banner3: null });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/offers_page`, {
          headers: { 'Accept': 'application/json' },
          credentials: 'include',
        });
        console.log('Fetch offers page settings response status:', response.status, response.statusText);
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        console.log('Raw offers page settings:', data);
        const settings = {};
        const previews = { banner1: null, banner2: null, banner3: null };
        data.forEach(item => {
          if (item.key.includes('image') && item.image) {
            const bannerKey = item.key.split('_')[1]; // e.g., banner1_image -> banner1
            previews[bannerKey] = `${process.env.REACT_APP_API_URL}/storage/${item.image}`;
            settings[`${bannerKey}_image`] = item.image;
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

  const handleImageChange = (e, banner) => {
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
      setFormData(prev => ({ ...prev, [`${banner}_image`]: file }));
      setPreviewImages(prev => ({ ...prev, [banner]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Validate required fields
    const requiredFields = [
      'banner1_title_en', 'banner1_title_ar', 'banner1_text_en', 'banner1_text_ar',
      'banner2_title_en', 'banner2_title_ar', 'banner2_text_en', 'banner2_text_ar',
      'banner3_title_en', 'banner3_title_ar', 'banner3_text_en', 'banner3_text_ar',
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        console.warn(`Field ${field} is empty`);
        setError(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
        return;
      }
    }

    const form = new FormData();
    const settings = [
      { key: 'banner1_title_en', value: formData.banner1_title_en, language: 'en' },
      { key: 'banner1_title_ar', value: formData.banner1_title_ar, language: 'ar' },
      { key: 'banner1_text_en', value: formData.banner1_text_en, language: 'en' },
      { key: 'banner1_text_ar', value: formData.banner1_text_ar, language: 'ar' },
      { key: 'banner1_image', value: 'image', language: 'en' },
      { key: 'banner2_title_en', value: formData.banner2_title_en, language: 'en' },
      { key: 'banner2_title_ar', value: formData.banner2_title_ar, language: 'ar' },
      { key: 'banner2_text_en', value: formData.banner2_text_en, language: 'en' },
      { key: 'banner2_text_ar', value: formData.banner2_text_ar, language: 'ar' },
      { key: 'banner2_image', value: 'image', language: 'en' },
      { key: 'banner3_title_en', value: formData.banner3_title_en, language: 'en' },
      { key: 'banner3_title_ar', value: formData.banner3_title_ar, language: 'ar' },
      { key: 'banner3_text_en', value: formData.banner3_text_en, language: 'en' },
      { key: 'banner3_text_ar', value: formData.banner3_text_ar, language: 'ar' },
      { key: 'banner3_image', value: 'image', language: 'en' },
    ];

    settings.forEach((setting, index) => {
      form.append(`${index}[key]`, setting.key);
      form.append(`${index}[value]`, setting.value);
      form.append(`${index}[language]`, setting.language);
      if (setting.key === 'banner1_image' && formData.banner1_image) {
        form.append(`${index}[image]`, formData.banner1_image);
      } else if (setting.key === 'banner2_image' && formData.banner2_image) {
        form.append(`${index}[image]`, formData.banner2_image);
      } else if (setting.key === 'banner3_image' && formData.banner3_image) {
        form.append(`${index}[image]`, formData.banner3_image);
      }
    });

    console.log('FormData entries:');
    for (let [key, value] of form.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/offers_page`, {
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
        {language === 'ar' ? 'إعدادات صفحة العروض' : 'Offers Page Settings'}
      </h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <h4 className="mb-3">{language === 'ar' ? 'البانر الأول' : 'Banner 1'}</h4>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="banner1_title_en"
                value={formData.banner1_title_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="banner1_title_ar"
                value={formData.banner1_title_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'النص (إنجليزي)' : 'Text (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="banner1_text_en"
                value={formData.banner1_text_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'النص (عربي)' : 'Text (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="banner1_text_ar"
                value={formData.banner1_text_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-5">
          <Form.Label>{language === 'ar' ? 'صورة البانر الأول' : 'Banner 1 Image'}</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 'banner1')}
          />
          {previewImages.banner1 && (
            <div className="mt-3">
              <img
                src={previewImages.banner1}
                alt="Banner 1 Preview"
                style={{ maxWidth: '300px', height: 'auto' }}
              />
            </div>
          )}
        </Form.Group>

        <h4 className="mb-3">{language === 'ar' ? 'البانر الثاني' : 'Banner 2'}</h4>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="banner2_title_en"
                value={formData.banner2_title_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="banner2_title_ar"
                value={formData.banner2_title_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'النص (إنجليزي)' : 'Text (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="banner2_text_en"
                value={formData.banner2_text_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'النص (عربي)' : 'Text (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="banner2_text_ar"
                value={formData.banner2_text_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-5">
          <Form.Label>{language === 'ar' ? 'صورة البانر الثاني' : 'Banner 2 Image'}</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 'banner2')}
          />
          {previewImages.banner2 && (
            <div className="mt-3">
              <img
                src={previewImages.banner2}
                alt="Banner 2 Preview"
                style={{ maxWidth: '300px', height: 'auto' }}
              />
            </div>
          )}
        </Form.Group>

        <h4 className="mb-3">{language === 'ar' ? 'البانر الثالث' : 'Banner 3'}</h4>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="banner3_title_en"
                value={formData.banner3_title_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="banner3_title_ar"
                value={formData.banner3_title_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'النص (إنجليزي)' : 'Text (English)'}</Form.Label>
              <Form.Control
                type="text"
                name="banner3_text_en"
                value={formData.banner3_text_en}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'النص (عربي)' : 'Text (Arabic)'}</Form.Label>
              <Form.Control
                type="text"
                name="banner3_text_ar"
                value={formData.banner3_text_ar}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-5">
          <Form.Label>{language === 'ar' ? 'صورة البانر الثالث' : 'Banner 3 Image'}</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 'banner3')}
          />
          {previewImages.banner3 && (
            <div className="mt-3">
              <img
                src={previewImages.banner3}
                alt="Banner 3 Preview"
                style={{ maxWidth: '300px', height: 'auto' }}
              />
            </div>
          )}
        </Form.Group>

        <Button type="submit" variant="primary">
          {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
        </Button>
      </Form>
    </Container>
  );
}

export default OffersPageSettings;
