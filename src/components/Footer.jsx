import React from 'react';
import { NavLink } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <h2>Kh Resin Art</h2>
        <p>
          فن الريزن بلمسة ناعمة. قطع يدوية للهدايا، الديكور، والمناسبات الخاصة، مع إمكانية تنفيذ تصاميم حسب الطلب.
        </p>

        <div className="footer-links">
          <NavLink to="/">الرئيسية</NavLink>
          <NavLink to="/products">المنتجات</NavLink>
          <NavLink to="/about">من نحن</NavLink>
          <NavLink to="/contact">تواصل معنا</NavLink>
        </div>

        <div className="footer-cta">
          <span>للطلب والاستفسار:</span>
          <WhatsAppButton variant="soft">واتساب</WhatsAppButton>
        </div>

        <small>© 2026 Kh Resin Art. جميع الحقوق محفوظة.</small>
      </div>
    </footer>
  );
}
