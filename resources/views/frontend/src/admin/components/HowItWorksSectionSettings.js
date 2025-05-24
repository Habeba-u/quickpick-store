import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { LanguageContext } from '../../context/LanguageContext';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';

function HowItWorksSectionSettings() {
    const { language } = useContext(LanguageContext);
    const [formData, setFormData] = useState({
        title_en: '',
        title_ar: '',
        subtitle_en: '',
        subtitle_ar: '',
        step1_title_en: '',
        step1_title_ar: '',
        step1_text_en: '',
        step1_text_ar: '',
        step1_image: null,
        step2_title_en: '',
        step2_title_ar: '',
        step2_text_en: '',
        step2_text_ar: '',
        step2_image: null,
        step3_title_en: '',
        step3_title_ar: '',
        step3_text_en: '',
        step3_text_ar: '',
        step3_image: null,
    });
    const [previewImages, setPreviewImages] = useState({ step1: null, step2: null, step3: null });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/how-it-works`, {
                    headers: { 'Accept': 'application/json' },
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Failed to fetch settings');
                const data = await response.json();
                const settings = {};
                const previews = { step1: null, step2: null, step3: null };

                data.forEach(item => {
                    if (item.key.includes('image') && item.image) {
                        const stepKey = item.key.split('_')[0]; // e.g., step1_image -> step1
                        previews[stepKey] = `${process.env.REACT_APP_API_URL}/storage/${item.image}`;
                        settings[`${stepKey}_image`] = item.image;
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

    const handleImageChange = (e, step) => {
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
            setFormData(prev => ({ ...prev, [`${step}_image`]: file }));
            setPreviewImages(prev => ({ ...prev, [step]: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        const requiredFields = [
            'title_en', 'title_ar', 'subtitle_en', 'subtitle_ar',
            'step1_title_en', 'step1_title_ar', 'step1_text_en', 'step1_text_ar',
            'step2_title_en', 'step2_title_ar', 'step2_text_en', 'step2_text_ar',
            'step3_title_en', 'step3_title_ar', 'step3_text_en', 'step3_text_ar',
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
            { key: 'step1_title_en', value: formData.step1_title_en, language: 'en' },
            { key: 'step1_title_ar', value: formData.step1_title_ar, language: 'ar' },
            { key: 'step1_text_en', value: formData.step1_text_en, language: 'en' },
            { key: 'step1_text_ar', value: formData.step1_text_ar, language: 'ar' },
            { key: 'step2_title_en', value: formData.step2_title_en, language: 'en' },
            { key: 'step2_title_ar', value: formData.step2_title_ar, language: 'ar' },
            { key: 'step2_text_en', value: formData.step2_text_en, language: 'en' },
            { key: 'step2_text_ar', value: formData.step2_text_ar, language: 'ar' },
            { key: 'step3_title_en', value: formData.step3_title_en, language: 'en' },
            { key: 'step3_title_ar', value: formData.step3_title_ar, language: 'ar' },
            { key: 'step3_text_en', value: formData.step3_text_en, language: 'en' },
            { key: 'step3_text_ar', value: formData.step3_text_ar, language: 'ar' },
        ];

        if (formData.step1_image) settings.push({ key: 'step1_image', value: 'image', language: 'en' });
        if (formData.step2_image) settings.push({ key: 'step2_image', value: 'image', language: 'en' });
        if (formData.step3_image) settings.push({ key: 'step3_image', value: 'image', language: 'en' });

        settings.forEach((setting, index) => {
            form.append(`${index}[key]`, setting.key);
            form.append(`${index}[value]`, setting.value);
            form.append(`${index}[language]`, setting.language);
            if (setting.key === 'step1_image' && formData.step1_image) {
                form.append(`${index}[image]`, formData.step1_image);
            } else if (setting.key === 'step2_image' && formData.step2_image) {
                form.append(`${index}[image]`, formData.step2_image);
            } else if (setting.key === 'step3_image' && formData.step3_image) {
                form.append(`${index}[image]`, formData.step3_image);
            }
        });

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/how-it-works`, {
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
        <div className="banner-settings-wrapper">
            <Row className="g-0">
                <Col md={3}>
                    <Sidebar />
                </Col>
                <Col md={9}>
                    <Container fluid className="py-5 main-content">
                        <h2 className={`banner-settings-title ${language === 'ar' ? 'text-end' : 'text-start'} mb-5`}>
                            {language === 'ar' ? 'إعدادات قسم كيف يعمل' : 'How It Works Section Settings'}
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
                                <h4 className="section-title">{language === 'ar' ? 'العنوان الرئيسي' : 'Main Title'}</h4>
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
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="banner-settings-label">
                                                {language === 'ar' ? 'العنوان الفرعي (إنجليزي)' : 'Subtitle (English)'}
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
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="banner-settings-label">
                                                {language === 'ar' ? 'العنوان الفرعي (عربي)' : 'Subtitle (Arabic)'}
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
                                </Row>
                            </div>

                            <div className="form-section mb-5">
                                <h4 className="section-title">{language === 'ar' ? 'الخطوة الأولى' : 'Step 1'}</h4>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="banner-settings-label">
                                                {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="step1_title_en"
                                                value={formData.step1_title_en}
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
                                                name="step1_text_en"
                                                value={formData.step1_text_en}
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
                                                name="step1_title_ar"
                                                value={formData.step1_title_ar}
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
                                                name="step1_text_ar"
                                                value={formData.step1_text_ar}
                                                onChange={handleChange}
                                                required
                                                className="banner-settings-input"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-4">
                                    <Form.Label className="banner-settings-label">
                                        {language === 'ar' ? 'الصورة' : 'Image'}
                                    </Form.Label>
                                    <div className="custom-file-upload">
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, 'step1')}
                                            className="banner-settings-file-input"
                                        />
                                    </div>
                                    {previewImages.step1 && (
                                        <div className="banner-settings-preview">
                                            <img
                                                src={previewImages.step1}
                                                alt="Step 1 Preview"
                                                className="image-preview"
                                            />
                                        </div>
                                    )}
                                </Form.Group>
                            </div>

                            <div className="form-section mb-5">
                                <h4 className="section-title">{language === 'ar' ? 'الخطوة الثانية' : 'Step 2'}</h4>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="banner-settings-label">
                                                {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="step2_title_en"
                                                value={formData.step2_title_en}
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
                                                name="step2_text_en"
                                                value={formData.step2_text_en}
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
                                                name="step2_title_ar"
                                                value={formData.step2_title_ar}
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
                                                name="step2_text_ar"
                                                value={formData.step2_text_ar}
                                                onChange={handleChange}
                                                required
                                                className="banner-settings-input"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-4">
                                    <Form.Label className="banner-settings-label">
                                        {language === 'ar' ? 'الصورة' : 'Image'}
                                    </Form.Label>
                                    <div className="custom-file-upload">
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, 'step2')}
                                            className="banner-settings-file-input"
                                        />
                                    </div>
                                    {previewImages.step2 && (
                                        <div className="banner-settings-preview">
                                            <img
                                                src={previewImages.step2}
                                                alt="Step 2 Preview"
                                                className="image-preview"
                                            />
                                        </div>
                                    )}
                                </Form.Group>
                            </div>

                            <div className="form-section mb-5">
                                <h4 className="section-title">{language === 'ar' ? 'الخطوة الثالثة' : 'Step 3'}</h4>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="banner-settings-label">
                                                {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="step3_title_en"
                                                value={formData.step3_title_en}
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
                                                name="step3_text_en"
                                                value={formData.step3_text_en}
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
                                                name="step3_title_ar"
                                                value={formData.step3_title_ar}
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
                                                name="step3_text_ar"
                                                value={formData.step3_text_ar}
                                                onChange={handleChange}
                                                required
                                                className="banner-settings-input"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-4">
                                    <Form.Label className="banner-settings-label">
                                        {language === 'ar' ? 'الصورة' : 'Image'}
                                    </Form.Label>
                                    <div className="custom-file-upload">
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, 'step3')}
                                            className="banner-settings-file-input"
                                        />
                                    </div>
                                    {previewImages.step3 && (
                                        <div className="banner-settings-preview">
                                            <img
                                                src={previewImages.step3}
                                                alt="Step 3 Preview"
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

export default HowItWorksSectionSettings;
