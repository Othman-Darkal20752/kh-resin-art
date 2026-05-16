import { Link } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';
import React from 'react';

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <span className="product-badge">{product.category}</span>
        {product.isNew && <span className="new-badge">جديد</span>}
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>
        <div className="card-actions">
          <WhatsAppButton productName={product.name}>استفسار عبر واتساب</WhatsAppButton>
          <Link className="btn details-btn" to={`/products/${product.slug}`}>
            <span>ⓘ</span>
            عرض التفاصيل
          </Link>
        </div>
      </div>
    </article>
  );
}
