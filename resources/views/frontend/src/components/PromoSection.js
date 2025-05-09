import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { LanguageContext } from '../context/LanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/PromoSection.css';

function PromoSection() {
    const { language } = useContext(LanguageContext);
    const [content, setContent] = useState({
        cooking_ideas_badge: { en: '', ar: '' },
        cooking_ideas_title: { en: '', ar: '' },
        cooking_ideas_image: { image: '' },
        fast_delivery_badge: { en: '', ar: '' },
        fast_delivery_title: { en: '', ar: '' },
        fast_delivery_image: { image: '' },
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/promo_section`, {
                    headers: { 'Accept': 'application/json' },
                });
                const data = await response.json();
                const contentMap = {};
                data.forEach(item => {
                    contentMap[item.key] = item.key.includes('image') ? { image: item.image } : item.value;
                });
                setContent(contentMap);
            } catch (error) {
                console.error('Error fetching promo content:', error);
            }
        };
        fetchContent();
    }, []);

    const t = {
        cookingIdeasBadge: content.cooking_ideas_badge?.[language] || '',
        cookingIdeasTitle: content.cooking_ideas_title?.[language] || '',
        fastDeliveryBadge: content.fast_delivery_badge?.[language] || '',
        fastDeliveryTitle: content.fast_delivery_title?.[language] || '',
        getStarted: language === 'ar' ? 'ابدأ الآن' : 'Get Started',
    };

    return (
        <div className="promo-section py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={9} lg={6} className="mb-4">
                        <div
                            className="promo-card"
                            style={{
                                backgroundImage: `url(${content.cooking_ideas_image?.image
                                    ? `${process.env.REACT_APP_API_URL}/storage/${content.cooking_ideas_image.image}`
                                    : `${process.env.PUBLIC_URL}/assets/cooking-ideas.jpg`})`,
                            }}
                        >
                            <div className="badge badge-primary">{t.cookingIdeasBadge}</div>
                            <h3 className={`promo-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                {t.cookingIdeasTitle}
                            </h3>
                            <Button
                                variant="warning"
                                className={`promo-button ${language === 'ar' ? 'align-self-end' : 'align-self-start'}`}
                            >
                                {t.getStarted}
                            </Button>
                        </div>
                    </Col>
                    <Col md={9} lg={6} className="mb-4">
                        <div
                            className="promo-card"
                            style={{
                                backgroundImage: `url(${content.fast_delivery_image?.image
                                    ? `${process.env.REACT_APP_API_URL}/storage/${content.fast_delivery_image.image}`
                                    : `${process.env.PUBLIC_URL}/assets/fast-delivery.jpg`})`,
                            }}
                        >
                            <div className="badge badge-primary">{t.fastDeliveryBadge}</div>
                            <h3 className={`promo-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                                {t.fastDeliveryTitle}
                            </h3>
                            <Button
                                variant="warning"
                                className={`promo-button ${language === 'ar' ? 'align-self-end' : 'align-self-start'}`}
                            >
                                {t.getStarted}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default PromoSection;
