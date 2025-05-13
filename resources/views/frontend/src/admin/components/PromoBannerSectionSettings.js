import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { LanguageContext } from '../../context/LanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function PromoBannerSectionSettings() {
  const { language } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    promo_banner_image_en: null,
    promo_banner_image_ar: null,
  });
  const [previewImages, setPreviewImages] = useState({
    promo_banner_image_en: null,
    promo_banner_image_ar: null,
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/promo_banner_section`, {
          headers: { 'Accept': 'application/json' },
          credentials: 'include',
        });
        console.log('Fetch promo banner settings response status:', response.status, response.statusText);
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        console.log('Raw promo banner settings:', data);
        const settings = {};
        const previews = { promo_banner_image_en: null, promo_banner_image_ar: null };
        data.forEach(item => {
          if (item.key === 'promo_banner_image_en' && item.image) {
            settings.promo_banner_image_en = item.image;
            previews.promo_banner_image_en = `${process.env.REACT_APP_API_URL}/storage/${item.image}`;
          } else if (item.key === 'promo_banner_image_ar' && item.image) {
            settings.promo_banner_image_ar = item.image;
            previews.promo_banner_image_ar = `${process.env.REACT_APP_API_URL}/storage/${item.image}`;
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

  const handleImageChange = (e, lang) => {
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
      const key = `promo_banner_image_${lang}`;
      setFormData(prev => ({ ...prev, [key]: file }));
      setPreviewImages(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const form = new FormData();
    const settings = [
      { key: 'promo_banner_image_en', value: 'image', language: 'en' },
      { key: 'promo_banner_image_ar', value: 'image', language: 'ar' },
    ];

    settings.forEach((setting, index) => {
      form.append(`${index}[key]`, setting.key);
      form.append(`${index}[value]`, setting.value);
      form.append(`${index}[language]`, setting.language);
      if (formData[setting.key]) {
        form.append(`${index}[image]`, formData[setting.key]);
      }
    });

    console.log('FormData entries:');
    for (let [key, value] of form.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/promo_banner_section`, {
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
        {language === 'ar' ? 'إعدادات قسم البانر الترويجي' : 'Promo Banner Section Settings'}
      </h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'صورة البانر الترويجي (إنجليزي)' : 'Promo Banner Image (English)'}</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'en')}
              />
              {previewImages.promo_banner_image_en && (
                <div className="mt-3">
                  <img
                    src={previewImages.promo_banner_image_en}
                    alt="Promo Banner English Preview"
                    style={{ maxWidth: '300px', height: 'auto' }}
                  />
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>{language === 'ar' ? 'صورة البانر الترويجي (عربي)' : 'Promo Banner Image (Arabic)'}</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'ar')}
              />
              {previewImages.promo_banner_image_ar && (
                <div className="mt-3">
                  <img
                    src={previewImages.promo_banner_image_ar}
                    alt="Promo Banner Arabic Preview"
                    style={{ maxWidth: '300px', height: 'auto' }}
                  />
                </div>
              )}
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

export default PromoBannerSectionSettings;
