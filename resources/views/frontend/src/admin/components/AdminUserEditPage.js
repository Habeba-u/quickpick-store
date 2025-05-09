// src/admin/pages/AdminUserEditPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import { LanguageContext } from '../../context/LanguageContext';
import '../styles/styles.css';

function AdminUserEditPage() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        gender: '',
        address: '',
        is_admin: false,
        wallet: '0.00',
        image: null,
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { language } = useContext(LanguageContext);

    // Debug renders
    useEffect(() => {
        console.log('AdminUserEditPage rendered, id:', id, 'language:', language);
    });

    const translations = {
        en: {
            title: 'Edit User',
            firstName: 'First Name *',
            lastName: 'Last Name *',
            email: 'Email *',
            phone: 'Phone',
            gender: 'Gender',
            address: 'Address',
            isAdmin: 'Is Admin',
            wallet: 'Wallet Balance (EGP)',
            image: 'Profile Image',
            selectGender: 'Select Gender',
            male: 'Male',
            female: 'Female',
            other: 'Other',
            updateUser: 'Update User',
            cancel: 'Cancel',
            success: 'User updated successfully!',
            errorFetching: 'Failed to fetch user',
            errorUpdating: 'Failed to update user',
            loading: 'Loading...',
        },
        ar: {
            title: 'تعديل المستخدم',
            firstName: 'الاسم الأول *',
            lastName: 'الاسم الأخير *',
            email: 'البريد الإلكتروني *',
            phone: 'الهاتف',
            gender: 'الجنس',
            address: 'العنوان',
            isAdmin: 'مدير',
            wallet: 'رصيد المحفظة (ج.م.)',
            image: 'صورة الملف الشخصي',
            selectGender: 'اختر الجنس',
            male: 'ذكر',
            female: 'أنثى',
            other: 'آخر',
            updateUser: 'تحديث المستخدم',
            cancel: 'إلغاء',
            success: 'تم تحديث المستخدم بنجاح!',
            errorFetching: 'فشل في جلب المستخدم',
            errorUpdating: 'فشل في تحديث المستخدم',
            loading: 'جارٍ التحميل...',
        },
    };

    const t = translations[language];

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchUser = async () => {
            try {
                console.log(`Fetching user with ID: ${id}`);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users/${id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    signal: controller.signal,
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || t.errorFetching);
                }
                const data = await response.json();
                if (isMounted) {
                    setFormData({
                        first_name: data.first_name || '',
                        last_name: data.last_name || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        gender: data.gender || '',
                        address: data.address || '',
                        is_admin: data.is_admin || false,
                        wallet: data.wallet !== null && data.wallet !== undefined ? parseFloat(data.wallet).toFixed(2) : '0.00',
                        image: null,
                    });
                }
            } catch (error) {
                if (error.name !== 'AbortError' && isMounted) {
                    console.error('Error fetching user:', error);
                    setError(error.message || t.errorFetching);
                }
            }
        };

        fetchUser();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []); // Empty dependency array to fetch only on mount

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
        data.append('is_admin', formData.is_admin ? 1 : 0);
        data.append('wallet', parseFloat(formData.wallet).toFixed(2));
        if (formData.image) {
            data.append('image', formData.image);
        }
        data.append('_method', 'PUT'); // Add method spoofing

        try {
            const url = `${process.env.REACT_APP_API_URL}/api/admin/users/${id}`;
            console.log('Submitting to:', url);
            const response = await fetch(url, {
                method: 'POST', // Change to POST
                headers: {
                    'Accept': 'application/json', // Add Accept header
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: data,
                credentials: 'include', // Add to match category edit
            });
            console.log('Update user response status:', response.status);
            console.log('Response headers:', [...response.headers.entries()]); // Log headers
            const responseText = await response.text(); // Get raw response text
            console.log('Raw response:', responseText); // Log raw response
            if (!response.ok) {
                let errorData;
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    throw new Error('Server returned an invalid response: ' + responseText);
                }
                throw new Error(errorData.message || t.errorUpdating);
            }
            const result = JSON.parse(responseText);
            setSuccess(t.success);
            setTimeout(() => {
                navigate('/admin/users');
            }, 1500);
        } catch (error) {
            console.error('Error updating user:', error);
            setError(error.message);
        }
    };

    return (
        <div className="admin-user-edit-page">
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
                                    <Button type="submit" variant="success">{t.updateUser}</Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AdminUserEditPage;
