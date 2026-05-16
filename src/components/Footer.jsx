import { NavLink } from 'react-router-dom';
import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <h2>Kh Resin Art</h2>
        <p>فن الريزن بلمسة أنثوية ناعمة. قطع يدوية مميزة مصنوعة بعناية لتناسب الهدايا والديكور والمناسبات الخاصة.</p>
        <div className="footer-links">
          <NavLink to="/">الرئيسية</NavLink>
          <NavLink to="/products">المنتجات</NavLink>
          <NavLink to="/about">من نحن</NavLink>
          <NavLink to="/contact">تواصل معنا</NavLink>
        </div>
        <small>© 2026 Kh Resin Art. جميع الحقوق محفوظة.</small>
      </div>
    </footer>
  );
}
