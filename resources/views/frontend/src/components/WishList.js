import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/WishList.css';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { LanguageContext } from '../context/LanguageContext';

function Wishlist() {
    const { language } = useContext(LanguageContext);
    const { addToCart } = useContext(CartContext);
    const { wishlist, removeFromWishlist, setWishlist } = useContext(WishlistContext);

    // Translations
    const translations = {
        en: {
            title: 'My Wishlist',
            subtitle: (count) => `${count} Items to purchase later`,
            emptyWishlist: 'Your wishlist is empty.',
            deleteAll: 'Delete all list',
            addAll: 'Add all list to cart',
            addToCart: 'Add to Cart',
            remove: 'Remove from Wishlist',
            stockStatus: {
                inStock: 'In Stock',
                lowStock: 'Low Stock',
            },
            saved: 'Saved',
            timeUnits: {
                day: 'day',
                days: 'days',
                hour: 'hour',
                hours: 'hours',
                minute: 'minute',
                minutes: 'minutes',
                second: 'second',
                seconds: 'seconds',
            },
        },
        ar: {
            title: 'قائمة أمنياتي',
            subtitle: (count) => `${count} عناصر للشراء لاحقًا`,
            emptyWishlist: 'قائمة أمنياتك فارغة.',
            deleteAll: 'حذف كل القائمة',
            addAll: 'إضافة كل القائمة إلى السلة',
            addToCart: 'إضافة إلى السلة',
            remove: 'إزالة من قائمة الأمنيات',
            stockStatus: {
                inStock: 'متوفر',
                lowStock: 'مخزون منخفض',
            },
            saved: 'تم الحفظ منذ',
            timeUnits: {
                day: 'يوم',
                days: 'أيام',
                hour: 'ساعة',
                hours: 'ساعات',
                minute: 'دقيقة',
                minutes: 'دقائق',
                second: 'ثانية',
                seconds: 'ثواني',
            },
        },
    };

    const t = translations[language];

    const getTimeDifference = (addedAt) => {
        const now = new Date();
        const addedTime = new Date(addedAt);
        const diffInMs = now - addedTime;

        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays > 0) {
            return `${diffInDays} ${t.timeUnits[diffInDays > 1 ? 'days' : 'day']}`;
        } else if (diffInHours > 0) {
            return `${diffInHours} ${t.timeUnits[diffInHours > 1 ? 'hours' : 'hour']}`;
        } else if (diffInMinutes > 0) {
            return `${diffInMinutes} ${t.timeUnits[diffInMinutes > 1 ? 'minutes' : 'minute']}`;
        } else {
            return `${diffInSeconds} ${t.timeUnits[diffInSeconds > 1 ? 'seconds' : 'second']}`;
        }
    };

    const wishlistItems = wishlist.map((product) => ({
        id: product.id,
        name: language === 'ar' && product.name_ar ? product.name_ar : product.name,
        brand: language === 'ar' ? 'ماركة كويك بيك' : 'QuickPick Brand',
        price: `${parseFloat(product.price).toFixed(2)} ${language === 'ar' ? 'ج.م.' : 'EGP'}`,
        originalPrice: `${(parseFloat(product.price) + 20).toFixed(2)} ${language === 'ar' ? 'ج.م.' : 'EGP'}`,
        stockStatus: product.id % 2 === 0 ? t.stockStatus.lowStock : t.stockStatus.inStock,
        savedTime: getTimeDifference(product.addedAt),
        image: product.image,
    }));

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        rtl: language === 'ar',
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className="wishlist-page">
            <Container className="py-5 wishlist-section">
                <h1 className={`wishlist-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                    {t.title}
                </h1>
                <p className={`wishlist-subtitle ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                    {t.subtitle(wishlistItems.length)}
                </p>
                <div className={`wishlist-actions mb-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Button
                        variant="danger"
                        className={`delete-all-button ${language === 'ar' ? 'ms-3' : 'me-3'}`}
                        onClick={() => {
                            setWishlist([]);
                            console.log('Wishlist cleared');
                        }}
                        disabled={wishlistItems.length === 0}
                    >
                        {t.deleteAll}
                    </Button>
                    <Button
                        variant="success"
                        className="add-all-button"
                        onClick={() => {
                            wishlistItems.forEach((item) => {
                                const product = wishlist.find((p) => p.id === item.id);
                                if (product) addToCart(product, 1);
                            });
                        }}
                        disabled={wishlistItems.length === 0}
                    >
                        {t.addAll}
                    </Button>
                </div>

                {wishlistItems.length === 0 ? (
                    <p className={language === 'ar' ? 'text-end' : 'text-start'}>{t.emptyWishlist}</p>
                ) : wishlistItems.length > 4 ? (
                    <Slider {...settings}>
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="wishlist-slide px-2">
                                <Row>
                                    <Col md={12}>
                                        <Card className="wishlist-card">
                                            <div className="wishlist-image-wrapper">
                                                <Card.Img
                                                    variant="top"
                                                    src={item.image
                                                        ? `${process.env.REACT_APP_API_URL}/storage/${item.image}`
                                                        : '/assets/placeholder.jpg'}
                                                    alt={item.name}
                                                    className="wishlist-image"
                                                    onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
                                                />
                                            </div>
                                            <Card.Body>
                                                <Card.Title className={`wishlist-item-name ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                                    {item.name}
                                                </Card.Title>
                                                <Card.Text className={`wishlist-brand ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                                    {item.brand}
                                                </Card.Text>
                                                <Card.Text className={`wishlist-price ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                                    {item.price}{' '}
                                                    <span className="original-price">{item.originalPrice}</span>
                                                </Card.Text>
                                                <Card.Text
                                                    className={`wishlist-stock ${
                                                        item.stockStatus === t.stockStatus.lowStock ? 'low-stock' : 'in-stock'
                                                    } ${language === 'ar' ? 'text-end' : 'text-start'}`}
                                                >
                                                    {item.stockStatus}
                                                </Card.Text>
                                                <div className={`wishlist-buttons ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                    <Button
                                                        variant="success"
                                                        className={`add-to-cart-button ${language === 'ar' ? 'ms-2' : 'me-2'}`}
                                                        onClick={() => {
                                                            const product = wishlist.find((p) => p.id === item.id);
                                                            if (product) addToCart(product, 1);
                                                        }}
                                                    >
                                                        {t.addToCart}
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        className="remove-button"
                                                        onClick={() => removeFromWishlist(item.id)}
                                                    >
                                                        {t.remove}
                                                    </Button>
                                                </div>
                                                <Card.Text className={`wishlist-saved-time ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                                    {t.saved} {item.savedTime}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <Row>
                        {wishlistItems.map((item) => (
                            <Col md={3} key={item.id} className="mb-4">
                                <Card className="wishlist-card">
                                    <Card.Img
                                        variant="top"
                                        src={item.image
                                            ? `${process.env.REACT_APP_API_URL}/storage/${item.image}`
                                            : '/assets/placeholder.jpg'}
                                        alt={item.name}
                                        className="wishlist-image"
                                        onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
                                    />
                                    <Card.Body>
                                        <Card.Title className={`wishlist-item-name ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                            {item.name}
                                        </Card.Title>
                                        <Card.Text className={`wishlist-brand ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                            {item.brand}
                                        </Card.Text>
                                        <Card.Text className={`wishlist-price ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                            {item.price}{' '}
                                            <span className="original-price">{item.originalPrice}</span>
                                        </Card.Text>
                                        <Card.Text
                                            className={`wishlist-stock ${
                                                item.stockStatus === t.stockStatus.lowStock ? 'low-stock' : 'in-stock'
                                            } ${language === 'ar' ? 'text-end' : 'text-start'}`}
                                        >
                                            {item.stockStatus}
                                        </Card.Text>
                                        <div className={`wishlist-buttons ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <Button
                                                variant="success"
                                                className={`add-to-cart-button ${language === 'ar' ? 'ms-2' : 'me-2'}`}
                                                onClick={() => {
                                                    const product = wishlist.find((p) => p.id === item.id);
                                                    if (product) addToCart(product, 1);
                                                }}
                                            >
                                                {t.addToCart}
                                            </Button>
                                            <Button
                                                variant="danger"
                                                className="remove-button"
                                                onClick={() => removeFromWishlist(item.id)}
                                            >
                                                {t.remove}
                                            </Button>
                                        </div>
                                        <Card.Text className={`wishlist-saved-time ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                            {t.saved} {item.savedTime}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
}

export default Wishlist;
