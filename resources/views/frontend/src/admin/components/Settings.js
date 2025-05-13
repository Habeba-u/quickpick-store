import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext';
import Sidebar from './Sidebar'; // Adjust the import path as needed
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css'; // Updated styles

function Settings() {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();

  const sections = [
    {
      title: language === 'ar' ? 'إعدادات البانر' : 'Banner Settings',
      description: language === 'ar' ? 'تحكم في محتوى البانر وصورته' : 'Control the banner content and image',
      path: '/admin/settings/banner',
    },
    {
      title: language === 'ar' ? 'إعدادات القسم الترويجي' : 'Promo Section Settings',
      description: language === 'ar' ? 'تحكم في محتوى القسم الترويجي وصوره' : 'Control the promo section content and images',
      path: '/admin/settings/promo_section',
    },
    {
      title: language === 'ar' ? 'إعدادات شريط التمرير في البحث' : 'Search Slider Settings',
      description: language === 'ar' ? 'تحكم في محتوى شريط التمرير وصوره' : 'Control the search page slider content and images',
      path: '/admin/settings/search_slider',
    },
    {
      title: language === 'ar' ? 'إعدادات صفحة العروض' : 'Offers Page Settings',
      description: language === 'ar' ? 'تحكم في محتوى صفحة العروض وصورها' : 'Control the offers page content and images',
      path: '/admin/settings/offers_page',
    },
    {
      title: language === 'ar' ? 'إعدادات قسم كيفية العمل' : 'How It Works Section Settings',
      description: language === 'ar' ? 'تحكم في محتوى قسم كيفية العمل' : 'Control the how it works section content',
      path: '/admin/settings/how_it_works_section',
    },
    {
      title: language === 'ar' ? 'إعدادات قسم البانر الترويجي' : 'Promo Banner Section Settings',
      description: language === 'ar' ? 'تحكم في صورتي البانر الترويجي (إنجليزي وعربي)' : 'Control the promo banner section images (English and Arabic)',
      path: '/admin/settings/promo_banner_section',
    },
    {
      title: language === 'ar' ? 'إعدادات صفحات السياسات' : 'Policy Pages Settings',
      description: language === 'ar' ? 'تحكم في محتوى صفحات الشروط والخصوصية وملفات تعريف الارتباط' : 'Control the content of Terms, Privacy, and Cookies pages',
      path: '/admin/settings/policy_pages',
    },
  ];

  return (
    <div className="settings-wrapper">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={3}>
          <Sidebar />
        </Col>

        {/* Main Content */}
        <Col md={9}>
          <Container fluid className="py-5 main-content">
            <h2 className={`mb-4 settings-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              {language === 'ar' ? 'إعدادات الموقع' : 'Website Settings'}
            </h2>
            <Row>
              {sections.map((section, index) => (
                <Col md={4} sm={6} key={index} className="mb-4">
                  <Card className="settings-card h-100">
                    <Card.Body className="d-flex flex-column p-4">
                      <Card.Title className={`settings-card-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                        {section.title}
                      </Card.Title>
                      <Card.Text className={`settings-card-text ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                        {section.description}
                      </Card.Text>
                      <Button
                        variant="primary"
                        className="settings-card-button mt-auto"
                        onClick={() => navigate(section.path)}
                      >
                        {language === 'ar' ? 'تعديل' : 'Edit'}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </Col>
      </Row>
    </div>
  );
}

export default Settings;
