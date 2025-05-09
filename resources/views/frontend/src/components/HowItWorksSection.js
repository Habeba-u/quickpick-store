import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap';
import { LanguageContext } from '../context/LanguageContext'; // Import LanguageContext
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/HowItWorksSection.css';

function HowItWorksSection() {
  const { language } = useContext(LanguageContext); // Access language from context
  const [activeTab, setActiveTab] = useState('variant1');

  // Translations
  const translations = {
    en: {
      sectionTitle: 'How does QuickPick work?',
      tab1: 'How does QuickPick work?',
      tab2: 'What payment methods are accepted?',
      tab3: 'Can I track my order in real-time?',
      tab4: 'Are there any special discounts or promotions available?',
      tab5: 'Is QuickPick available in my area?',
      variant1: {
        cards: [
          { title: 'Place an Order!', subtitle: 'Place order through our website or Mobile app' },
          { title: 'Track Progress', subtitle: 'You can track your order status with delivery time' },
          { title: 'Get your Order!', subtitle: 'Receive your order at a lightning fast speed!' },
        ],
        description:
          'QuickPick makes grocery shopping effortless! Browse a wide selection of products, pick your favorite items, and checkout in seconds. Your essentials will be delivered straight to your doorstep—fast, fresh, and hassle-free!',
      },
      variant2: {
        cards: [
          {
            title: 'Pay with Ease',
            subtitle: 'Securely checkout using Visa, Mastercard, and more! Fast, safe, and hassle-free',
          },
          {
            title: 'Mobile Payments',
            subtitle: 'Use Apple Pay or Google Pay for a one-click, ultra-fast checkout experience.',
          },
          {
            title: 'Pay When You Receive!',
            subtitle: 'Prefer cash? No problem! Pay upon delivery, stress-free.',
          },
        ],
        description:
          'QuickPick makes grocery shopping effortless! Browse a wide selection of products, pick your favorite items, and checkout in seconds. Your essentials will be delivered straight to your doorstep—fast, fresh, and hassle-free!',
      },
      variant3: {
        cards: [
          { title: 'Yes!', subtitle: 'You can track your order in real-time!' },
          {
            title: 'Once your order is confirmed',
            subtitle: "You'll see every step of the process, from preparation to delivery.",
          },
          {
            title: 'Stay in the loop',
            subtitle: 'Stay updated as your order speeds its way to your doorstep!',
          },
        ],
        description:
          'QuickPick makes grocery shopping effortless! Browse a wide selection of products, pick your favorite items, and checkout in seconds. Your essentials will be delivered straight to your doorstep—fast, fresh, and hassle-free!',
      },
      variant4: {
        title: 'Yes, we have some exciting discounts and promotions just for you!',
        description:
          'QuickPick offers special deals, seasonal offers, and exclusive discounts on your favorite products. Stay tuned for flash sales and surprise deals to make your shopping even better!',
        descriptionBelow:
          'QuickPick makes grocery shopping effortless! Browse a wide selection of products, pick your favorite items, and checkout in seconds. Your essentials will be delivered straight to your doorstep—fast, fresh, and hassle-free!',
      },
      variant5: {
        title: "We're expanding fast!",
        description:
          'To check QuickPick deliveries in your location, if we’re not in your area yet, don’t worry! Stay tuned as we’re constantly adding new locations.',
        descriptionBelow:
          'QuickPick makes grocery shopping effortless! Browse a wide selection of products, pick your favorite items, and checkout in seconds. Your essentials will be delivered straight to your doorstep—fast, fresh, and hassle-free!',
      },
    },
    ar: {
      sectionTitle: 'كيف يعمل QuickPick؟',
      tab1: 'كيف يعمل QuickPick؟',
      tab2: 'ما هي طرق الدفع المقبولة؟',
      tab3: 'هل يمكنني تتبع طلبي في الوقت الفعلي؟',
      tab4: 'هل هناك خصومات أو عروض ترويجية خاصة متاحة؟',
      tab5: 'هل QuickPick متاح في منطقتي؟',
      variant1: {
        cards: [
          { title: 'قدم طلبك!', subtitle: 'قدم طلبك من خلال موقعنا الإلكتروني أو تطبيق الهاتف' },
          { title: 'تتبع التقدم', subtitle: 'يمكنك تتبع حالة طلبك مع وقت التسليم' },
          { title: 'استلم طلبك!', subtitle: 'استلم طلبك بسرعة فائقة!' },
        ],
        description:
          'يجعل QuickPick التسوق للبقالة سهلاً! تصفح مجموعة واسعة من المنتجات، اختر العناصر المفضلة لديك، وأكمل الدفع في ثوانٍ. سيتم توصيل احتياجاتك مباشرة إلى باب منزلك—سريعة، طازجة، وبدون متاعب!',
      },
      variant2: {
        cards: [
          {
            title: 'ادفع بسهولة',
            subtitle: 'أكمل الدفع بأمان باستخدام فيزا، ماستركارد، وغيرها! سريع، آمن، وبدون متاعب',
          },
          {
            title: 'الدفع عبر الهاتف',
            subtitle: 'استخدم Apple Pay أو Google Pay لتجربة دفع سريعة بنقرة واحدة.',
          },
          {
            title: 'ادفع عند الاستلام!',
            subtitle: 'تفضل الدفع نقدًا؟ لا مشكلة! ادفع عند التسليم، بدون قلق.',
          },
        ],
        description:
          'يجعل QuickPick التسوق للبقالة سهلاً! تصفح مجموعة واسعة من المنتجات، اختر العناصر المفضلة لديك، وأكمل الدفع في ثوانٍ. سيتم توصيل احتياجاتك مباشرة إلى باب منزلك—سريعة، طازجة، وبدون متاعب!',
      },
      variant3: {
        cards: [
          { title: 'نعم!', subtitle: 'يمكنك تتبع طلبك في الوقت الفعلي!' },
          {
            title: 'بمجرد تأكيد طلبك',
            subtitle: 'سترى كل خطوة في العملية، من التحضير إلى التسليم.',
          },
          {
            title: 'ابقَ على اطلاع',
            subtitle: 'ابقَ محدثًا بينما يسرع طلبك في طريقه إلى باب منزلك!',
          },
        ],
        description:
          'يجعل QuickPick التسوق للبقالة سهلاً! تصفح مجموعة واسعة من المنتجات، اختر العناصر المفضلة لديك، وأكمل الدفع في ثوانٍ. سيتم توصيل احتياجاتك مباشرة إلى باب منزلك—سريعة، طازجة، وبدون متاعب!',
      },
      variant4: {
        title: 'نعم، لدينا بعض الخصومات والعروض الترويجية المثيرة خصيصًا لك!',
        description:
          'يقدم QuickPick عروضًا خاصة، عروض موسمية، وخصومات حصرية على منتجاتك المفضلة. تابعنا للحصول على مبيعات فلاش وعروض مفاجئة لجعل تسوقك أفضل!',
        descriptionBelow:
          'يجعل QuickPick التسوق للبقالة سهلاً! تصفح مجموعة واسعة من المنتجات، اختر العناصر المفضلة لديك، وأكمل الدفع في ثوانٍ. سيتم توصيل احتياجاتك مباشرة إلى باب منزلك—سريعة، طازجة، وبدون متاعب!',
      },
      variant5: {
        title: 'نحن نتوسع بسرعة!',
        description:
          'لتفقد توصيلات QuickPick في منطقتك، إذا لم نكن في منطقتك بعد، لا تقلق! تابعنا بينما نضيف مواقع جديدة باستمرار.',
        descriptionBelow:
          'يجعل QuickPick التسوق للبقالة سهلاً! تصفح مجموعة واسعة من المنتجات، اختر العناصر المفضلة لديك، وأكمل الدفع في ثوانٍ. سيتم توصيل احتياجاتك مباشرة إلى باب منزلك—سريعة، طازجة، وبدون متاعب!',
      },
    },
  };

  const t = translations[language];
  const variants = t;

  return (
    <div className="py-5">
      <Container className="how-it-works-div">
        {/* Title */}
        <h2 className={`section-title mb-4 ${language === 'ar' ? 'text-end' : 'text-start'}`}>
          {t.sectionTitle}
        </h2>

        <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
          <Row className={`how-it-works-section justify-content-center ${language === 'ar' ? '' : ''}`}>
            {/* Left Side: Questions (Tabs) */}
            <Col md={9} lg={3}>
              <Nav variant="pills" className={`flex-column ${language === 'ar' ? '' : ''}`}>
                <Nav.Item>
                  <Nav.Link eventKey="variant1">{t.tab1}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="variant2">{t.tab2}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="variant3">{t.tab3}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="variant4">{t.tab4}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="variant5">{t.tab5}</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>

            {/* Right Side: Tab Content */}
            <Col md={9}>
              <Tab.Content>
                {/* Tab 1: Three Cards */}
                <Tab.Pane eventKey="variant1">
                  <Row className="justify-content-center">
                    {variants.variant1.cards.map((card, index) => (
                      <Col md={10} lg={4} key={index} className="mb-4">
                        <Card className="how-it-works-card">
                          <Card.Title className="card-title">{card.title}</Card.Title>
                          <Card.Img
                            src={process.env.PUBLIC_URL + `/assets/howit-${index + 1}.png`}
                            alt={card.title}
                            className="card-image"
                          />
                          <Card.Subtitle className="card-subtitle">
                            {card.subtitle}
                          </Card.Subtitle>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <p className="description">{variants.variant1.description}</p>
                </Tab.Pane>

                {/* Tab 2: Three Cards */}
                <Tab.Pane eventKey="variant2">
                  <Row className="justify-content-center">
                    {variants.variant2.cards.map((card, index) => (
                      <Col md={10} lg={4} key={index} className="mb-4">
                        <Card className="how-it-works-card">
                          <Card.Title className="card-title">{card.title}</Card.Title>
                          <Card.Img
                            src={process.env.PUBLIC_URL + `/assets/payment-methods-${index + 1}.png`}
                            alt={card.title}
                            className="card-image"
                          />
                          <Card.Subtitle className="card-subtitle">
                            {card.subtitle}
                          </Card.Subtitle>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <p className="description">{variants.variant2.description}</p>
                </Tab.Pane>

                {/* Tab 3: Three Cards */}
                <Tab.Pane eventKey="variant3">
                  <Row className="justify-content-center">
                    {variants.variant3.cards.map((card, index) => (
                      <Col md={10} lg={4} key={index} className="mb-4">
                        <Card className="how-it-works-card">
                          <Card.Title className="card-title">{card.title}</Card.Title>
                          <Card.Img
                            src={
                              index === 2
                                ? process.env.PUBLIC_URL + '/assets/howit-2.png'
                                : process.env.PUBLIC_URL + `/assets/order-${index + 1}.png`
                            }
                            alt={card.title}
                            className="card-image"
                          />
                          <Card.Subtitle className="card-subtitle">
                            {card.subtitle}
                          </Card.Subtitle>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <p className="description">{variants.variant3.description}</p>
                </Tab.Pane>

                {/* Tab 4: Single Large Card with Image */}
                <Tab.Pane eventKey="variant4">
                  <Row className={`align-items-center ${language === 'ar' ? '' : ''}`}>
                    <Col md={12} className="mb-4">
                      <Card className="large-card">
                        <Card.Body className={`row ${language === 'ar' ? '' : ''}`}>
                          <Col md={12} lg={8} className="mb-4">
                            <Card.Title className={`large-card-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                              {variants.variant4.title}
                            </Card.Title>
                            <Card.Text className={`large-card-description ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                              {variants.variant4.description}
                            </Card.Text>
                          </Col>
                          <Col md={12} lg={4} className="mb-4">
                            <img
                              src={process.env.PUBLIC_URL + '/assets/dicounts.png'}
                              alt={language === 'ar' ? 'خصومات' : 'Discounts'}
                              className="large-card-image"
                            />
                          </Col>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  <p className="description">{variants.variant4.descriptionBelow}</p>
                </Tab.Pane>

                {/* Tab 5: Single Large Card with Image */}
                <Tab.Pane eventKey="variant5">
                  <Row className={`align-items-center ${language === 'ar' ? '' : ''}`}>
                    <Col md={12} className="mb-4">
                      <Card className="large-card">
                        <Card.Body className={`row ${language === 'ar' ? '' : ''}`}>
                          <Col md={12} lg={8} className="mb-4">
                            <Card.Title className={`large-card-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                              {variants.variant5.title}
                            </Card.Title>
                            <Card.Text className={`large-card-description ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                              {variants.variant5.description}
                            </Card.Text>
                          </Col>
                          <Col md={12} lg={4} className="mb-4">
                            <img
                              src={process.env.PUBLIC_URL + '/assets/expanding.png'}
                              alt={language === 'ar' ? 'التوسع' : 'Expanding'}
                              className="large-card-image"
                            />
                          </Col>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  <p className="description">{variants.variant5.descriptionBelow}</p>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
}

export default HowItWorksSection;