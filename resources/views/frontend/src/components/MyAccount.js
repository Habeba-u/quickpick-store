import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Tab, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import AccountSidebar from './AccountSidebar';
import MyOrders from './MyOrders';
import '../styles/MyAccountPage.css';

function MyAccount() {
    const [activeTab, setActiveTab] = useState('personalInfo');
    const { user, updateUser } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();

    // State for form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [image, setImage] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Translations
    const translations = {
        en: {
            title: 'My Account',
            personalInfo: {
                title: 'Personal Information',
                firstName: 'First Name *',
                lastName: 'Last Name',
                email: 'Email',
                phone: 'Phone',
                gender: 'Gender',
                selectGender: 'Select Gender',
                male: 'Male',
                female: 'Female',
                other: 'Other',
                image: 'Profile Image',
                saveChanges: 'Save Changes',
                success: 'Changes saved successfully!',
                error: 'Failed to save changes. Please try again.',
            },
            myOrders: 'My Orders',
            manageAddress: 'Manage Address',
            manageAddressPlaceholder: 'This section will allow you to manage your addresses. (Placeholder)',
            paymentMethod: 'Payment Method',
            paymentMethodPlaceholder: 'This section will allow you to manage your payment methods. (Placeholder)',
            changePassword: 'Change Password',
            changePasswordPlaceholder: 'This section will allow you to change your password. (Placeholder)',
        },
        ar: {
            title: 'حسابي',
            personalInfo: {
                title: 'المعلومات الشخصية',
                firstName: 'الاسم الأول *',
                lastName: 'الاسم الأخير',
                email: 'البريد الإلكتروني',
                phone: 'الهاتف',
                gender: 'الجنس',
                selectGender: 'اختر الجنس',
                male: 'ذكر',
                female: 'أنثى',
                other: 'آخر',
                image: 'صورة الملف الشخصي',
                saveChanges: 'حفظ التغييرات',
                success: 'تم حفظ التغييرات بنجاح!',
                error: 'فشل في حفظ التغييرات. يرجى المحاولة مرة أخرى.',
            },
            myOrders: 'طلباتي',
            manageAddress: 'إدارة العنوان',
            manageAddressPlaceholder: 'هذا القسم سيسمح لك بإدارة عناوينك. (عنصر نائب)',
            paymentMethod: 'طريقة الدفع',
            paymentMethodPlaceholder: 'هذا القسم سيسمح لك بإدارة طرق الدفع الخاصة بك. (عنصر نائب)',
            changePassword: 'تغيير كلمة المرور',
            changePasswordPlaceholder: 'هذا القسم سيسمح لك بتغيير كلمة المرور الخاصة بك. (عنصر نائب)',
        },
    };

    const t = translations[language];

    // Initialize form fields with user data
    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setGender(user.gender ? user.gender.toLowerCase() : '');
        }
    }, [user]);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        const payload = {
            first_name: firstName || user.first_name,
            last_name: lastName || user.last_name,
            email: email || user.email,
            phone: phone || user.phone || '',
            gender: gender || user.gender || '',
            wallet: user.wallet || 0,
            addresses: Array.isArray(user.addresses) ? user.addresses : [], // Ensure array
        };

        try {
            const token = localStorage.getItem('token');
            let response;

            if (image) {
                const formData = new FormData();
                formData.append('first_name', payload.first_name);
                formData.append('last_name', payload.last_name);
                formData.append('email', payload.email);
                formData.append('phone', payload.phone);
                formData.append('gender', payload.gender);
                formData.append('wallet', payload.wallet);
                // Send addresses as individual elements
                payload.addresses.forEach((address, index) => {
                    Object.entries(address).forEach(([key, value]) => {
                        formData.append(`addresses[${index}][${key}]`, value);
                    });
                });
                formData.append('image', image);
                formData.append('_method', 'PUT');

                response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/update/${user.id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });
            } else {
                response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/update/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });
            }

            // Log raw response for debugging
            const responseText = await response.text();
            console.log('Raw response:', responseText);

            if (!response.ok) {
                let errorData;
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    throw new Error('Server returned an invalid response: ' + responseText);
                }
                throw new Error(errorData.message || t.personalInfo.error);
            }

            const updatedUser = JSON.parse(responseText);
            updateUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setSuccess(t.personalInfo.success);
            setImage(null);
        } catch (err) {
            console.error('Error updating user:', err);
            setError(err.message || t.personalInfo.error);
        }
    };

    // Redirect to login if not authenticated
    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="my-account-page">
            <Container className="py-5">
                {/* Title */}
                <h2 className={`section-title mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                    {t.title}
                </h2>

                <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
                    <Row className="my-account-section">
                        {/* Left Side: Sidebar */}
                        <Col md={3}>
                            <AccountSidebar activeTab={activeTab} onSelect={(key) => setActiveTab(key)} />
                        </Col>

                        {/* Right Side: Tab Content */}
                        <Col md={9}>
                            <Tab.Content>
                                {/* Tab 1: Personal Information */}
                                <Tab.Pane eventKey="personalInfo">
                                    <div className="personal-info">
                                        {success && <Alert variant="success">{success}</Alert>}
                                        {error && <Alert variant="danger">{error}</Alert>}
                                        <div className="photo-placeholder mb-4 text-center">
                                            {user.image ? (
                                                <img
                                                    src={`${process.env.REACT_APP_API_URL}/storage/${user.image}`}
                                                    alt="Profile"
                                                    className="photo-circle"
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
                                                    onError={(e) => {
                                                        console.warn(`Failed to load profile image: ${user.image}`);
                                                        e.target.src = `${process.env.PUBLIC_URL}/assets/placeholder.jpg`;
                                                    }}
                                                />
                                            ) : (
                                                <div className="photo-circle"></div>
                                            )}
                                        </div>
                                        <Form onSubmit={handleSaveChanges}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>{t.personalInfo.image}</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    name="image"
                                                    onChange={handleImageChange}
                                                    className={language === 'ar' ? 'text-end' : 'text-start'}
                                                />
                                            </Form.Group>
                                            <Row className="mb-3">
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label>{t.personalInfo.firstName}</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder={t.personalInfo.firstName}
                                                            value={firstName}
                                                            onChange={(e) => setFirstName(e.target.value)}
                                                            required
                                                            className={language === 'ar' ? 'text-end' : 'text-start'}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label>{t.personalInfo.lastName}</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder={t.personalInfo.lastName}
                                                            value={lastName}
                                                            onChange={(e) => setLastName(e.target.value)}
                                                            className={language === 'ar' ? 'text-end' : 'text-start'}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Form.Group className="mb-3">
                                                <Form.Label>{t.personalInfo.email}</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder={t.personalInfo.email}
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    disabled
                                                    className={language === 'ar' ? 'text-end' : 'text-start'}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>{t.personalInfo.phone}</Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    placeholder={t.personalInfo.phone}
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className={language === 'ar' ? 'text-end' : 'text-start'}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-4">
                                                <Form.Label>{t.personalInfo.gender}</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    value={gender}
                                                    onChange={(e) => setGender(e.target.value.toLowerCase())}
                                                    className={language === 'ar' ? 'text-end' : 'text-start'}
                                                >
                                                    <option value="">{t.personalInfo.selectGender}</option>
                                                    <option value="male">{t.personalInfo.male}</option>
                                                    <option value="female">{t.personalInfo.female}</option>
                                                    <option value="other">{t.personalInfo.other}</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Button type="submit" variant="success" className="save-changes-btn">
                                                {t.personalInfo.saveChanges}
                                            </Button>
                                        </Form>
                                    </div>
                                </Tab.Pane>

                                {/* Tab 2: My Orders */}
                                <Tab.Pane eventKey="myOrders">
                                    <h4 className={language === 'ar' ? 'text-end' : 'text-start'}>{t.myOrders}</h4>
                                    <MyOrders />
                                </Tab.Pane>

                                {/* Tab 3: Manage Address */}
                                <Tab.Pane eventKey="manageAddress">
                                    <h4 className={language === 'ar' ? 'text-end' : 'text-start'}>{t.manageAddress}</h4>
                                    <p className={language === 'ar' ? 'text-end' : 'text-start'}>
                                        {t.manageAddressPlaceholder}
                                    </p>
                                </Tab.Pane>

                                {/* Tab 4: Payment Method */}
                                <Tab.Pane eventKey="paymentMethod">
                                    <h4 className={language === 'ar' ? 'text-end' : 'text-start'}>{t.paymentMethod}</h4>
                                    <p className={language === 'ar' ? 'text-end' : 'text-start'}>
                                        {t.paymentMethodPlaceholder}
                                    </p>
                                </Tab.Pane>

                                {/* Tab 5: Change Password */}
                                <Tab.Pane eventKey="changePassword">
                                    <h4 className={language === 'ar' ? 'text-end' : 'text-start'}>{t.changePassword}</h4>
                                    <p className={language === 'ar' ? 'text-end' : 'text-start'}>
                                        {t.changePasswordPlaceholder}
                                    </p>
                                </Tab.Pane>

                                {/* Tab 6: Logout (handled by AccountSidebar) */}
                                <Tab.Pane eventKey="logout"></Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Container>
        </div>
    );
}

export default MyAccount;
