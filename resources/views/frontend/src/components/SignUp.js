import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import '../styles/SignUpPage.css';

function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { signup } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();

    const translations = {
        en: {
            title: 'Hi there! Welcome to',
            error: {
                passwordsMismatch: 'Passwords do not match',
                registrationFailed: 'Registration failed. Email may already exist.',
            },
            firstNameLabel: 'First Name *',
            firstNamePlaceholder: 'First Name',
            lastNameLabel: 'Last Name *',
            lastNamePlaceholder: 'Last Name',
            emailLabel: 'E-mail *',
            emailPlaceholder: 'E-mail',
            phoneLabel: 'Phone',
            phonePlaceholder: 'Phone',
            genderLabel: 'Gender',
            selectGender: 'Select Gender',
            male: 'Male',
            female: 'Female',
            other: 'Other',
            addressLabel: 'Address',
            addressPlaceholder: 'Address',
            passwordLabel: 'Password *',
            passwordPlaceholder: 'Password',
            confirmPasswordLabel: 'Confirm Password *',
            confirmPasswordPlaceholder: 'Confirm Password',
            termsLabel: 'By continuing you agree to our',
            termsLink1: 'Terms of Service',
            termsLink2: 'Privacy Policy',
            signupButton: 'Sign Up',
            separator: 'or',
            loginText: 'Already have an account?',
            loginLink: 'Sign in',
        },
        ar: {
            title: 'مرحبًا! مرحبًا بك في',
            error: {
                passwordsMismatch: 'كلمات المرور غير متطابقة',
                registrationFailed: 'فشل التسجيل. البريد الإلكتروني قد يكون موجودًا بالفعل.',
            },
            firstNameLabel: 'الاسم الأول *',
            firstNamePlaceholder: 'الاسم الأول',
            lastNameLabel: 'الاسم الأخير *',
            lastNamePlaceholder: 'الاسم الأخير',
            emailLabel: 'البريد الإلكتروني *',
            emailPlaceholder: 'البريد الإلكتروني',
            phoneLabel: 'الهاتف',
            phonePlaceholder: 'الهاتف',
            genderLabel: 'الجنس',
            selectGender: 'اختر الجنس',
            male: 'ذكر',
            female: 'أنثى',
            other: 'آخر',
            addressLabel: 'العنوان',
            addressPlaceholder: 'العنوان',
            passwordLabel: 'كلمة المرور *',
            passwordPlaceholder: 'كلمة المرور',
            confirmPasswordLabel: 'تأكيد كلمة المرور *',
            confirmPasswordPlaceholder: 'تأكيد كلمة المرور',
            termsLabel: 'من خلال المتابعة، فإنك توافق على',
            termsLink1: 'شروط الخدمة',
            termsLink2: 'سياسة الخصوصية',
            signupButton: 'إنشاء حساب',
            separator: 'أو',
            loginText: 'هل لديك حساب بالفعل؟',
            loginLink: 'تسجيل الدخول',
        },
    };

    const t = translations[language];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError(t.error.passwordsMismatch);
            return;
        }
        try {
            await signup(firstName, lastName, email, phone, gender, address, password);
            navigate('/home');
        } catch (err) {
            setError(err.message || t.error.registrationFailed);
        }
    };

    return (
        <div className="signup-page">
            <Container fluid className="h-100">
                <Row className="h-100">
                    <Col md={6} className="d-flex align-items-center justify-content-center">
                        <div className="signup-form">
                            <div className={`d-flex align-items-center ${language === 'ar' ? 'justify-content-end' : 'justify-content-start'}`}>
                                <h2 className={`signup-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                    {t.title}{' '}
                                    <span className="quickpick-logo">
                                        <img
                                            src={`${process.env.PUBLIC_URL}/assets/quickpick-logo.png`}
                                            alt="QuickPick Logo"
                                            className="inline-logo"
                                            onError={(e) => {
                                                console.warn(`Failed to load QuickPick Logo: ${process.env.PUBLIC_URL}/assets/quickpick-logo.png`);
                                                e.target.src = `${process.env.PUBLIC_URL}/assets/placeholder.jpg`;
                                            }}
                                        />
                                    </span>
                                </h2>
                            </div>
                            {error && <Alert variant="danger" className={language === 'ar' ? 'text-end' : 'text-start'}>{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <label className={language === 'ar' ? 'd-block text-end' : ''}>{t.firstNameLabel}</label>
                                            <Form.Control
                                                type="text"
                                                placeholder={t.firstNamePlaceholder}
                                                className={`signup-input ${language === 'ar' ? 'text-end' : 'text-start'}`}
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <label className={language === 'ar' ? 'd-block text-end' : ''}>{t.lastNameLabel}</label>
                                            <Form.Control
                                                type="text"
                                                placeholder={t.lastNamePlaceholder}
                                                className={`signup-input ${language === 'ar' ? 'text-end' : 'text-start'}`}
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <label className={language === 'ar' ? 'd-block text-end' : ''}>{t.emailLabel}</label>
                                    <Form.Control
                                        type="email"
                                        placeholder={t.emailPlaceholder}
                                        className={`signup-input ${language === 'ar' ? 'text-end' : 'text-start'}`}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <label className={language === 'ar' ? 'd-block text-end' : ''}>{t.phoneLabel}</label>
                                    <Form.Control
                                        type="tel"
                                        placeholder={t.phonePlaceholder}
                                        className={`signup-input ${language === 'ar' ? 'text-end' : 'text-start'}`}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <label className={language === 'ar' ? 'd-block text-end' : ''}>{t.genderLabel}</label>
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
                                <Form.Group className="mb-3">
                                    <label className={language === 'ar' ? 'd-block text-end' : ''}>{t.addressLabel}</label>
                                    <Form.Control
                                        as="textarea"
                                        placeholder={t.addressPlaceholder}
                                        className={`signup-input ${language === 'ar' ? 'text-end' : 'text-start'}`}
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <label className={language === 'ar' ? 'd-block text-end' : ''}>{t.passwordLabel}</label>
                                    <Form.Control
                                        type="password"
                                        placeholder={t.passwordPlaceholder}
                                        className={`signup-input ${language === 'ar' ? 'text-end' : 'text-start'}`}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <label className={language === 'ar' ? 'd-block text-end' : ''}>{t.confirmPasswordLabel}</label>
                                    <Form.Control
                                        type="password"
                                        placeholder={t.confirmPasswordPlaceholder}
                                        className={`signup-input ${language === 'ar' ? 'text-end' : 'text-start'}`}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label={
                                            <span>
                                                {t.termsLabel}{' '}
                                                <Link to="#" className="terms-link">
                                                    {t.termsLink1}
                                                </Link>{' '}
                                                {language === 'ar' ? 'و' : 'and'}{' '}
                                                <Link to="#" className="terms-link">
                                                    {t.termsLink2}
                                                </Link>.
                                            </span>
                                        }
                                        className={`signup-checkbox ${language === 'ar' ? 'text-end' : 'text-start'}`}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="success" type="submit" className="signup-button w-100">
                                    {t.signupButton}
                                </Button>
                            </Form>
                            <div className="separator my-4">{t.separator}</div>
                            <div className="social-login d-flex justify-content-center gap-3 mb-4">
                                <Button variant="outline-dark" className="social-button google">
                                    <FaGoogle />
                                </Button>
                                <Button variant="outline-dark" className="social-button facebook">
                                    <FaFacebookF />
                                </Button>
                                <Button variant="outline-dark" className="social-button apple">
                                    <FaApple />
                                </Button>
                            </div>
                            <p className={`login-text text-center ${language === 'ar' ? 'flex-row-reverse d-flex justify-content-center' : ''}`}>
                                {t.loginText}{' '}
                                <Link to="/login" className="login-link">
                                    {t.loginLink}
                                </Link>
                            </p>
                        </div>
                    </Col>

                    <Col md={6} className="d-none d-md-block signup-image-col">
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/login.png`}
                            alt="Groceries"
                            className="signup-image"
                            onError={(e) => {
                                console.warn(`Failed to load signup image: ${process.env.PUBLIC_URL}/assets/login.png`);
                                e.target.src = `${process.env.PUBLIC_URL}/assets/placeholder.jpg`;
                            }}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default SignUp;
