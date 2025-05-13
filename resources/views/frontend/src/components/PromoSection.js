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
    cooking_ideas_image: '',
    fast_delivery_badge: { en: '', ar: '' },
    fast_delivery_title: { en: '', ar: '' },
    fast_delivery_image: '',
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/promo_section`, {
          headers: { 'Accept': 'application/json' },
          credentials: 'include',
        });
        console.log('Fetch promo content response status:', response.status, response.statusText);
        if (!response.ok) throw new Error('Failed to fetch promo section settings');
        const data = await response.json();
        console.log('Raw promo content:', data);
        const contentMap = {
          cooking_ideas_badge: { en: '', ar: '' },
          cooking_ideas_title: { en: '', ar: '' },
          cooking_ideas_image: '',
          fast_delivery_badge: { en: '', ar: '' },
          fast_delivery_title: { en: '', ar: '' },
          fast_delivery_image: '',
        };
        data.forEach(item => {
          if (item.key.includes('image')) {
            contentMap[item.key] = item.image ? `${process.env.REACT_APP_API_URL}/storage/${item.image}` : '';
          } else {
            // Split the key to remove language suffix (e.g., cooking_ideas_badge_en -> cooking_ideas_badge)
            const keyParts = item.key.split('_');
            const lang = item.language;
            // Join all parts except the last one (language) to form the base key
            const baseKey = keyParts.slice(0, -1).join('_');
            if (contentMap[baseKey]) {
              try {
                contentMap[baseKey][lang] = JSON.parse(item.value);
              } catch (e) {
                console.error(`Failed to parse value for ${item.key}:`, item.value);
              }
            } else {
              console.warn(`Unknown key ${item.key} in promo section data`);
            }
          }
        });
        console.log('Processed promo content:', contentMap);
        setContent(contentMap);
      } catch (error) {
        console.error('Error fetching promo content:', error);
      }
    };
    fetchContent();
  }, []);

  // Debug image loading
  useEffect(() => {
    const images = [content.cooking_ideas_image, content.fast_delivery_image];
    images.forEach((img) => {
      if (img) {
        const image = new Image();
        image.src = img;
        image.onerror = () => console.error('Failed to load promo image:', img);
      }
    });
  }, [content.cooking_ideas_image, content.fast_delivery_image]);

  const t = {
    cookingIdeasBadge: content.cooking_ideas_badge[language] || (language === 'ar' ? 'جديد' : 'New'),
    cookingIdeasTitle: content.cooking_ideas_title[language] || (language === 'ar' ? 'أفكار طهي مبتكرة' : 'Creative Cooking Ideas'),
    fastDeliveryBadge: content.fast_delivery_badge[language] || (language === 'ar' ? 'سريع' : 'Fast'),
    fastDeliveryTitle: content.fast_delivery_title[language] || (language === 'ar' ? 'توصيل سريع' : 'Fast Delivery'),
    getStarted: language === 'ar' ? 'ابدأ الآن' : 'Get Started',
  };

  console.log('Rendered text values:', t);

  return (
    <div className="promo-section py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={9} lg={6} className="mb-4">
            <div
              className="promo-card"
              style={{
                backgroundImage: `url(${content.cooking_ideas_image || `${process.env.PUBLIC_URL}/assets/cooking-ideas.jpg`})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
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
                backgroundImage: `url(${content.fast_delivery_image || `${process.env.PUBLIC_URL}/assets/fast-delivery.jpg`})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
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
