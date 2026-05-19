import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import WhatsAppButton from '../components/WhatsAppButton';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://kh-resin-art-backend.onrender.com/api').replace(/\/$/, '');
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/, '');
const FALLBACK_IMAGE = '/images/product-placeholder.svg';

function normalizeImageUrl(url) {
  if (typeof url !== 'string') return FALLBACK_IMAGE;

  const value = url.trim();
  const invalidValues = ['', 'null', 'undefined', 'none'];

  if (invalidValues.includes(value.toLowerCase())) {
    return FALLBACK_IMAGE;
  }

  if (value.startsWith('/images/')) {
    return value;
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return `${BACKEND_BASE_URL}${value.startsWith('/') ? value : `/${value}`}`;
}

function normalizeText(value, fallback = 'غير محدد') {
  if (typeof value !== 'string') return fallback;

  const cleaned = value.trim();

  return cleaned ? cleaned : fallback;
}

function normalizeProduct(product) {
  const categoryValue =
    product.category_name ||
    product.category?.name ||
    product.category_title ||
    product.category ||
    'بدون تصنيف';

  const description =
    product.description ||
    product.short_description ||
    product.shortDescription ||
    '';

  return {
    ...product,
    id: product.id,
    slug: product.slug || String(product.id),
    name: normalizeText(product.name || product.title, 'منتج بدون اسم'),
    category: normalizeText(categoryValue, 'بدون تصنيف'),
    shortDescription: normalizeText(
      product.short_description || product.shortDescription || description,
      ''
    ),
    description: normalizeText(
      description,
      'لا توجد تفاصيل إضافية لهذا المنتج حاليًا. يمكنكم التواصل معنا عبر واتساب لمعرفة المقاسات، الألوان، وخيارات التخصيص.'
    ),
    image: normalizeImageUrl(product.image_url || product.image || product.photo),
    colors: normalizeText(product.colors_note || product.colors, 'حسب الصورة أو حسب الطلب'),
    customization: normalizeText(
      product.customization_note || product.customization || product.customizationNote,
      'يمكن الاستفسار عن إمكانية التخصيص'
    ),
    isNew: product.is_new ?? product.isNew ?? false,
    isFeatured: product.is_featured ?? product.isFeatured ?? false,
  };
}

async function fetchAllPages(url) {
  const items = [];
  let nextUrl = url;

  while (nextUrl) {
    const response = await fetch(nextUrl);

    if (!response.ok) {
      throw new Error('فشل تحميل البيانات من السيرفر');
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      items.push(...data);
      nextUrl = null;
    } else {
      items.push(...(data.results || []));
      nextUrl = data.next;
    }
  }

  return items;
}

async function fetchProductBySlug(slug) {
  const detailResponse = await fetch(`${API_BASE_URL}/products/${slug}/`);

  if (detailResponse.ok) {
    const product = await detailResponse.json();
    return normalizeProduct(product);
  }

  const items = await fetchAllPages(`${API_BASE_URL}/products/`);

  const foundProduct = items
    .map(normalizeProduct)
    .find((item) => item.slug === slug || String(item.id) === String(slug));

  return foundProduct || null;
}

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    setLoading(true);

    fetchProductBySlug(slug)
      .then((item) => {
        if (!isMounted) return;
        setProduct(item);
        setErrorMessage('');
      })
      .catch((error) => {
        if (!isMounted) return;
        setErrorMessage(error.message || 'حدث خطأ أثناء تحميل المنتج');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <section className="page-section not-found">
        <h1>جاري تحميل المنتج...</h1>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="page-section not-found">
        <h1>{errorMessage}</h1>
        <Link className="btn btn-primary" to="/products">العودة للمنتجات</Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="page-section not-found">
        <h1>المنتج غير موجود</h1>
        <Link className="btn btn-primary" to="/products">العودة للمنتجات</Link>
      </section>
    );
  }

  const productUrl = `${window.location.origin}/products/${product.slug}`;

  return (
    <section className="details-page page-section">
      <div className="details-card">
        <div className="details-image">
          <span>{product.category}</span>

          <img
            src={product.image}
            alt={product.name}
            className={product.image === FALLBACK_IMAGE ? 'is-fallback' : ''}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
              e.currentTarget.classList.add('is-fallback');
            }}
          />
        </div>

        <div className="details-content">
          <p className="eyebrow">تفاصيل المنتج</p>

          <h1>{product.name}</h1>

          <p className="details-description">{product.description}</p>

          <div className="details-list">
            <div>
              <strong>التصنيف</strong>
              <span>{product.category}</span>
            </div>

            <div>
              <strong>الألوان</strong>
              <span>{product.colors}</span>
            </div>

            <div>
              <strong>التخصيص</strong>
              <span>{product.customization}</span>
            </div>
          </div>

          <div className="details-actions">
            <WhatsAppButton
              productName={product.name}
              productUrl={productUrl}
              className="details-whatsapp-btn"
            >
              استفسار عن هذا المنتج
            </WhatsAppButton>

            <Link className="btn details-btn" to="/products">
              العودة للمنتجات
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
