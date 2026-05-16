export const PHONE_NUMBER = '96396871020';
import React from 'react';

export function getWhatsAppLink(productName = '') {
  const message = productName
    ? `مرحباً، أريد الاستفسار عن المنتج: ${productName}`
    : 'مرحباً، أريد الاستفسار عن منتجات Kh Resin Art';

  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function WhatsAppButton({
  productName,
  children = 'استفسار عبر واتساب',
  className = '',
  variant = 'green',
}) {
  return (
    <a
      className={`btn whatsapp-btn ${variant === 'dark' ? 'btn-dark' : ''} ${className}`}
      href={getWhatsAppLink(productName)}
      target="_blank"
      rel="noreferrer"
      aria-label={typeof children === 'string' ? children : 'تواصل عبر واتساب'}
    >
      <span className="wa-icon">☏</span>
      <span>{children}</span>
    </a>
  );
}
