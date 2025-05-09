import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Tab, Button, Modal, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../context/AuthContext';
import { WalletContext } from '../context/WalletContext';
import { LanguageContext } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import AccountSidebar from './AccountSidebar';
import '../styles/MyWallet.css';

function MyWallet() {
    const [activeTab, setActiveTab] = useState('myWallet');
    const { user, updateUser } = useContext(AuthContext);
    const { walletBalance, transactions, addFunds, withdrawFunds } = useContext(WalletContext);
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showAddFundsModal, setShowAddFundsModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [addFundsAmount, setAddFundsAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');

    const translations = {
        en: {
            title: 'My Account',
            wallet: {
                title: 'Wallet Balance',
                balance: '{amount} EGP',
                addFunds: 'Add Funds',
                withdraw: 'Withdraw',
                transactionHistory: 'Transaction History',
                noTransactions: 'No transactions found.',
                transactionTypes: {
                    Deposit: 'Deposit',
                    Withdraw: 'Withdraw',
                    Payment: 'Payment',
                },
            },
            modals: {
                addFunds: {
                    title: 'Add Funds',
                    amountLabel: 'Amount (EGP) *',
                    amountPlaceholder: 'Enter amount',
                    submit: 'Add Funds',
                    success: 'Funds added successfully!',
                    error: 'Failed to add funds. Please try again.',
                },
                withdraw: {
                    title: 'Withdraw Funds',
                    amountLabel: 'Amount (EGP) *',
                    amountPlaceholder: 'Enter amount',
                    submit: 'Withdraw',
                    success: 'Funds withdrawn successfully!',
                    error: 'Failed to withdraw funds. Please try again.',
                },
            },
            loading: 'Loading wallet data...',
            error: 'Error loading wallet data.',
        },
        ar: {
            title: 'حسابي',
            wallet: {
                title: 'رصيد المحفظة',
                balance: '{amount} ج.م.',
                addFunds: 'إضافة أموال',
                withdraw: 'سحب أموال',
                transactionHistory: 'سجل المعاملات',
                noTransactions: 'لم يتم العثور على معاملات.',
                transactionTypes: {
                    Deposit: 'إيداع',
                    Withdraw: 'سحب',
                    Payment: 'دفع',
                },
            },
            modals: {
                addFunds: {
                    title: 'إضافة أموال',
                    amountLabel: 'المبلغ (ج.م.) *',
                    amountPlaceholder: 'أدخل المبلغ',
                    submit: 'إضافة أموال',
                    success: 'تم إضافة الأموال بنجاح!',
                    error: 'فشل في إضافة الأموال. يرجى المحاولة مرة أخرى.',
                },
                withdraw: {
                    title: 'سحب أموال',
                    amountLabel: 'المبلغ (ج.م.) *',
                    amountPlaceholder: 'أدخل المبلغ',
                    submit: 'سحب',
                    success: 'تم سحب الأموال بنجاح!',
                    error: 'فشل في سحب الأموال. يرجى المحاولة مرة أخرى.',
                },
            },
            loading: 'جارٍ تحميل بيانات المحفظة...',
            error: 'خطأ في تحميل بيانات المحفظة.',
        },
    };

    const t = translations[language];

    useEffect(() => {
        if (user) {
            setLoading(false);
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleAddFundsModalOpen = () => setShowAddFundsModal(true);
    const handleAddFundsModalClose = () => {
        setShowAddFundsModal(false);
        setAddFundsAmount('');
        setSuccess('');
        setError('');
    };

    const handleAddFundsSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        try {
            await addFunds(addFundsAmount);
            // Fetch updated user data to sync wallet balance
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/me`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch updated user data');
            }
            const updatedUser = await response.json();
            updateUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setSuccess(t.modals.addFunds.success);
            setTimeout(() => {
                handleAddFundsModalClose();
            }, 1500);
        } catch (err) {
            console.error('Error adding funds:', err);
            setError(err.message || t.modals.addFunds.error);
        }
    };

    const handleWithdrawModalOpen = () => setShowWithdrawModal(true);
    const handleWithdrawModalClose = () => {
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        setSuccess('');
        setError('');
    };

    const handleWithdrawSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        try {
            await withdrawFunds(withdrawAmount);
            // Fetch updated user data to sync wallet balance
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/me`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch updated user data');
            }
            const updatedUser = await response.json();
            updateUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setSuccess(t.modals.withdraw.success);
            setTimeout(() => {
                handleWithdrawModalClose();
            }, 1500);
        } catch (err) {
            console.error('Error withdrawing funds:', err);
            setError(err.message || t.modals.withdraw.error);
        }
    };

    if (!user) {
        return null; // Navigation handled in useEffect
    }

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <p>{t.loading}</p>
            </Container>
        );
    }

    return (
        <div className="my-wallet-page">
            <Container className="py-5">
                <h2 className={`section-title mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                    {t.title}
                </h2>
                <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
                    <Row className="my-account-section">
                        <Col md={3}>
                            <AccountSidebar activeTab={activeTab} onSelect={(key) => setActiveTab(key)} />
                        </Col>
                        <Col md={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="myWallet">
                                    <div className="wallet-section">
                                        <div className="wallet-balance mb-4">
                                            <h4 className={language === 'ar' ? 'text-end' : 'text-start'}>
                                                {t.wallet.title}
                                            </h4>
                                            <p className={`balance-amount ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                                {t.wallet.balance.replace('{amount}', walletBalance.toFixed(2))}
                                            </p>
                                            <div
                                                className={`wallet-actions ${language === 'ar' ? 'justify-content-end' : 'justify-content-start'}`}
                                            >
                                                <Button
                                                    variant="success"
                                                    className="action-btn me-2"
                                                    onClick={handleAddFundsModalOpen}
                                                >
                                                    {t.wallet.addFunds}
                                                </Button>
                                                <Button
                                                    variant="warning"
                                                    className="action-btn"
                                                    onClick={handleWithdrawModalOpen}
                                                >
                                                    {t.wallet.withdraw}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="transaction-history">
                                            <h4 className={language === 'ar' ? 'text-end' : 'text-start'}>
                                                {t.wallet.transactionHistory}
                                            </h4>
                                            {transactions.length > 0 ? (
                                                transactions.map((transaction, index) => (
                                                    <div
                                                        key={index}
                                                        className={`transaction-item ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                                                    >
                                                        <div className="transaction-icon">
                                                            {transaction.type === 'Deposit' ? (
                                                                <i className="bi bi-arrow-down-circle-fill text-success"></i>
                                                            ) : transaction.type === 'Withdraw' ? (
                                                                <i className="bi bi-arrow-up-circle-fill text-warning"></i>
                                                            ) : (
                                                                <i className="bi bi-wallet-fill text-primary"></i>
                                                            )}
                                                        </div>
                                                        <div
                                                            className={`transaction-details ${language === 'ar' ? 'text-end me-3' : 'text-start ms-3'}`}
                                                        >
                                                            <p className="transaction-type">
                                                                {t.wallet.transactionTypes[transaction.type]}
                                                            </p>
                                                            <p className="transaction-date">{transaction.date}</p>
                                                        </div>
                                                        <div
                                                            className={`transaction-amount ${language === 'ar' ? 'text-end' : 'text-start'}`}
                                                        >
                                                            <p
                                                                className={
                                                                    transaction.type === 'Deposit'
                                                                        ? 'text-success'
                                                                        : transaction.type === 'Withdraw'
                                                                        ? 'text-warning'
                                                                        : 'text-primary'
                                                                }
                                                            >
                                                                {transaction.amount}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className={language === 'ar' ? 'text-end' : 'text-start'}>
                                                    {t.wallet.noTransactions}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
                <Modal show={showAddFundsModal} onHide={handleAddFundsModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t.modals.addFunds.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {success && <Alert variant="success">{success}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleAddFundsSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>{t.modals.addFunds.amountLabel}</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={addFundsAmount}
                                    onChange={(e) => setAddFundsAmount(e.target.value)}
                                    placeholder={t.modals.addFunds.amountPlaceholder}
                                    required
                                    className={language === 'ar' ? 'text-end' : 'text-start'}
                                />
                            </Form.Group>
                            <Button variant="success" type="submit">
                                {t.modals.addFunds.submit}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={showWithdrawModal} onHide={handleWithdrawModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t.modals.withdraw.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {success && <Alert variant="success">{success}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleWithdrawSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>{t.modals.withdraw.amountLabel}</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max={walletBalance}
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    placeholder={t.modals.withdraw.amountPlaceholder}
                                    required
                                    className={language === 'ar' ? 'text-end' : 'text-start'}
                                />
                            </Form.Group>
                            <Button variant="warning" type="submit">
                                {t.modals.withdraw.submit}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
}

export default MyWallet;
