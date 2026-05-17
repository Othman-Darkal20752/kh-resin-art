import React from 'react';

export const PHONE_NUMBER = '963993845460';

export function getWhatsAppLink(productName = '', productUrl = '') {
  const hasProduct = productName && productName.trim().length > 0;

  const message = hasProduct
    ? `مرحباً، أود الاستفسار عن هذا المنتج:

اسم المنتج: ${productName}
${productUrl ? `رابط المنتج: ${productUrl}` : ''}

هل يمكنكم إرسال التفاصيل المتوفرة عنه؟`
    : `مرحباً، أود الاستفسار عن منتجات Kh Resin Art.

هل يمكنكم مساعدتي؟`;

  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function WhatsAppButton({
  productName = '',
  productUrl = '',
  children = 'تواصل عبر واتساب',
  className = '',
  variant = '',
}) {
  const classes = ['btn', 'whatsapp-btn', variant ? `whatsapp-${variant}` : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <a
      className={classes}
      href={getWhatsAppLink(productName, productUrl)}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}