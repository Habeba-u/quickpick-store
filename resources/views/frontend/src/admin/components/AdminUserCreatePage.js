// src/admin/pages/AdminUserCreatePage.js
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import { LanguageContext } from '../../context/LanguageContext';
import '../styles/styles.css';

function AdminUserCreatePage() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        gender: '',
        address: '',
        password: '',
        is_admin: false,
        image: null,
        wallet: '0.00', // Added wallet field
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { language } = useContext(LanguageContext);

    const translations = {
        en: {
            title: 'Add User',
            firstName: 'First Name *',
            lastName: 'Last Name *',
            email: 'Email *',
            phone: 'Phone',
            gender: 'Gender',
            address: 'Address',
            password: 'Password *',
            isAdmin: 'Is Admin',
            image: 'Profile Image',
            wallet: 'Wallet Balance (EGP)', // Added translation
            selectGender: 'Select Gender',
            male: 'Male',
            female: 'Female',
            other: 'Other',
            createUser: 'Create User',
            cancel: 'Cancel',
            success: 'User created successfully!',
            error: 'Failed to create user',
        },
        ar: {
            title: 'إضافة مستخدم',
            firstName: 'الاسم الأول *',
            lastName: 'الاسم الأخير *',
            email: 'البريد الإلكتروني *',
            phone: 'الهاتف',
            gender: 'الجنس',
            address: 'العنوان',
            password: 'كلمة المرور *',
            isAdmin: 'مدير',
            image: 'صورة الملف الشخصي',
            wallet: 'رصيد المحفظة (ج.م.)', // Added translation
            selectGender: 'اختر الجنس',
            male: 'ذكر',
            female: 'أنثى',
            other: 'آخر',
            createUser: 'إنشاء مستخدم',
            cancel: 'إلغاء',
            success: 'تم إنشاء المستخدم بنجاح!',
            error: 'فشل في إنشاء المستخدم',
        },
    };

    const t = translations[language];

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess('');

        const data = new FormData();
        data.append('first_name', formData.first_name);
        data.append('last_name', formData.last_name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('gender', formData.gender);
        data.append('address', formData.address);
        data.append('password', formData.password);
        data.append('is_admin', formData.is_admin ? 1 : 0);
        data.append('wallet', formData.wallet); // Added wallet
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: data,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || t.error);
            }
            setSuccess(t.success);
            setTimeout(() => {
                navigate('/admin/users');
            }, 1500);
        } catch (error) {
            console.error('Error creating user:', error);
            setError(error.message);
        }
    };

    return (
        <div className="admin-user-create-page">
            <Container fluid className="py-5">
                <Row>
                    <Col md={3}>
                        <Sidebar />
                    </Col>
                    <Col md={9}>
                        <h2 className={`mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>{t.title}</h2>
                        {success && <Alert variant="success">{success}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Card className="p-4">
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>{t.firstName}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                required
                                                className={language === 'ar' ? 'text-end' : 'text-start'}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>{t.lastName}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                required
                                                className={language === 'ar' ? 'text-end' : 'text-start'}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t.email}</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className={language === 'ar' ? 'text-end' : 'text-start'}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t.phone}</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={language === 'ar' ? 'text-end' : 'text-start'}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t.gender}</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className={language === 'ar' ? 'text-end' : 'text-start'}
                                    >
                                        <option value="">{t.selectGender}</option>
                                        <option value="male">{t.male}</option>
                                        <option value="female">{t.female}</option>
                                        <option value="other">{t.other}</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t.address}</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={language === 'ar' ? 'text-end' : 'text-start'}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t.password}</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className={language === 'ar' ? 'text-end' : 'text-start'}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t.image}</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className={language === 'ar' ? 'text-end' : 'text-start'}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t.wallet}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="wallet"
                                        value={formData.wallet}
                                        onChange={handleChange}
                                        className={language === 'ar' ? 'text-end' : 'text-start'}
                                    />
                                </Form.Group>
                                <Form.Check
                                    type="checkbox"
                                    name="is_admin"
                                    label={t.isAdmin}
                                    checked={formData.is_admin}
                                    onChange={handleChange}
                                    className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}
                                />
                                <div className={`d-flex ${language === 'ar' ? 'justify-content-end' : 'justify-content-start'}`}>
                                    <Link to="/admin/users" className="me-2">
                                        <Button variant="outline-secondary">{t.cancel}</Button>
                                    </Link>
                                    <Button type="submit" variant="success">{t.createUser}</Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AdminUserCreatePage;
