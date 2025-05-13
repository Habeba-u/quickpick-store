import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { LanguageContext } from '../context/LanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/PromoBannerSection.css';

function PromoBannerSection() {
  const { language } = useContext(LanguageContext);
  const [backgroundImages, setBackgroundImages] = useState({
    en: '',
    ar: '',
  });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/settings/promo_banner_section`, {
          headers: { 'Accept': 'application/json' },
          credentials: 'include',
        });
        console.log('Fetch promo banner images response status:', response.status, response.statusText);
        if (!response.ok) throw new Error('Failed to fetch promo banner settings');
        const data = await response.json();
        console.log('Raw promo banner images data:', data);
        const images = { en: '', ar: '' };
        data.forEach(item => {
          if (item.key === 'promo_banner_image_en' && item.image) {
            images.en = `${process.env.REACT_APP_API_URL}/storage/${item.image}`;
          } else if (item.key === 'promo_banner_image_ar' && item.image) {
            images.ar = `${process.env.REACT_APP_API_URL}/storage/${item.image}`;
          }
        });
        setBackgroundImages(images);
      } catch (error) {
        console.error('Error fetching promo banner images:', error);
      }
    };
    fetchImages();
  }, []);

  // Debug image loading
  useEffect(() => {
    const imageUrl = backgroundImages[language];
    if (imageUrl) {
      const image = new Image();
      image.src = imageUrl;
      image.onerror = () => console.error('Failed to load promo banner image:', imageUrl);
    }
  }, [backgroundImages, language]);

  const defaultImage = language === 'ar'
    ? `${process.env.PUBLIC_URL}/assets/promo-banner-image-ar.png`
    : `${process.env.PUBLIC_URL}/assets/promo-banner-image.png`;

  return (
    <div
      className="container promo-banner-section"
      style={{
        backgroundImage: `url(${backgroundImages[language] || defaultImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container>
        <Row className="">
          <Col md={7} className="text-center">
          </Col>
          <Col md={4} className="text-center">
            <div className="promo-text">
              <div className="app-store-buttons">
                <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
                  <img
                    src={process.env.PUBLIC_URL + '/assets/app-store.png'}
                    alt="App Store"
                    className="store-button"
                  />
                </a>
                <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                  <img
                    src={process.env.PUBLIC_URL + '/assets/google-play.png'}
                    alt="Google Play"
                    className="store-button"
                  />
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PromoBannerSection;
