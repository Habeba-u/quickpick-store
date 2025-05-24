import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Alert, Tabs, Tab, Row, Col } from 'react-bootstrap';
import { LanguageContext } from '../../context/LanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function PolicyPagesSettings() {
    const { language } = useContext(LanguageContext);
    const [policies, setPolicies] = useState({
        Terms: { title_en: '', title_ar: '', description_en: '', description_ar: '', sections: [] },
        Privacy: { title_en: '', title_ar: '', description_en: '', description_ar: '', sections: [] },
        Cookies: { title_en: '', title_ar: '', description_en: '', description_ar: '', sections: [] },
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/policy_pages`, {
                    headers: { 'Accept': 'application/json' },
                    credentials: 'include',
                });
                console.log('Fetch policy pages response status:', response.status, response.statusText);
                if (!response.ok) throw new Error('Failed to fetch policies');
                const data = await response.json();
                console.log('Raw policy pages data:', data);
                const updatedPolicies = { ...policies };
                data.forEach(policy => {
                    updatedPolicies[policy.type] = {
                        title_en: policy.title_en || '',
                        title_ar: policy.title_ar || '',
                        description_en: policy.description_en || '',
                        description_ar: policy.description_ar || '',
                        sections: policy.sections || [],
                    };
                });
                setPolicies(updatedPolicies);
            } catch (err) {
                setError(language === 'ar' ? 'خطأ في تحميل السياسات' : 'Error loading policies');
            }
        };
        fetchPolicies();
    }, [language]);

    const handleChange = (policyType, field, value, sectionIndex = null) => {
        setPolicies(prev => {
            const updatedPolicies = { ...prev };
            if (sectionIndex !== null) {
                const updatedSections = [...updatedPolicies[policyType].sections];
                updatedSections[sectionIndex] = {
                    ...updatedSections[sectionIndex],
                    [field]: value,
                };
                updatedPolicies[policyType].sections = updatedSections;
            } else {
                updatedPolicies[policyType][field] = value;
            }
            return updatedPolicies;
        });
    };

    const addSection = (policyType) => {
        setPolicies(prev => {
            const updatedPolicies = { ...prev };
            updatedPolicies[policyType].sections.push({
                header_en: '',
                header_ar: '',
                body_en: '',
                body_ar: '',
            });
            return updatedPolicies;
        });
    };

    const removeSection = (policyType, sectionIndex) => {
        setPolicies(prev => {
            const updatedPolicies = { ...prev };
            updatedPolicies[policyType].sections = updatedPolicies[policyType].sections.filter((_, index) => index !== sectionIndex);
            return updatedPolicies;
        });
    };

    const handleSubmit = async (e, policyType) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        const policyData = policies[policyType];
        const requiredFields = ['title_en', 'title_ar', 'description_en', 'description_ar'];
        for (const field of requiredFields) {
            if (!policyData[field]) {
                setError(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
                return;
            }
        }

        for (const section of policyData.sections) {
            if (!section.header_en || !section.header_ar || !section.body_en || !section.body_ar) {
                setError(language === 'ar' ? 'يرجى ملء جميع حقول الأقسام' : 'Please fill all section fields');
                return;
            }
        }

        const form = new FormData();
        const data = [
            {
                type: policyType,
                title_en: policyData.title_en,
                title_ar: policyData.title_ar,
                description_en: policyData.description_en,
                description_ar: policyData.description_ar,
            },
            ...policyData.sections.map(section => ({
                header_en: section.header_en,
                header_ar: section.header_ar,
                body_en: section.body_en,
                body_ar: section.body_ar,
            })),
        ];

        data.forEach((item, index) => {
            Object.entries(item).forEach(([key, value]) => {
                form.append(`${index}[${key}]`, value);
            });
        });

        console.log('FormData entries:');
        for (let [key, value] of form.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/policy_pages`, {
                method: 'POST',
                body: form,
                credentials: 'include',
            });
            console.log('Submit response status:', response.status, response.statusText);
            const responseData = await response.json();
            console.log('Submit response data:', responseData);
            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to update policy');
            }
            setMessage(language === 'ar' ? 'تم تحديث السياسة بنجاح' : 'Policy updated successfully');
        } catch (err) {
            console.error('Submit error:', err);
            setError(language === 'ar' ? `خطأ في تحديث السياسة: ${err.message}` : `Error updating policy: ${err.message}`);
        }
    };

    return (
        <Container className="py-5">
            <h2 className={`mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                {language === 'ar' ? 'إعدادات صفحات السياسات' : 'Policy Pages Settings'}
            </h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Tabs defaultActiveKey="Terms" id="policy-tabs" className="mb-3">
                {Object.keys(policies).map(policyType => (
                    <Tab eventKey={policyType} title={policyType} key={policyType}>
                        <Form onSubmit={(e) => handleSubmit(e, policyType)} dir={language === 'ar' ? 'rtl' : 'ltr'} className="mt-4">
                            <h4 className="mb-3">{language === 'ar' ? 'العنوان والوصف' : 'Title and Description'}</h4>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={policies[policyType].title_en}
                                            onChange={(e) => handleChange(policyType, 'title_en', e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={policies[policyType].title_ar}
                                            onChange={(e) => handleChange(policyType, 'title_ar', e.target.value)}
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
                                            value={policies[policyType].description_en}
                                            onChange={(e) => handleChange(policyType, 'description_en', e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>{language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={policies[policyType].description_ar}
                                            onChange={(e) => handleChange(policyType, 'description_ar', e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <h4 className="mb-3">{language === 'ar' ? 'الأقسام' : 'Sections'}</h4>
                            {policies[policyType].sections.map((section, index) => (
                                <div key={index} className="mb-4 border p-3 rounded">
                                    <h5>{language === 'ar' ? `القسم ${index + 1}` : `Section ${index + 1}`}</h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Header (English)'}</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={section.header_en}
                                                    onChange={(e) => handleChange(policyType, 'header_en', e.target.value, index)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>{language === 'ar' ? 'العنوان (عربي)' : 'Header (Arabic)'}</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={section.header_ar}
                                                    onChange={(e) => handleChange(policyType, 'header_ar', e.target.value, index)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>{language === 'ar' ? 'المحتوى (إنجليزي)' : 'Body (English)'}</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    value={section.body_en}
                                                    onChange={(e) => handleChange(policyType, 'body_en', e.target.value, index)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>{language === 'ar' ? 'المحتوى (عربي)' : 'Body (Arabic)'}</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    value={section.body_ar}
                                                    onChange={(e) => handleChange(policyType, 'body_ar', e.target.value, index)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeSection(policyType, index)}
                                    >
                                        {language === 'ar' ? 'حذف القسم' : 'Remove Section'}
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="secondary"
                                className="mb-3"
                                onClick={() => addSection(policyType)}
                            >
                                {language === 'ar' ? 'إضافة قسم جديد' : 'Add New Section'}
                            </Button>

                            <Button type="submit" variant="primary">
                                {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                            </Button>
                        </Form>
                    </Tab>
                ))}
            </Tabs>
        </Container>
    );
}

export default PolicyPagesSettings;
