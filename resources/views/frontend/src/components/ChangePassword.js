import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import AccountSidebar from '../components/AccountSidebar';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import '../styles/MyAccountPage.css';

function ChangePassword() {
    const { user } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const translations = {
        en: {
            title: 'Change Password',
            form: {
                currentPassword: 'Current Password *',
                currentPasswordPlaceholder: 'Enter current password',
                newPassword: 'New Password *',
                newPasswordPlaceholder: 'Enter new password',
                confirmPassword: 'Confirm New Password *',
                confirmPasswordPlaceholder: 'Confirm new password',
                changePassword: 'Change Password',
            },
            messages: {
                success: 'Password changed successfully!',
                errorMismatch: 'New password and confirm password do not match.',
                error: 'Failed to change password. Please try again.',
            },
        },
        ar: {
            title: 'تغيير كلمة المرور',
            form: {
                currentPassword: 'كلمة المرور الحالية *',
                currentPasswordPlaceholder: 'أدخل كلمة المرور الحالية',
                newPassword: 'كلمة المرور الجديدة *',
                newPasswordPlaceholder: 'أدخل كلمة المرور الجديدة',
                confirmPassword: 'تأكيد كلمة المرور الجديدة *',
                confirmPasswordPlaceholder: 'تأكيد كلمة المرور الجديدة',
                changePassword: 'تغيير كلمة المرور',
            },
            messages: {
                success: 'تم تغيير كلمة المرور بنجاح!',
                errorMismatch: 'كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقتين.',
                error: 'فشل في تغيير كلمة المرور. يرجى المحاولة مرة أخرى.',
            },
        },
    };

    const t = translations[language];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError(t.messages.errorMismatch);
            setSuccess('');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || t.messages.error);
            }
            setSuccess(t.messages.success);
            setError('');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.message || t.messages.error);
            setSuccess('');
        }
    };

    if (!user) {
        navigate('/login');
        return null;
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
                        <div className="change-password">
                            {success && <Alert variant="success">{success}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t.form.currentPassword}</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder={t.form.currentPasswordPlaceholder}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                        className={language === 'ar' ? 'text-end' : 'text-start'}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t.form.newPassword}</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder={t.form.newPasswordPlaceholder}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className={language === 'ar' ? 'text-end' : 'text-start'}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label>{t.form.confirmPassword}</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder={t.form.confirmPasswordPlaceholder}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className={language === 'ar' ? 'text-end' : 'text-start'}
                                    />
                                </Form.Group>
                                <Button
                                    type="submit"
                                    variant="success"
                                    className="save-changes-btn"
                                >
                                    {t.form.changePassword}
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ChangePassword;
