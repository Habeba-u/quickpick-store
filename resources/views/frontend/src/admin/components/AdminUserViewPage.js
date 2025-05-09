import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Image, ListGroup } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import { LanguageContext } from '../../context/LanguageContext';
import '../styles/styles.css';

function AdminUserViewPage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const { language } = useContext(LanguageContext);

    // Memoize translations to prevent unnecessary re-renders
    const translations = useMemo(
        () => ({
            en: {
                title: 'User Details',
                id: 'ID',
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'Email',
                phone: 'Phone',
                gender: 'Gender',
                address: 'Address',
                admin: 'Admin',
                wallet: 'Wallet Balance (EGP)',
                cards: 'Payment Methods',
                addresses: 'Addresses',
                createdAt: 'Created At',
                image: 'Profile Image',
                noImage: 'No image uploaded',
                noCards: 'No payment methods saved',
                noAddresses: 'No addresses saved',
                cardExpires: 'Expires {date}',
                back: 'Back to Users',
                errorFetching: 'Failed to fetch user',
                loading: 'Loading...',
            },
            ar: {
                title: 'تفاصيل المستخدم',
                id: 'المعرف',
                firstName: 'الاسم الأول',
                lastName: 'الاسم الأخير',
                email: 'البريد الإلكتروني',
                phone: 'الهاتف',
                gender: 'الجنس',
                address: 'العنوان',
                admin: 'مدير',
                wallet: 'رصيد المحفظة (ج.م.)',
                cards: 'طرق الدفع',
                addresses: 'العناوين',
                createdAt: 'تاريخ الإنشاء',
                image: 'صورة الملف الشخصي',
                noImage: 'لم يتم رفع صورة',
                noCards: 'لم يتم حفظ طرق دفع',
                noAddresses: 'لم يتم حفظ عناوين',
                cardExpires: 'ينتهي في {date}',
                back: 'العودة إلى المستخدمين',
                errorFetching: 'فشل في جلب المستخدم',
                loading: 'جارٍ التحميل...',
            },
        }),
        []
    );

    const t = translations[language];

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users/${id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error(t.errorFetching);
                }
                const data = await response.json();
                if (isMounted) {
                    setUser(data);
                }
            } catch (error) {
                if (error.name !== 'AbortError' && isMounted) {
                    console.error('Error fetching user:', error);
                    setError(error.message);
                }
            }
        };

        fetchUser();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [id, language]); // Depend on language instead of t

    if (!user) {
        return (
            <Container className="py-5 text-center">
                <p>{t.loading}</p>
            </Container>
        );
    }

    return (
        <div className="admin-user-view-page">
            <Container fluid className="py-5">
                <Row>
                    <Col md={3}>
                        <Sidebar />
                    </Col>
                    <Col md={9}>
                        <h2 className={`mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>{t.title}</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Card className="p-4">
                            <div className="mb-4 text-center">
                                {user.image ? (
                                    <Image
                                        src={`${process.env.REACT_APP_API_URL}/storage/${user.image}`}
                                        alt="Profile"
                                        roundedCircle
                                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
                                    />
                                ) : (
                                    <div className="photo-circle" style={{ width: '150px', height: '150px', margin: 'auto' }}></div>
                                )}
                                <p className="mt-2">{user.image ? t.image : t.noImage}</p>
                            </div>
                            <div className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                <strong>{t.id}:</strong> {user.id}
                            </div>
                            <div className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                <strong>{t.firstName}:</strong> {user.first_name}
                            </div>
                            <div className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                <strong>{t.lastName}:</strong> {user.last_name}
                            </div>
                            <div className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                <strong>{t.email}:</strong> {user.email}
                            </div>
                            <div className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                <strong>{t.phone}:</strong> {user.phone || '-'}
                            </div>
                            <div className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                <strong>{t.gender}:</strong> {user.gender || '-'}
                            </div>
                            <div className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                <strong>{t.address}:</strong> {user.address || '-'}
                            </div>
                            <div className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                <strong>{t.admin}:</strong> {user.is_admin ? (language === 'ar' ? 'نعم' : 'Yes') : (language === 'ar' ? 'لا' : 'No')}
                            </div>
                            <div className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                <strong>{t.wallet}:</strong> {user.wallet ? parseFloat(user.wallet).toFixed(2) : '0.00'}
                            </div>
                            <div className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                <strong>{t.cards}:</strong>
                                {user.cards && user.cards.length > 0 ? (
                                    <ListGroup variant="flush">
                                        {user.cards.map((card, index) => (
                                            <ListGroup.Item key={index}>
                                                {card.type} ending in {card.last_four} - {t.cardExpires.replace('{date}', card.expiry)}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p>{t.noCards}</p>
                                )}
                            </div>
                            <div className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                <strong>{t.addresses}:</strong>
                                {user.addresses && user.addresses.length > 0 ? (
                                    <ListGroup variant="flush">
                                        {user.addresses.map((addr) => (
                                            <ListGroup.Item key={addr.id}>
                                                {addr.label} ({addr.type}) - {addr.street}
                                                {addr.apt_no ? `, Apt ${addr.apt_no}` : ''}
                                                {addr.floor ? `, Floor ${addr.floor}` : ''}
                                                {addr.is_default ? ' (Default)' : ''}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p>{t.noAddresses}</p>
                                )}
                            </div>
                            <div className={`mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                <strong>{t.createdAt}:</strong> {new Date(user.created_at).toLocaleDateString()}
                            </div>
                            <Link to="/admin/users">
                                <Button variant="outline-secondary">{t.back}</Button>
                            </Link>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AdminUserViewPage;
