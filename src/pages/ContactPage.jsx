import WhatsAppButton, { PHONE_NUMBER } from '../components/WhatsAppButton';
import React from 'react';
export default function ContactPage() {
  const formattedPhone = `+${PHONE_NUMBER}`;

  return (
    <section className="contact-page page-section">
      <div className="page-title">
        <h1>تواصل معنا</h1>
        <p>نحن هنا للإجابة على جميع استفساراتك وتلقي طلباتك الخاصة. نستقبل جميع الطلبات عبر تطبيق الواتساب.</p>
      </div>

      <div className="contact-card">
        <div className="big-whatsapp">☏</div>
        <h2>راسلنا على واتساب</h2>
        <p className="phone-number">{formattedPhone}</p>
        <WhatsAppButton className="large-contact-btn">ابدأ المحادثة الآن</WhatsAppButton>

        <div className="contact-info-grid">
          <div>
            <span>◷</span>
            <h3>أوقات العمل</h3>
            <p>نرد على رسائلكم يومياً<br />من 10 صباحاً حتى 10 مساءً</p>
          </div>
          <div>
            <span>⌖</span>
            <h3>موقعنا</h3>
            <p>متجر إلكتروني<br />نوصل لجميع المناطق</p>
          </div>
        </div>
      </div>
    </section>
  );
}
