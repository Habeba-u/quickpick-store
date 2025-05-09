import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button, Alert } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import { LanguageContext } from '../../context/LanguageContext';
import '../styles/styles.css';

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const { language } = useContext(LanguageContext);

    const translations = {
        en: {
            title: 'Users',
            addUser: 'Add User',
            id: 'ID',
            image: 'Image', // Add image label
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            address: 'Address',
            admin: 'Admin',
            wallet: 'Wallet (EGP)',
            createdAt: 'Created At',
            actions: 'Actions',
            view: 'View',
            edit: 'Edit',
            delete: 'Delete',
            usersCount: '{count} users',
            errorFetching: 'Failed to fetch users',
            errorDeleting: 'Error deleting user',
        },
        ar: {
            title: 'المستخدمون',
            addUser: 'إضافة مستخدم',
            id: 'المعرف',
            image: 'الصورة', // Add image label
            name: 'الاسم',
            email: 'البريد الإلكتروني',
            phone: 'الهاتف',
            address: 'العنوان',
            admin: 'مدير',
            wallet: 'المحفظة (ج.م.)',
            createdAt: 'تاريخ الإنشاء',
            actions: 'الإجراءات',
            view: 'عرض',
            edit: 'تعديل',
            delete: 'حذف',
            usersCount: '{count} مستخدمين',
            errorFetching: 'فشل في جلب المستخدمين',
            errorDeleting: 'خطأ في حذف المستخدم',
        },
    };

    const t = translations[language];

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchUsers = async () => {
            try {
                console.log('Fetching users list');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
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
                console.log('Fetched users:', data);
                if (isMounted) setUsers(data);
            } catch (error) {
                if (error.name !== 'AbortError' && isMounted) {
                    console.error('Error fetching users:', error);
                    setError(error.message || t.errorFetching);
                }
            }
        };

        fetchUsers();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المستخدم؟' : 'Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(t.errorDeleting);
                }
                setUsers(users.filter(user => user.id !== id));
            } catch (error) {
                console.error('Error deleting user:', error);
                setError(error.message);
            }
        }
    };

    return (
        <div className="admin-users-page">
            <Container fluid >
                <Row>
                    <Col md={2}>
                        <Sidebar />
                    </Col>
                    <Col md={10} className="py-5">
                        <div className={`d-flex justify-content-between align-items-center mb-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <h2 className={language === 'ar' ? 'text-end' : 'text-start'}>{t.title}</h2>
                            <Link to="/admin/users/create">
                                <Button variant="success">{t.addUser}</Button>
                            </Link>
                        </div>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <p className={`text-muted ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                            {t.usersCount.replace('{count}', users.length)}
                        </p>
                        <Card>
                            <Card.Body className="p-0">
                                <Table hover responsive>
                                    <thead>
                                        <tr>
                                            <th className={language === 'ar' ? 'text-end' : 'text-start'}>{t.id}</th>
                                            <th className={language === 'ar' ? 'text-end' : 'text-start'}>{t.image}</th>
                                            <th className={language === 'ar' ? 'text-end' : 'text-start'}>{t.name}</th>
                                            <th className={language === 'ar' ? 'text-end' : 'text-start'}>{t.email}</th>
                                            <th className={language === 'ar' ? 'text-end' : 'text-start'}>{t.phone}</th>
                                            <th className={language === 'ar' ? 'text-end' : 'text-start'}>{t.address}</th>
                                            <th className={language === 'ar' ? 'text-end' : 'text-start'}>{t.admin}</th>
                                            <th className={language === 'ar' ? 'text-end' : 'text-start'}>{t.wallet}</th>
                                            <th className={language === 'ar' ? 'text-end' : 'text-start'}>{t.createdAt}</th>
                                            <th className={language === 'ar' ? 'text-end' : 'text-start'}>{t.actions}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>
                                                    <img
                                                        src={user.image
                                                            ? `${process.env.REACT_APP_API_URL}/storage/${user.image}`
                                                            : '/assets/placeholder.jpg'}
                                                        alt={`${user.first_name} ${user.last_name}`}
                                                        className="user-image"
                                                        onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
                                                    />
                                                </td>
                                                <td>{user.first_name} {user.last_name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phone || '-'}</td>
                                                <td>{user.address || '-'}</td>
                                                <td>{user.is_admin ? (language === 'ar' ? 'نعم' : 'Yes') : (language === 'ar' ? 'لا' : 'No')}</td>
                                                <td>{user.wallet !== null && user.wallet !== undefined ? parseFloat(user.wallet).toFixed(2) : '0.00'}</td>
                                                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <Link to={`/admin/users/${user.id}`} className="me-2">
                                                        <Button variant="outline-info" size="sm">{t.view}</Button>
                                                    </Link>
                                                    <Link to={`/admin/users/edit/${user.id}`} className="me-2">
                                                        <Button variant="outline-primary" size="sm">{t.edit}</Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        {t.delete}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AdminUsersPage;
