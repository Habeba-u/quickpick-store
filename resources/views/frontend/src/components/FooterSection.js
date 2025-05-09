import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext'; // Import LanguageContext
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/FooterSection.css';
import { FaFacebookF, FaTwitter, FaTiktok, FaSnapchatGhost } from 'react-icons/fa';

function FooterSection() {
  const { language } = useContext(LanguageContext); // Access language from context
  const [showGetHelpModal, setShowGetHelpModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleGetHelpModalShow = () => setShowGetHelpModal(true);
  const handleGetHelpModalClose = () => setShowGetHelpModal(false);

  const handleSignUpModalShow = () => setShowSignUpModal(true);
  const handleSignUpModalClose = () => setShowSignUpModal(false);

  const handlePrivacyModalShow = () => setShowPrivacyModal(true);
  const handlePrivacyModalClose = () => setShowPrivacyModal(false);

  // Translations
  const translations = {
    en: {
      exclusiveDeals: 'Get Exclusive Deals in your Inbox',
      emailPlaceholder: 'youremail@gmail.com',
      subscribe: 'Subscribe',
      emailPolicy: "we won't spam, read our email policy",
      legalPages: 'Legal Pages',
      termsAndConditions: 'Terms and conditions',
      privacy: 'Privacy',
      cookies: 'Cookies',
      importantLinks: 'Important Links',
      getHelp: 'Get help',
      signUpToDeliver: 'Sign-up to deliver',
      copyright: 'QuickPick Copyright 2025, All Rights Reserved.',
      privacyPolicy: 'Privacy Policy',
      terms: 'Terms',
      doNotSell: 'Do not sell or share my personal information',
      getHelpModal: {
        title: 'Get Help',
        message1: 'Need assistance with your order, account, or delivery?',
        message2: 'Our support team is here to help you 7 days a week.',
        support: 'Customer Support: 189xx',
        email: 'Email: support@quickpick.com.eg',
        liveChat: 'Live Chat: Available 9 AM – 9 PM (Cairo Time)',
        helpCenter: 'Help Center: Browse FAQs',
        message3: 'We’re committed to making your experience smooth and stress-free.',
        close: 'Close',
      },
      signUpModal: {
        title: 'Sign Up to Deliver',
        message1: 'Want to earn money by delivering with QuickPick?',
        message2: 'Join our growing network of delivery partners and enjoy:',
        benefit1: 'Flexible working hours',
        benefit2: 'Weekly payouts',
        benefit3: 'Support from our dedicated team',
        benefit4: 'In-app navigation and order management',
        apply: 'Apply now at quickpick.com.ag/deliver',
        questions: 'Questions? Email us at delivery@quickpick.com.eg',
        close: 'Close',
      },
      privacyModal: {
        title: 'Do Not Sell or Share My Personal Information',
        message1: 'At QuickPick, we respect your privacy and are committed to protecting your personal information.',
        message2: 'We do not sell or share your personal information with third parties for marketing purposes without your consent.',
        message3: 'To learn more about how we handle your data, please review our Privacy Policy.',
        message4: 'If you have any questions or wish to opt out of data sharing, contact us at support@quickpick.com.eg.',
        close: 'Close',
      },
      address: (
        <>
          1234 Market Street, Suite 500<br />
          Downtown City, QC 56789<br />
          Countryland
        </>
      ),
    },
    ar: {
      exclusiveDeals: 'احصل على عروض حصرية في بريدك الإلكتروني',
      emailPlaceholder: 'بريدك_الإلكتروني@gmail.com',
      subscribe: 'اشترك',
      emailPolicy: 'لن نرسل بريدًا عشوائيًا، اقرأ سياسة البريد الإلكتروني الخاصة بنا',
      legalPages: 'الصفحات القانونية',
      termsAndConditions: 'الشروط والأحكام',
      privacy: 'الخصوصية',
      cookies: 'ملفات تعريف الارتباط',
      importantLinks: 'روابط مهمة',
      getHelp: 'احصل على المساعدة',
      signUpToDeliver: 'سجل لتصبح سائق توصيل',
      copyright: 'حقوق الطبع والنشر لـ QuickPick 2025، جميع الحقوق محفوظة.',
      privacyPolicy: 'سياسة الخصوصية',
      terms: 'الشروط',
      doNotSell: 'لا تبيع أو تشارك معلوماتي الشخصية',
      getHelpModal: {
        title: 'احصل على المساعدة',
        message1: 'هل تحتاج إلى مساعدة بشأن طلبك، حسابك، أو التوصيل؟',
        message2: 'فريق الدعم لدينا هنا لمساعدتك 7 أيام في الأسبوع.',
        support: 'دعم العملاء: 189xx',
        email: 'البريد الإلكتروني: support@quickpick.com.eg',
        liveChat: 'الدردشة المباشرة: متاحة من 9 صباحًا حتى 9 مساءً (بتوقيت القاهرة)',
        helpCenter: 'مركز المساعدة: تصفح الأسئلة الشائعة',
        message3: 'نحن ملتزمون بجعل تجربتك سلسة وخالية من التوتر.',
        close: 'إغلاق',
      },
      signUpModal: {
        title: 'سجل لتصبح سائق توصيل',
        message1: 'هل ترغب في كسب المال من خلال التوصيل مع QuickPick؟',
        message2: 'انضم إلى شبكتنا المتنامية من شركاء التوصيل واستمتع بـ:',
        benefit1: 'ساعات عمل مرنة',
        benefit2: 'دفعات أسبوعية',
        benefit3: 'دعم من فريقنا المخصص',
        benefit4: 'إدارة الطلبات والتنقل داخل التطبيق',
        apply: 'قدم الآن على quickpick.com.ag/deliver',
        questions: 'أسئلة؟ راسلنا عبر البريد الإلكتروني على delivery@quickpick.com.eg',
        close: 'إغلاق',
      },
      privacyModal: {
        title: 'لا تبيع أو تشارك معلوماتي الشخصية',
        message1: 'في QuickPick، نحن نحترم خصوصيتك وملتزمون بحماية معلوماتك الشخصية.',
        message2: 'لا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض التسويق دون موافقتك.',
        message3: 'لمعرفة المزيد عن كيفية تعاملنا مع بياناتك، يرجى مراجعة سياسة الخصوصية الخاصة بنا.',
        message4: 'إذا كانت لديك أي أسئلة أو ترغب في إلغاء مشاركة البيانات، تواصل معنا على support@quickpick.com.eg.',
        close: 'إغلاق',
      },
      address: (
        <>
          1234 شارع السوق، جناح 500<br />
          وسط المدينة، QC 56789<br />
          بلدستان
        </>
      ),
    },
  };

  const t = translations[language];

  return (
    <footer className="footer-section">
      <Container>
        <Row className={`py-5 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          {/* Part 1: Logo, App Store Buttons, and Address */}
          <Col md={4} className="mb-4">
            <div className="footer-logo mb-4">
              <img
                src={process.env.PUBLIC_URL + '/assets/quickpick-logo.png'}
                alt={language === 'ar' ? 'شعار QuickPick' : 'QuickPick Logo'}
                className="logo-image"
              />
            </div>
            <div className="app-store-buttons mb-3">
              <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
                <img
                  src={process.env.PUBLIC_URL + '/assets/app-store.png'}
                  alt={language === 'ar' ? 'متجر التطبيقات' : 'App Store'}
                  className="store-button"
                />
              </a>
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                <img
                  src={process.env.PUBLIC_URL + '/assets/google-play.png'}
                  alt={language === 'ar' ? 'جوجل بلاي' : 'Google Play'}
                  className="store-button"
                />
              </a>
            </div>
            <p className={`footer-address ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              {t.address}
            </p>
          </Col>

          {/* Part 2: Newsletter Subscription and Social Links */}
          <Col md={4} className="mb-4">
            <h5 className={`footer-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              {t.exclusiveDeals}
            </h5>
            <Form className="newsletter-form mb-3">
              <div className={`subscribe-container ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className="subscribe-input-wrapper">
                  <Form.Control
                    type="email"
                    placeholder={t.emailPlaceholder}
                    className="newsletter-input"
                  />
                </div>
                <button type="submit" className="subscribe-button">
                  {t.subscribe}
                </button>
              </div>
            </Form>
            <p className={`small-text ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              {t.emailPolicy}
            </p>
            <div className={`social-links d-flex ${language === 'ar' ? 'flex-row-reverse gap-15 justify-content-end' : 'gap-15'}`}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="social-icon" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="social-icon" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                <FaTiktok className="social-icon" />
              </a>
              <a href="https://snapchat.com" target="_blank" rel="noopener noreferrer">
                <FaSnapchatGhost className="social-icon" />
              </a>
            </div>
          </Col>

          {/* Part 3: Legal Pages */}
          <Col md={2} sm={4} className="mb-4">
            <h5 className={`footer-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              {t.legalPages}
            </h5>
            <ul className={`footer-links ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              <li><Link to="/terms-and-conditions">{t.termsAndConditions}</Link></li>
              <li><Link to="/privacy-policy">{t.privacy}</Link></li>
              <li><Link to="/cookies-policy">{t.cookies}</Link></li>
            </ul>
          </Col>

          {/* Part 4: Important Links */}
          <Col md={2} sm={4} className="mb-4">
            <h5 className={`footer-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              {t.importantLinks}
            </h5>
            <ul className={`footer-links ${language === 'ar' ? 'text-end' : 'text-start'}`}>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); handleGetHelpModalShow(); }}>
                  {t.getHelp}
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); handleSignUpModalShow(); }}>
                  {t.signUpToDeliver}
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

      {/* Bottom Bar */}
      <div className="bottom-bar py-3">
        <Container>
          <Row className={language === 'ar' ? 'flex-row-reverse' : ''}>
            <Col md={6} className={language === 'ar' ? 'text-md-end' : 'text-md-start'}>
              <p className="copyright-text">
                {t.copyright}
              </p>
            </Col>
            <Col md={6} className={language === 'ar' ? 'bottom-right text-md-start' : 'bottom-right text-md-end'}>
              <Link to="/privacy-policy" className="bottom-link">{t.privacyPolicy}</Link>
              <Link to="/terms-and-conditions" className="bottom-link">{t.terms}</Link>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handlePrivacyModalShow(); }}
                className="bottom-link"
              >
                {t.doNotSell}
              </a>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Get Help Modal */}
      <Modal show={showGetHelpModal} onHide={handleGetHelpModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t.getHelpModal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className={`align-items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <Col md={8}>
              <p className={language === 'ar' ? 'text-end' : 'text-start'}>
                {t.getHelpModal.message1}
                <br />
                {t.getHelpModal.message2}
              </p>
              <ul className={`help-list ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                <li>{t.getHelpModal.support}</li>
                <li>{t.getHelpModal.email}</li>
                <li>{t.getHelpModal.liveChat}</li>
                <li>
                  {t.getHelpModal.helpCenter.split(': ')[0]}:{' '}
                  <a href="#">{t.getHelpModal.helpCenter.split(': ')[1]}</a>
                </li>
              </ul>
              <p className={language === 'ar' ? 'text-end' : 'text-start'}>
                {t.getHelpModal.message3}
              </p>
            </Col>
            <Col md={4} className="text-center">
              <img
                src={process.env.PUBLIC_URL + '/assets/get-help-image.png'}
                alt={language === 'ar' ? 'رسم توضيحي للحصول على المساعدة' : 'Get Help Illustration'}
                className="modal-image"
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleGetHelpModalClose}>
            {t.getHelpModal.close}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Sign Up to Deliver Modal */}
      <Modal show={showSignUpModal} onHide={handleSignUpModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t.signUpModal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className={`align-items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <Col md={8}>
              <p className={language === 'ar' ? 'text-end' : 'text-start'}>
                {t.signUpModal.message1}
                <br />
                {t.signUpModal.message2}
              </p>
              <ul className={`signup-list ${language === 'ar' ? 'text-end' : 'text-start'}`}>
                <li>{t.signUpModal.benefit1}</li>
                <li>{t.signUpModal.benefit2}</li>
                <li>{t.signUpModal.benefit3}</li>
                <li>{t.signUpModal.benefit4}</li>
              </ul>
              <p className={language === 'ar' ? 'text-end' : 'text-start'}>
                <strong>{t.signUpModal.apply.split(' at')[0]}</strong> quickpick.com.ag/deliver
                <br />
                <strong>{t.signUpModal.questions.split('? ')[0]}؟</strong> {t.signUpModal.questions.split('? ')[1]}
              </p>
            </Col>
            <Col md={4} className="text-center">
              <img
                src={process.env.PUBLIC_URL + '/assets/sign-up-deliver-image.png'}
                alt={language === 'ar' ? 'رسم توضيحي للتسجيل للتوصيل' : 'Sign Up to Deliver Illustration'}
                className="modal-image"
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSignUpModalClose}>
            {t.signUpModal.close}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Do Not Sell or Share My Personal Information Modal */}
      <Modal show={showPrivacyModal} onHide={handlePrivacyModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t.privacyModal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className={language === 'ar' ? 'text-end' : 'text-start'}>
            {t.privacyModal.message1}
            <br />
            {t.privacyModal.message2}
          </p>
          <p className={language === 'ar' ? 'text-end' : 'text-start'}>
            {t.privacyModal.message3.split('Privacy Policy')[0]}
            <Link to="/privacy-policy">{t.privacy}</Link>.
            <br />
            {t.privacyModal.message4.split('support@quickpick.com.eg')[0]}
            <a href="mailto:support@quickpick.com.eg">support@quickpick.com.eg</a>.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePrivacyModalClose}>
            {t.privacyModal.close}
          </Button>
        </Modal.Footer>
      </Modal>
    </footer>
  );
}

export default FooterSection;