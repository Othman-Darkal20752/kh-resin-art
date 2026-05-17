import React from 'react';
import { Link } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';

const FALLBACK_IMAGE = '/images/product-placeholder.svg';

function getValidImage(...values) {
  const image = values.find((value) => {
    if (typeof value !== 'string') return false;

    const cleaned = value.trim().toLowerCase();

    return (
      cleaned !== '' &&
      cleaned !== 'null' &&
      cleaned !== 'undefined' &&
      cleaned !== 'none'
    );
  });

  return image || FALLBACK_IMAGE;
}

function getProductSlug(product) {
  return product?.slug || String(product?.id || '');
}

export default function ProductCard({ product }) {
  if (!product) return null;

  const slug = getProductSlug(product);

  const productImage = getValidImage(
    product.image_url,
    product.image,
    product.photo
  );

  const productName = product.name || product.title || 'منتج بدون اسم';

  const category =
    product.category_name ||
    product.category?.name ||
    product.category_title ||
    product.category ||
    'بدون تصنيف';

  const description =
    product.shortDescription ||
    product.short_description ||
    product.description ||
    '';

  const shortDescription =
    description.length > 90 ? `${description.slice(0, 90)}...` : description;

  const productUrl = slug
    ? `${window.location.origin}/products/${slug}`
    : window.location.origin;

  return (
    <article className="product-card">
      <Link className="product-image-link" to={`/products/${slug}`}>
        <div className="product-image-box">
          {category && <span className="product-badge">{category}</span>}

          {(product.isNew || product.is_new) && (
            <span className="new-badge">جديد</span>
          )}

          <img
            src={productImage}
            alt={productName}
            className={`product-image ${productImage === FALLBACK_IMAGE ? 'is-fallback' : ''}`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
              e.currentTarget.classList.add('is-fallback');
            }}
          />
        </div>
      </Link>

      <div className="product-card-body">
        <h3 className="product-title">{productName}</h3>

        {shortDescription && (
          <p className="product-short-desc">{shortDescription}</p>
        )}

        <div className="product-actions">
          <Link className="btn details-btn" to={`/products/${slug}`}>
            تفاصيل المنتج
          </Link>

          <WhatsAppButton
            productName={productName}
            productUrl={productUrl}
            className="product-whatsapp-btn"
          >
            استفسار واتساب
          </WhatsAppButton>
        </div>
      </div>
    </article>
  );
}
