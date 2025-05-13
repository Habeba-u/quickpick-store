import React, { useState, useEffect, useContext } from 'react';
import { Container, Accordion } from 'react-bootstrap';
import { LanguageContext } from '../context/LanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/PrivacyPolicy.css';

function PrivacyPolicy() {
  const { language } = useContext(LanguageContext);
  const [policy, setPolicy] = useState({
    title_en: 'Privacy Policy',
    title_ar: 'سياسة الخصوصية',
    description_en: 'Welcome to QuickPick – your trusted online grocery platform in Egypt.<br />QuickPick values your privacy and protects your personal information in accordance with Egyptian data protection practices.',
    description_ar: 'مرحبًا بك في QuickPick – منصتك الموثوقة للتسوق عبر الإنترنت في مصر.<br />تقدر QuickPick خصوصيتك وتحمي معلوماتك الشخصية وفقًا لممارسات حماية البيانات المصرية.',
    sections: [
      { header_en: 'Data Collected', header_ar: 'البيانات المجمعة', body_en: '<ul><li>Contact Information (Name, address, phone, email)</li><li>Order and transaction details</li><li>Usage data (through cookies and analytics tools)</li></ul>', body_ar: '<ul><li>معلومات الاتصال (الاسم، العنوان، الهاتف، البريد الإلكتروني)</li><li>تفاصيل الطلب والمعاملات</li><li>بيانات الاستخدام (من خلال ملفات تعريف الارتباط وأدوات التحليل)</li></ul>' },
      { header_en: 'Use of Data', header_ar: 'استخدام البيانات', body_en: '<ul><li>To process and deliver your orders</li><li>To improve website performance and service</li><li>To send updates or promotional offers (with your consent)</li></ul>', body_ar: '<ul><li>لمعالجة وتوصيل طلباتك</li><li>لتحسين أداء الموقع والخدمة</li><li>لإرسال تحديثات أو عروض ترويجية (بموافقتك)</li></ul>' },
      { header_en: 'Data Sharing', header_ar: 'مشاركة البيانات', body_en: 'We do not sell your data. We may share it only with:<ul><li>Delivery providers</li><li>Payment processors</li><li>Government authorities, when required by Egyptian law</li></ul>', body_ar: 'لا نبيع بياناتك. قد نشاركها فقط مع:<ul><li>مزودي التوصيل</li><li>معالجي الدفع</li><li>السلطات الحكومية، عندما يقتضي القانون المصري</li></ul>' },
      { header_en: 'Your Rights', header_ar: 'حقوقك', body_en: 'You have the right to:<ul><li>Access, update, or request deletion of your personal data</li><li>Contact us at support@quickpick.com for support</li></ul>', body_ar: 'لديك الحق في:<ul><li>الوصول إلى بياناتك الشخصية أو تحديثها أو طلب حذفها</li><li>التواصل معنا على support@quickpick.com للحصول على الدعم</li></ul>' },
      { header_en: 'Data Protection', header_ar: 'حماية البيانات', body_en: 'We use encryption and secure servers to protect your information.', body_ar: 'نستخدم التشفير والخوادم الآمنة لحماية معلوماتك.' },
    ],
  });

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/policy_pages/Privacy`, {
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          credentials: token ? undefined : 'include',
        });
        if (!response.ok) {
          console.error('Fetch privacy policy failed with status:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Fetch privacy policy error response:', errorText);
          throw new Error(`Failed to fetch privacy policy: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Raw privacy policy data:', data);
        if (!data || Object.keys(data).length === 0) {
          console.warn('Fetched privacy policy data is empty');
          return;
        }
        setPolicy({
          title_en: data.title_en || policy.title_en,
          title_ar: data.title_ar || policy.title_ar,
          description_en: data.description_en || policy.description_en,
          description_ar: data.description_ar || policy.description_ar,
          sections: data.sections && data.sections.length > 0 ? data.sections : policy.sections,
        });
      } catch (error) {
        console.error('Error fetching privacy policy:', error.message);
      }
    };
    fetchPolicy();
  }, [language]);

  return (
    <div className="privacy-page">
      <Container className="py-5">
        <h1 className={`privacy-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
          {language === 'ar' ? policy.title_ar : policy.title_en}
        </h1>
        <p
          className={`privacy-welcome ${language === 'ar' ? 'text-end' : 'text-start'}`}
          dangerouslySetInnerHTML={{ __html: language === 'ar' ? policy.description_ar : policy.description_en }}
        />

        <Accordion defaultActiveKey="0" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {policy.sections.map((section, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>
                {language === 'ar' ? section.header_ar : section.header_en}
              </Accordion.Header>
              <Accordion.Body
                dangerouslySetInnerHTML={{ __html: language === 'ar' ? section.body_ar : section.body_en }}
              />
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </div>
  );
}

export default PrivacyPolicy;
