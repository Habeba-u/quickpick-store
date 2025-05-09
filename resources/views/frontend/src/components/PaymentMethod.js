import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AccountSidebar from '../components/AccountSidebar';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import '../styles/PaymentMethod.css';

function PaymentMethod() {
    const { user, updateUser } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newCard, setNewCard] = useState({
        number: '',
        expiry: null,
        cvc: '',
        holderName: '',
        type: 'Visa',
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const translations = {
        en: {
            title: 'Payment Method',
            securityNote: 'Your card details are safe and secure encrypted with us.',
            noCards: 'No payment methods saved.',
            addNewCard: 'Add a new card',
            modal: {
                title: 'Add New Card',
                cardNumber: 'Credit or Debit Card Number *',
                cardNumberPlaceholder: '0000 0000 0000 0000',
                expiryDate: 'Expiry Date *',
                expiryDatePlaceholder: 'MM/YY',
                cvc: 'CVC *',
                cvcPlaceholder: '123',
                holderName: 'Holder Name *',
                holderNamePlaceholder: 'Cardholder Name',
                cardType: 'Card Type *',
                visa: 'Visa',
                mastercard: 'Mastercard',
                saveChanges: 'Save changes',
            },
            cardDetails: {
                expires: 'Expires {date}',
            },
            actions: {
                remove: 'Remove',
            },
            messages: {
                cardAdded: 'Card added successfully!',
                cardRemoved: 'Card removed successfully!',
                invalidCardNumber: 'Please enter a valid card number (at least 12 digits).',
                invalidExpiry: 'Please select a valid expiry date.',
                invalidCVC: 'Please enter a valid CVC (3-4 digits).',
                invalidHolderName: 'Please enter the cardholder name.',
                error: 'Error managing payment methods. Please try again.',
            },
            loading: 'Loading payment methods...',
        },
        ar: {
            title: 'طريقة الدفع',
            securityNote: 'تفاصيل بطاقتك آمنة ومشفرة معنا.',
            noCards: 'لم يتم حفظ أي طرق دفع.',
            addNewCard: 'إضافة بطاقة جديدة',
            modal: {
                title: 'إضافة بطاقة جديدة',
                cardNumber: 'رقم بطاقة الائتمان أو الخصم *',
                cardNumberPlaceholder: '0000 0000 0000 0000',
                expiryDate: 'تاريخ الانتهاء *',
                expiryDatePlaceholder: 'شش/сс',
                cvc: 'رمز CVC *',
                cvcPlaceholder: '123',
                holderName: 'اسم حامل البطاقة *',
                holderNamePlaceholder: 'اسم حامل البطاقة',
                cardType: 'نوع البطاقة *',
                visa: 'فيزا',
                mastercard: 'ماستركارد',
                saveChanges: 'حفظ التغييرات',
            },
            cardDetails: {
                expires: 'ينتهي في {date}',
            },
            actions: {
                remove: 'إزالة',
            },
            messages: {
                cardAdded: 'تم إضافة البطاقة بنجاح!',
                cardRemoved: 'تم إزالة البطاقة بنجاح!',
                invalidCardNumber: 'يرجى إدخال رقم بطاقة صالح (12 رقمًا على الأقل).',
                invalidExpiry: 'يرجى اختيار تاريخ انتهاء صالح.',
                invalidCVC: 'يرجى إدخال رمز CVC صالح (3-4 أرقام).',
                invalidHolderName: 'يرجى إدخال اسم حامل البطاقة.',
                error: 'خطأ في إدارة طرق الدفع. يرجى المحاولة مرة أخرى.',
            },
            loading: 'جارٍ تحميل طرق الدفع...',
        },
    };

    const t = translations[language];

    useEffect(() => {
        if (user) {
            const userCards = Array.isArray(user.cards) ? user.cards : (typeof user.cards === 'string' ? JSON.parse(user.cards) : []) || [];
            console.log('Initial user.cards:', userCards);
            setCards(
                userCards.map((card, index) => ({
                    ...card,
                    id: card.id || index,
                    number: `**** **** **** ${card.last_four || (card.number ? card.number.slice(-4) : 'XXXX')}`,
                    expiry: card.expiry
                        ? new Date(`20${card.expiry.split('/')[1]}-${card.expiry.split('/')[0]}-01`)
                        : null,
                    rawNumber: card.number || '',
                    cvc: card.cvv || '',
                }))
            );
            setLoading(false);
        }
    }, [user]);

    const saveCards = async (updatedCards) => {
        try {
            const token = localStorage.getItem('token');
            const formattedCards = updatedCards.map((card) => ({
                number: card.rawNumber || card.number.replace(/\s/g, '').replace(/\*/g, ''),
                expiry: card.expiry
                    ? `${String(card.expiry.getMonth() + 1).padStart(2, '0')}/${card.expiry
                          .getFullYear()
                          .toString()
                          .slice(-2)}`
                    : '',
                cvv: card.cvc || '',
                type: card.type,
                last_four: (card.rawNumber || card.number).slice(-4),
            }));

            console.log('Submitting cards:', formattedCards);

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/update-cards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ cards: formattedCards }),
            });

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
                throw new Error(errorData.message || t.messages.error);
            }

            const data = JSON.parse(responseText);
            const updatedUser = { ...user, cards: formattedCards };
            updateUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setCards(
                formattedCards.map((card, index) => ({
                    ...card,
                    id: index,
                    number: `**** **** **** ${card.last_four}`,
                    expiry: new Date(`20${card.expiry.split('/')[1]}-${card.expiry.split('/')[0]}-01`),
                    rawNumber: card.number,
                    cvc: card.cvv || '',
                }))
            );
            setSuccess(t.messages.cardAdded);
            setError('');
        } catch (err) {
            console.error('Error saving cards:', err);
            setError(err.message || t.messages.error);
            setSuccess('');
        }
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setNewCard({ number: '', expiry: null, cvc: '', holderName: '', type: 'Visa' });
        setError('');
        setSuccess('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCard((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setNewCard((prev) => ({ ...prev, expiry: date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!newCard.number || newCard.number.length < 12) {
            setError(t.messages.invalidCardNumber);
            return;
        }
        if (!newCard.expiry) {
            setError(t.messages.invalidExpiry);
            return;
        }
        if (!newCard.cvc.match(/^\d{3,4}$/)) {
            setError(t.messages.invalidCVC);
            return;
        }
        if (!newCard.holderName) {
            setError(t.messages.invalidHolderName);
            return;
        }

        const maskedNumber = `**** **** **** ${newCard.number.slice(-4)}`;
        const rawNumber = newCard.number.replace(/\s/g, ''); // Ensure raw number
        console.log('Adding card with number:', rawNumber);
        const updatedCards = [
            ...cards,
            { ...newCard, number: maskedNumber, rawNumber, id: Date.now(), cvc: newCard.cvc },
        ];
        await saveCards(updatedCards);
        handleCloseModal();
    };

    const handleRemove = async (id) => {
        const updatedCards = cards.filter((card) => card.id !== id);
        await saveCards(updatedCards);
        setSuccess(t.messages.cardRemoved);
        setError('');
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
                        {success && <Alert variant="success">{success}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}
                        <div className="payment-methods">
                            <p className={`security-note mb-3 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                {t.securityNote}
                            </p>
                            {cards.length > 0 ? (
                                cards.map((card) => (
                                    <Card key={card.id} className="payment-card mb-3">
                                        <Card.Body
                                            className={`d-flex align-items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                                        >
                                            <div className="card-logo me-3 ms-3">
                                                {card.type === 'Mastercard' ? (
                                                    <img
                                                        src={process.env.PUBLIC_URL + '/assets/mastercard-logo.png'}
                                                        alt="Mastercard"
                                                        onError={(e) => {
                                                            console.warn(`Failed to load Mastercard Logo`);
                                                            e.target.src = `${process.env.PUBLIC_URL}/assets/placeholder.jpg`;
                                                        }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={process.env.PUBLIC_URL + '/assets/visa-logo.png'}
                                                        alt="Visa"
                                                        onError={(e) => {
                                                            console.warn(`Failed to load Visa Logo`);
                                                            e.target.src = `${process.env.PUBLIC_URL}/assets/placeholder.jpg`;
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div
                                                className={`card-details flex-grow-1 ${language === 'ar' ? 'text-end' : 'text-start'}`}
                                            >
                                                <p className="card-number mb-1">{card.number}</p>
                                                <p className="card-expiry mb-0">
                                                    {t.cardDetails.expires.replace(
                                                        '{date}',
                                                        card.expiry
                                                            ? `${String(card.expiry.getMonth() + 1).padStart(2, '0')}/${card.expiry
                                                                  .getFullYear()
                                                                  .toString()
                                                                  .slice(-2)}`
                                                            : 'N/A'
                                                    )}
                                                </p>
                                            </div>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleRemove(card.id)}
                                                aria-label={`Remove card ending in ${card.number.slice(-4)}`}
                                            >
                                                {t.actions.remove}
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                ))
                            ) : (
                                <p className={language === 'ar' ? 'text-end' : 'text-start'}>{t.noCards}</p>
                            )}
                            <Button variant="success" onClick={handleShowModal}>
                                {t.addNewCard}
                            </Button>
                        </div>

                        <Modal show={showModal} onHide={handleCloseModal} centered dialogClassName="custom-modal">
                            <Modal.Header closeButton>
                                <Modal.Title>{t.modal.title}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>{t.modal.cardNumber}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="number"
                                            value={newCard.number}
                                            onChange={handleInputChange}
                                            placeholder={t.modal.cardNumberPlaceholder}
                                            required
                                            aria-label={t.modal.cardNumber}
                                            className={language === 'ar' ? 'text-end' : 'text-start'}
                                        />
                                    </Form.Group>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>{t.modal.expiryDate}</Form.Label>
                                                <DatePicker
                                                    selected={newCard.expiry}
                                                    onChange={handleDateChange}
                                                    dateFormat="MM/yy"
                                                    showMonthYearPicker
                                                    placeholderText={t.modal.expiryDatePlaceholder}
                                                    className="form-control custom-datepicker"
                                                    wrapperClassName="custom-datepicker-wrapper"
                                                    required
                                                    aria-label={t.modal.expiryDate}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>{t.modal.cvc}</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="cvc"
                                                    value={newCard.cvc}
                                                    onChange={handleInputChange}
                                                    placeholder={t.modal.cvcPlaceholder}
                                                    required
                                                    aria-label={t.modal.cvc}
                                                    className={language === 'ar' ? 'text-end' : 'text-start'}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3">
                                        <Form.Label>{t.modal.holderName}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="holderName"
                                            value={newCard.holderName}
                                            onChange={handleInputChange}
                                            placeholder={t.modal.holderNamePlaceholder}
                                            required
                                            aria-label={t.modal.holderName}
                                            className={language === 'ar' ? 'text-end' : 'text-start'}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>{t.modal.cardType}</Form.Label>
                                        <Form.Select
                                            name="type"
                                            value={newCard.type}
                                            onChange={handleInputChange}
                                            required
                                            aria-label={t.modal.cardType}
                                            className={language === 'ar' ? 'text-end' : 'text-start'}
                                        >
                                            <option value="Visa">{t.modal.visa}</option>
                                            <option value="Mastercard">{t.modal.mastercard}</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Button variant="success" type="submit">
                                        {t.modal.saveChanges}
                                    </Button>
                                </Form>
                            </Modal.Body>
                        </Modal>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default PaymentMethod;
