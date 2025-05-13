import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { LanguageContext } from '../../context/LanguageContext';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';

function BannerSettings() {
  const { language } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    subtitle_en: '',
    subtitle_ar: '',
    placeholder_en: '',
    placeholder_ar: '',
    button_en: '',
    button_ar: '',
    image_en: null,
    image_ar: null,
  });
  const [previewImages, setPreviewImages] = useState({ en: null, ar: null });
  const [existingImages, setExistingImages] = useState({ en: null, ar: null }); // Store existing image URLs
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/banner`, {
          headers: { 'Accept': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch banner settings');
        const data = await response.json();
        const settings = {
          title_en: '',
          title_ar: '',
          subtitle_en: '',
          subtitle_ar: '',
          placeholder_en: '',
          placeholder_ar: '',
          button_en: '',
          button_ar: '',
          image_en: null,
          image_ar: null,
        };
        const existing = { en: null, ar: null };
        data.forEach(item => {
          if (item.key === 'banner_image_en' && item.image) {
            const imageUrl = `${process.env.REACT_APP_API_URL}/storage/${item.image}`;
            settings.image_en = null; // We don't store the image file in formData
            existing.en = imageUrl;
            setPreviewImages(prev => ({ ...prev, en: imageUrl }));
          } else if (item.key === 'banner_image_ar' && item.image) {
            const imageUrl = `${process.env.REACT_APP_API_URL}/storage/${item.image}`;
            settings.image_ar = null;
            existing.ar = imageUrl;
            setPreviewImages(prev => ({ ...prev, ar: imageUrl }));
          } else {
            settings[item.key] = JSON.parse(item.value);
          }
        });
        setFormData(prev => ({ ...prev, ...settings }));
        setExistingImages(existing);
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
      setFormData(prev => ({ ...prev, [`image_${lang}`]: file }));
      setPreviewImages(prev => ({ ...prev, [lang]: URL.createObjectURL(file) }));
    }
  };

  const clearImage = (lang) => {
    setFormData(prev => ({ ...prev, [`image_${lang}`]: null }));
    setPreviewImages(prev => ({ ...prev, [lang]: existingImages[lang] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const requiredFields = [
      'title_en', 'title_ar', 'subtitle_en', 'subtitle_ar',
      'placeholder_en', 'placeholder_ar', 'button_en', 'button_ar'
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
        return;
      }
    }

    const form = new FormData();
    const settings = [
      { key: 'title_en', value: formData.title_en, language: 'en' },
      { key: 'title_ar', value: formData.title_ar, language: 'ar' },
      { key: 'subtitle_en', value: formData.subtitle_en, language: 'en' },
      { key: 'subtitle_ar', value: formData.subtitle_ar, language: 'ar' },
      { key: 'placeholder_en', value: formData.placeholder_en, language: 'en' },
      { key: 'placeholder_ar', value: formData.placeholder_ar, language: 'ar' },
      { key: 'button_en', value: formData.button_en, language: 'en' },
      { key: 'button_ar', value: formData.button_ar, language: 'ar' },
    ];

    // Only include image settings if a new image is uploaded
    if (formData.image_en) {
      settings.push({ key: 'banner_image_en', value: 'image', language: 'en' });
    }
    if (formData.image_ar) {
      settings.push({ key: 'banner_image_ar', value: 'image', language: 'ar' });
    }

    settings.forEach((setting, index) => {
      form.append(`${index}[key]`, setting.key);
      form.append(`${index}[value]`, setting.value);
      form.append(`${index}[language]`, setting.language);
      if (setting.key === 'banner_image_en' && formData.image_en) {
        form.append(`${index}[image]`, formData.image_en);
      } else if (setting.key === 'banner_image_ar' && formData.image_ar) {
        form.append(`${index}[image]`, formData.image_ar);
      }
    });

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/banner`, {
        method: 'POST',
        body: form,
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update settings');
      }
      setMessage(language === 'ar' ? 'تم تحديث الإعدادات بنجاح' : 'Settings updated successfully');

      // After successful save, update existingImages with the new URLs if new images were uploaded
      const updatedExistingImages = { ...existingImages };
      if (formData.image_en) {
        updatedExistingImages.en = previewImages.en;
      }
      if (formData.image_ar) {
        updatedExistingImages.ar = previewImages.ar;
      }
      setExistingImages(updatedExistingImages);

      // Clear the formData image fields to prevent re-sending the same image on the next submit
      setFormData(prev => ({
        ...prev,
        image_en: null,
        image_ar: null,
      }));
    } catch (err) {
      setError(language === 'ar' ? `خطأ في تحديث الإعدادات: ${err.message}` : `Error updating settings: ${err.message}`);
    }
  };

  return (
    <div className="banner-settings-wrapper">
      <Row className="g-0">
        <Col md={3}>
          <Sidebar />
        </Col>
        <Col md={9}>
          <Container fluid className="py-5 main-content">
            <h2 className={`banner-settings-title mb-5 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              {language === 'ar' ? 'إعدادات البانر' : 'Banner Settings'}
            </h2>

            {message && (
              <Alert variant="success" className="banner-settings-alert">
                {message}
              </Alert>
            )}
            {error && (
              <Alert variant="danger" className="banner-settings-alert">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} dir={language === 'ar' ? 'rtl' : 'ltr'} className="banner-settings-form">
              <div className="form-section mb-5">
                <h4 className={`section-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                  {language === 'ar' ? 'النصوص' : 'Text Content'}
                </h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="banner-settings-label">
                        {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="title_en"
                        value={formData.title_en}
                        onChange={handleChange}
                        required
                        className="banner-settings-input"
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label className="banner-settings-label">
                        {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="title_ar"
                        value={formData.title_ar}
                        onChange={handleChange}
                        required
                        className="banner-settings-input"
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label className="banner-settings-label">
                        {language === 'ar' ? 'النص الفرعي (إنجليزي)' : 'Subtitle (English)'}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="subtitle_en"
                        value={formData.subtitle_en}
                        onChange={handleChange}
                        required
                        className="banner-settings-input"
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label className="banner-settings-label">
                        {language === 'ar' ? 'النص الفرعي (عربي)' : 'Subtitle (Arabic)'}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="subtitle_ar"
                        value={formData.subtitle_ar}
                        onChange={handleChange}
                        required
                        className="banner-settings-input"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="banner-settings-label">
                        {language === 'ar' ? 'نص العنصر النائب (إنجليزي)' : 'Placeholder (English)'}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="placeholder_en"
                        value={formData.placeholder_en}
                        onChange={handleChange}
                        required
                        className="banner-settings-input"
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label className="banner-settings-label">
                        {language === 'ar' ? 'نص العنصر النائب (عربي)' : 'Placeholder (Arabic)'}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="placeholder_ar"
                        value={formData.placeholder_ar}
                        onChange={handleChange}
                        required
                        className="banner-settings-input"
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label className="banner-settings-label">
                        {language === 'ar' ? 'نص الزر (إنجليزي)' : 'Button Text (English)'}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="button_en"
                        value={formData.button_en}
                        onChange={handleChange}
                        required
                        className="banner-settings-input"
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label className="banner-settings-label">
                        {language === 'ar' ? 'نص الزر (عربي)' : 'Button Text (Arabic)'}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="button_ar"
                        value={formData.button_ar}
                        onChange={handleChange}
                        required
                        className="banner-settings-input"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="form-section mb-5">
                <h4 className={`section-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                  {language === 'ar' ? 'صور الخلفية' : 'Background Images'}
                </h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="banner-settings-label">
                        {language === 'ar' ? 'صورة الخلفية (إنجليزي)' : 'Background Image (English)'}
                      </Form.Label>
                      <div className="custom-file-upload">
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'en')}
                          className="banner-settings-file-input"
                          id="image_en"
                        />
                        <label htmlFor="image_en" className="banner-settings-file-label">
                          {language === 'ar' ? 'اختر صورة' : 'Choose Image'}
                        </label>
                      </div>
                      {previewImages.en && (
                        <div className="banner-settings-preview mt-3">
                          <img
                            src={previewImages.en}
                            alt="English Preview"
                            className="img-fluid rounded"
                          />
                          {formData.image_en && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="mt-2"
                              onClick={() => clearImage('en')}
                            >
                              {language === 'ar' ? 'إلغاء الصورة' : 'Clear Image'}
                            </Button>
                          )}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="banner-settings-label">
                        {language === 'ar' ? 'صورة الخلفية (عربي)' : 'Background Image (Arabic)'}
                      </Form.Label>
                      <div className="custom-file-upload">
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'ar')}
                          className="banner-settings-file-input"
                          id="image_ar"
                        />
                        <label htmlFor="image_ar" className="banner-settings-file-label">
                          {language === 'ar' ? 'اختر صورة' : 'Choose Image'}
                        </label>
                      </div>
                      {previewImages.ar && (
                        <div className="banner-settings-preview mt-3">
                          <img
                            src={previewImages.ar}
                            alt="Arabic Preview"
                            className="img-fluid rounded"
                          />
                          {formData.image_ar && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="mt-2"
                              onClick={() => clearImage('ar')}
                            >
                              {language === 'ar' ? 'إلغاء الصورة' : 'Clear Image'}
                            </Button>
                          )}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <Button type="submit" variant="primary" className="banner-settings-submit">
                {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
              </Button>
            </Form>
          </Container>
        </Col>
      </Row>
    </div>
  );
}

export default BannerSettings;
