import React from 'react';
import WhatsAppButton, { PHONE_NUMBER } from '../components/WhatsAppButton';

export default function ContactPage() {
  const formattedPhone = `+${PHONE_NUMBER}`;

  return (
    <section className="contact-page page-section">
      <div className="page-title">
        <h1>تواصلي معنا</h1>
        <p>
          للطلب أو الاستفسار عن أي قطعة، راسلينا عبر واتساب وسنساعدك باختيار التصميم الأنسب.
        </p>
      </div>

      <div className="contact-card">
        <div className="big-whatsapp" aria-hidden="true">☏</div>
        <h2>الطلبات عبر واتساب</h2>
        <p className="phone-number">{formattedPhone}</p>
        <WhatsAppButton className="large-contact-btn">ابدئي المحادثة الآن</WhatsAppButton>

        <div className="contact-info-grid">
          <div>
            <span>◷</span>
            <h3>أوقات الرد</h3>
            <p>نرد على رسائلكم يومياً<br />من 10 صباحاً حتى 10 مساءً</p>
          </div>
          <div>
            <span>⌖</span>
            <h3>طريقة الطلب</h3>
            <p>أرسلي صورة المنتج أو الفكرة<br />وسنوضح التفاصيل عبر واتساب</p>
          </div>
        </div>

        <div className="contact-note">
          <h3>لتسريع الطلب</h3>
          <p>يفضل إرسال نوع القطعة، اللون المطلوب، الاسم أو العبارة المراد إضافتها، وموعد المناسبة إن وجد.</p>
        </div>
      </div>
    </section>
  );
}
