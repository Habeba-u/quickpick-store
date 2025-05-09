import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Image } from 'react-bootstrap';
import AccountSidebar from '../components/AccountSidebar';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import '../styles/MyAccountPage.css';

function PersonalInformation() {
    const { user, updateUser } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Translations
    const translations = {
        en: {
            title: 'Personal Information',
            firstName: 'First Name *',
            lastName: 'Last Name',
            email: 'Email',
            phone: 'Phone',
            gender: 'Gender',
            address: 'Address',
            image: 'Profile Image',
            selectGender: 'Select Gender',
            male: 'Male',
            female: 'Female',
            other: 'Other',
            saveChanges: 'Save Changes',
            success: 'Changes saved successfully!',
            error: 'Failed to save changes. Please try again.',
            loading: 'Loading personal information...',
        },
        ar: {
            title: 'المعلومات الشخصية',
            firstName: 'الاسم الأول *',
            lastName: 'الاسم الأخير',
            email: 'البريد الإلكتروني',
            phone: 'الهاتف',
            gender: 'الجنس',
            address: 'العنوان',
            image: 'صورة الملف الشخصي',
            selectGender: 'اختر الجنس',
            male: 'ذكر',
            female: 'أنثى',
            other: 'آخر',
            saveChanges: 'حفظ التغييرات',
            success: 'تم حفظ التغييرات بنجاح!',
            error: 'فشل في حفظ التغييرات. يرجى المحاولة مرة أخرى.',
            loading: 'جارٍ تحميل المعلومات الشخصية...',
        },
    };

    const t = translations[language];

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setFirstName(data.first_name || '');
                setLastName(data.last_name || '');
                setEmail(data.email || '');
                setPhone(data.phone || '');
                setGender(data.gender || '');
                setAddress(data.address || '');
                setImagePreview(data.image ? `${process.env.REACT_APP_API_URL}/storage/${data.image}` : null);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError(t.error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserData();
        }
    }, [user, t]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('first_name', firstName);
            formData.append('last_name', lastName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('gender', gender);
            formData.append('address', address);
            if (image) {
                formData.append('image', image);
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/update`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || t.error);
            }
            const data = await response.json();
            updateUser(data);
            setSuccess(t.success);
            setError('');
        } catch (err) {
            setError(err.message || t.error);
            setSuccess('');
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <p>{t.loading}</p>
            </Container>
        );
    }

    return (
        <div className="my-account-page">
            <Container className="py-5">
                <h2 className={`section-title mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                    {t.title}
                </h2>
                <Row>
                    <Col md={3}>
                        <AccountSidebar />
                    </Col>
                    <Col md={9}>
                        <div className="personal-info">
                            {success && <Alert variant="success">{success}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}
                            <div className="photo-placeholder mb-4 text-center">
                                {imagePreview ? (
                                    <Image
                                        src={imagePreview}
                                        alt="Profile"
                                        roundedCircle
                                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="photo-circle"></div>
                                )}
                            </div>
                            <Form onSubmit={handleSaveChanges}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t.image}</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Form.Group>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>{t.firstName}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder={t.firstName}
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
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
                                                placeholder={t.lastName}
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className={language === 'ar' ? 'text-end' : 'text-start'}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t.email}</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder={t.email}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled
                                        className={language === 'ar' ? 'text-end' : 'text-start'}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t.phone}</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder={t.phone}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className={language === 'ar' ? 'text-end' : 'text-start'}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t.gender}</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className={language === 'ar' ? 'text-end' : 'text-start'}
                                    >
                                        <option value="">{t.selectGender}</option>
                                        <option value="male">{t.male}</option>
                                        <option value="female">{t.female}</option>
                                        <option value="other">{t.other}</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label>{t.address}</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        placeholder={t.address}
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className={language === 'ar' ? 'text-end' : 'text-start'}
                                    />
                                </Form.Group>
                                <Button type="submit" variant="success" className="save-changes-btn">
                                    {t.saveChanges}
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default PersonalInformation;
