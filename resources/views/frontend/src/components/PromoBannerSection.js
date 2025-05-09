import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/PromoBannerSection.css';

function PromoBannerSection() {
  return (
    <div className="container promo-banner-section">
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