import React, { useState, useEffect, useContext } from 'react';
import { Container, Accordion } from 'react-bootstrap';
import { LanguageContext } from '../context/LanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/TermsAndConditions.css';

function TermsAndConditions() {
  const { language } = useContext(LanguageContext);
  const [policy, setPolicy] = useState({
    title_en: 'Terms and Conditions',
    title_ar: 'الشروط والأحكام',
    description_en: 'Welcome to QuickPick – your trusted online grocery platform in Egypt.<br />By using our website (<a href="http://www.quickpick.com">www.quickpick.com</a>), you agree to comply with these Terms and Conditions. If you do not accept the Terms and Conditions stated here, please refrain from using our website.',
    description_ar: 'مرحبًا بك في QuickPick – منصتك الموثوقة للتسوق عبر الإنترنت في مصر.<br />باستخدام موقعنا (<a href="http://www.quickpick.com">www.quickpick.com</a>)، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا لم تقبل الشروط والأحكام المذكورة هنا، يرجى الامتناع عن استخدام موقعنا.',
    sections: [
      { header_en: 'About QuickPick', header_ar: 'عن QuickPick', body_en: 'QuickPick is an Egyptian online platform that delivers groceries and daily essentials directly to customers. We do not use third-party sellers. All products are offered by QuickPick.', body_ar: 'QuickPick هي منصة مصرية عبر الإنترنت تقوم بتوصيل البقالة والضروريات اليومية مباشرة إلى العملاء. لا نستخدم بائعين من طرف ثالث. جميع المنتجات مقدمة من QuickPick.' },
      { header_en: 'Eligibility', header_ar: 'الأهلية', body_en: 'You must be at least 18 years old and legally competent under Egyptian law to use our website.', body_ar: 'يجب أن تكون في سن 18 عامًا على الأقل وكفؤًا قانونيًا بموجب القانون المصري لاستخدام موقعنا.' },
      { header_en: 'User Account', header_ar: 'حساب المستخدم', body_en: 'When registering, you must provide accurate and complete information. You are responsible for all activities under your account.', body_ar: 'عند التسجيل، يجب عليك تقديم معلومات دقيقة وكاملة. أنت مسؤول عن جميع الأنشطة تحت حسابك.' },
      { header_en: 'Pricing and Payment', header_ar: 'التسعير والدفع', body_en: 'Prices are listed in Egyptian Pounds (EGP) and include applicable taxes. Payment must be made securely through the provided options (e.g., credit card, mobile wallets, or cash on delivery if available).', body_ar: 'الأسعار مدرجة بالجنيه المصري (EGP) وتشمل الضرائب المعمول بها. يجب أن يتم الدفع بشكل آمن من خلال الخيارات المقدمة (مثل بطاقة الائتمان، المحافظ الإلكترونية، أو الدفع عند الاستلام إذا كان متاحًا).' },
      { header_en: 'Delivery', header_ar: 'التوصيل', body_en: 'We deliver to selected locations within Egypt. Delivery times are estimated and may vary due to unforeseen circumstances.', body_ar: 'نقوم بالتوصيل إلى مواقع محددة داخل مصر. أوقات التوصيل تقديرية وقد تختلف بسبب ظروف غير متوقعة.' },
      { header_en: 'Cancellations & Returns', header_ar: 'الإلغاء والإرجاع', body_en: 'You may cancel or return an order in accordance with Egyptian Consumer Protection Law. Refunds are processed based on product condition and time of return request.', body_ar: 'يمكنك إلغاء أو إرجاع الطلب وفقًا لقانون حماية المستهلك المصري. يتم معالجة المبالغ المستردة بناءً على حالة المنتج ووقت طلب الإرجاع.' },
      { header_en: 'Intellectual Property', header_ar: 'الملكية الفكرية', body_en: 'All website content (logos, designs, data, etc.) is owned by QuickPick and protected under Egyptian intellectual property laws.', body_ar: 'جميع محتويات الموقع (الشعارات، التصاميم، البيانات، إلخ) مملوكة لـ QuickPick ومحمية بموجب قوانين الملكية الفكرية المصرية.' },
      { header_en: 'Liability Limitation', header_ar: 'تحديد المسؤولية', body_en: 'QuickPick is not liable for indirect damages resulting from delays, product availability, or technical issues beyond our control.', body_ar: 'QuickPick غير مسؤول عن الأضرار غير المباشرة الناتجة عن التأخيرات، توفر المنتج، أو المشكلات التقنية خارجة عن سيطرتنا.' },
      { header_en: 'Governing Law', header_ar: 'القانون الحاكم', body_en: 'These Terms are governed by the laws of the Arab Republic of Egypt, and disputes shall be settled in Egyptian courts.', body_ar: 'تخضع هذه الشروط لقوانين جمهورية مصر العربية، ويتم تسوية النزاعات في المحاكم المصرية.' },
      { header_en: 'Updates to Terms', header_ar: 'تحديثات الشروط', body_en: 'We may modify these Terms at any time, and updates are effective immediately upon posting. Updated versions will be posted on this page.', body_ar: 'يجوز لنا تعديل هذه الشروط في أي وقت، وتسري التحديثات فور النشر. سيتم نشر الإصدارات المحدثة على هذه الصفحة.' },
    ],
  });

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/policy_pages/Terms`, {
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          credentials: token ? undefined : 'include',
        });
        if (!response.ok) {
          console.error('Fetch terms policy failed with status:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Fetch terms policy error response:', errorText);
          throw new Error(`Failed to fetch terms policy: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Raw terms policy data:', data);
        if (!data || Object.keys(data).length === 0) {
          console.warn('Fetched terms policy data is empty');
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
        console.error('Error fetching terms policy:', error.message);
      }
    };
    fetchPolicy();
  }, [language]); // Added language dependency

  return (
    <div className="terms-page">
      <Container className="py-5">
        <h1 className={`terms-title ${language === 'ar' ? 'text-end' : 'text-start'}`}>
          {language === 'ar' ? policy.title_ar : policy.title_en}
        </h1>
        <p
          className={`terms-welcome ${language === 'ar' ? 'text-end' : 'text-start'}`}
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

export default TermsAndConditions;
