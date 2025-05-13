import React, { useState, useEffect, useContext } from 'react';
import { Container, Accordion } from 'react-bootstrap';
import { LanguageContext } from '../context/LanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/CookiesPolicy.css';

function CookiesPolicy() {
  const { language } = useContext(LanguageContext);
  const [policy, setPolicy] = useState({
    title_en: 'Cookies Policy',
    title_ar: 'سياسة ملفات تعريف الارتباط',
    description_en: 'Welcome to QuickPick – your trusted online grocery platform in Egypt.<br />QuickPick uses cookies to enhance your experience on our website.',
    description_ar: 'مرحبًا بك في QuickPick – منصتك الموثوقة للتسوق عبر الإنترنت في مصر.<br />تستخدم QuickPick ملفات تعريف الارتباط لتحسين تجربتك على موقعنا.',
    sections: [
      { header_en: 'What Are Cookies?', header_ar: 'ما هي ملفات تعريف الارتباط؟', body_en: 'Cookies are small files saved to your device to store preferences and enable functionality.', body_ar: 'ملفات تعريف الارتباط هي ملفات صغيرة تُحفظ على جهازك لتخزين التفضيلات وتمكين الوظائف.' },
      { header_en: 'Why We Use Them', header_ar: 'لماذا نستخدمها', body_en: '<ul><li>Essential site functionality (e.g., Google Analytics)</li><li>Personalized marketing and offers (if enabled)</li></ul>', body_ar: '<ul><li>وظائف الموقع الأساسية (مثل Google Analytics)</li><li>التسويق المخصص والعروض (إذا تم تمكينها)</li></ul>' },
      { header_en: 'Managing Cookies', header_ar: 'إدارة ملفات تعريف الارتباط', body_en: 'You can adjust cookie settings in your browser. Disabling cookies may affect how the website functions.', body_ar: 'يمكنك ضبط إعدادات ملفات تعريف الارتباط في متصفحك. تعطيل ملفات تعريف الارتباط قد يؤثر على كيفية عمل الموقع.' },
      { header_en: 'Consent', header_ar: 'الموافقة', body_en: 'By using our website, you agree to our use of cookies as described.', body_ar: 'باستخدام موقعنا، فإنك توافق على استخدامنا لملفات تعريف الارتباط كما هو موضح.' },
    ],
  });

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/policy_pages/Cookies`, {
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          credentials: token ? undefined : 'include',
        });
        if (!response.ok) {
          console.error('Fetch cookies policy failed with status:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Fetch cookies policy error response:', errorText);
          throw new Error(`Failed to fetch cookies policy: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Raw cookies policy data:', data);
        if (!data || Object.keys(data).length === 0) {
          console.warn('Fetched cookies policy data is empty');
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
        console.error('Error fetching cookies policy:', error.message);
      }
    };
    fetchPolicy();
  }, [language]);

  return (
    <div className="cookies-page">
      <Container className="py-5">
        <h1 className={`cookies-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
          {language === 'ar' ? policy.title_ar : policy.title_en}
        </h1>
        <p
          className={`cookies-welcome ${language === 'ar' ? 'text-end' : 'text-start'}`}
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

export default CookiesPolicy;
