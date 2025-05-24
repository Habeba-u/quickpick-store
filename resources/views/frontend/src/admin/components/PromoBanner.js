import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { LanguageContext } from '../../context/LanguageContext';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';

function PromoBanner() {
    const { language } = useContext(LanguageContext);
    const [formData, setFormData] = useState({
        title_en: '',
        title_ar: '',
        text_en: '',
        text_ar: '',
        button_text_en: '',
        button_text_ar: '',
        button_link: '',
        background_image: null,
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/promo-banner`, {
                    headers: { 'Accept': 'application/json' },
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Failed to fetch settings');
                const data = await response.json();
                const settings = {};

                data.forEach(item => {
                    if (item.key === 'background_image' && item.image) {
                        setPreviewImage(`${process.env.REACT_APP_API_URL}/storage/${item.image}`);
                        settings.background_image = null;
                    } else {
                        settings[item.key] = JSON.parse(item.value);
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

    const handleImageChange = (e) => {
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
            setFormData(prev => ({ ...prev, background_image: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        const requiredFields = [
            'title_en', 'title_ar', 'text_en', 'text_ar',
            'button_text_en', 'button_text_ar', 'button_link'
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
            { key: 'text_en', value: formData.text_en, language: 'en' },
            { key: 'text_ar', value: formData.text_ar, language: 'ar' },
            { key: 'button_text_en', value: formData.button_text_en, language: 'en' },
            { key: 'button_text_ar', value: formData.button_text_ar, language: 'ar' },
            { key: 'button_link', value: formData.button_link, language: 'en' },
        ];

        if (formData.background_image) {
            settings.push({ key: 'background_image', value: 'image', language: 'en' });
        }

        settings.forEach((setting, index) => {
            form.append(`${index}[key]`, setting.key);
            form.append(`${index}[value]`, setting.value);
            form.append(`${index}[language]`, setting.language);
            if (setting.key === 'background_image' && formData.background_image) {
                form.append(`${index}[image]`, formData.background_image);
            }
        });

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/promo-banner`, {
                method: 'POST',
                body: form,
                credentials: 'include',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update settings');
            }
            setMessage(language === 'ar' ? 'تم تحديث الإعدادات بنجاح' : 'Settings updated successfully');

            // Clear the background_image field after successful upload
            setFormData(prev => ({ ...prev, background_image: null }));
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
                        <h2 className={`banner-settings-title ${language === 'ar' ? 'text-end' : 'text-start'} mb-5`}>
                            {language === 'ar' ? 'إعدادات البانر الترويجي' : 'Promotional Banner Settings'}
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

                        <Form onSubmit={handleSubmit} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                            <div className="form-section mb-5">
                                <h4 className="section-title">{language === 'ar' ? 'المحتوى' : 'Content'}</h4>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
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
                                        <Form.Group className="mb-3">
                                            <Form.Label className="banner-settings-label">
                                                {language === 'ar' ? 'النص (إنجليزي)' : 'Text (English)'}
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="text_en"
                                                value={formData.text_en}
                                                onChange={handleChange}
                                                required
                                                className="banner-settings-input"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="banner-settings-label">
                                                {language === 'ar' ? 'نص الزر (إنجليزي)' : 'Button Text (English)'}
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="button_text_en"
                                                value={formData.button_text_en}
                                                onChange={handleChange}
                                                required
                                                className="banner-settings-input"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
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
                                        <Form.Group className="mb-3">
                                            <Form.Label className="banner-settings-label">
                                                {language === 'ar' ? 'النص (عربي)' : 'Text (Arabic)'}
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="text_ar"
                                                value={formData.text_ar}
                                                onChange={handleChange}
                                                required
                                                className="banner-settings-input"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="banner-settings-label">
                                                {language === 'ar' ? 'نص الزر (عربي)' : 'Button Text (Arabic)'}
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="button_text_ar"
                                                value={formData.button_text_ar}
                                                onChange={handleChange}
                                                required
                                                className="banner-settings-input"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label className="banner-settings-label">
                                        {language === 'ar' ? 'رابط الزر' : 'Button Link'}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="button_link"
                                        value={formData.button_link}
                                        onChange={handleChange}
                                        required
                                        className="banner-settings-input"
                                    />
                                </Form.Group>
                            </div>

                            <div className="form-section mb-5">
                                <h4 className="section-title">{language === 'ar' ? 'الصورة الخلفية' : 'Background Image'}</h4>
                                <Form.Group className="mb-4">
                                    <div className="custom-file-upload">
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="banner-settings-file-input"
                                        />
                                    </div>
                                    {previewImage && (
                                        <div className="banner-settings-preview">
                                            <img
                                                src={previewImage}
                                                alt="Background Preview"
                                                className="image-preview"
                                            />
                                        </div>
                                    )}
                                </Form.Group>
                            </div>

                            <Button type="submit" className="banner-settings-submit">
                                {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                            </Button>
                        </Form>
                    </Container>
                </Col>
            </Row>
        </div>
    );
}

export default PromoBanner;
