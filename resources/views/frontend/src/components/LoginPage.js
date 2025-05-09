import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import '../styles/LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();

    const translations = {
        en: {
            title: 'Hi there! Welcome back to',
            error: 'Invalid email or password',
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Password',
            forgotPassword: 'Forgot your password?',
            loginButton: 'Log in',
            separator: 'or',
            registerText: "Don't have an account yet?",
            registerLink: 'Register here!!!',
        },
        ar: {
            title: 'مرحبًا! مرحبًا بعودتك إلى',
            error: 'البريد الإلكتروني أو كلمة المرور غير صالحة',
            emailPlaceholder: 'البريد الإلكتروني',
            passwordPlaceholder: 'كلمة المرور',
            forgotPassword: 'هل نسيت كلمة المرور؟',
            loginButton: 'تسجيل الدخول',
            separator: 'أو',
            registerText: 'ليس لديك حساب بعد؟',
            registerLink: 'سجل هنا!!!',
        },
    };

    const t = translations[language];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password); // No userType parameter
            navigate('/home');
        } catch (err) {
            setError(err.message || t.error);
        }
    };

    return (
        <div className="login-page">
            <Container fluid className="h-100">
                <Row className="h-100">
                    <Col md={6} className="d-flex align-items-center justify-content-center">
                        <div className="login-form">
                            <h2 className={`login-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
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
                            {error && <Alert variant="danger" className={language === 'ar' ? 'text-end' : 'text-start'}>{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="email"
                                        placeholder={t.emailPlaceholder}
                                        className={`login-input ${language === 'ar' ? 'text-end' : 'text-start'}`}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="password"
                                        placeholder={t.passwordPlaceholder}
                                        className={`login-input ${language === 'ar' ? 'text-end' : 'text-start'}`}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <div className={language === 'ar' ? 'text-start' : 'text-end mb-3'}>
                                    <Link to="#" className="forgot-password-link">
                                        {t.forgotPassword}
                                    </Link>
                                </div>
                                <Button variant="success" type="submit" className="login-button w-100">
                                    {t.loginButton}
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
                            <p className={`register-text text-center ${language === 'ar' ? 'flex-row-reverse d-flex justify-content-center' : ''}`}>
                                {t.registerText}{' '}
                                <Link to="/signup" className="register-link">
                                    {t.registerLink}
                                </Link>
                            </p>
                        </div>
                    </Col>

                    <Col md={6} className="d-none d-md-flex login-image-col">
                        <div className="loginbackground"></div>
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/login.png`}
                            alt="Groceries"
                            className="login-image"
                            onError={(e) => {
                                console.warn(`Failed to load login image: ${process.env.PUBLIC_URL}/assets/login.png`);
                                e.target.src = `${process.env.PUBLIC_URL}/assets/placeholder.jpg`;
                            }}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default LoginPage;
