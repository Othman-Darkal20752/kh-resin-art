import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import WhatsAppButton from '../components/WhatsAppButton';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://kh-resin-art-backend.onrender.com/api').replace(/\/$/, '');
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

function normalizeImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BACKEND_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

function normalizeProduct(product) {
  const categoryValue =
    product.category_name ||
    product.category?.name ||
    product.category_title ||
    product.category ||
    'بدون تصنيف';

  return {
    ...product,
    id: product.id,
    slug: product.slug || String(product.id),
    name: product.name || product.title || 'منتج بدون اسم',
    category: categoryValue,
    shortDescription:
      product.short_description ||
      product.shortDescription ||
      product.description ||
      '',
    description:
      product.description ||
      product.short_description ||
      product.shortDescription ||
      '',
    image: normalizeImageUrl(product.image_url || product.image || product.photo),
    materials: product.materials || 'غير محدد',
    colors: product.colors || 'غير محدد',
    customizable: product.customizable ?? product.is_customizable ?? false,
    isNew: product.is_new ?? product.isNew ?? false,
    isFeatured: product.is_featured ?? product.isFeatured ?? false,
  };
}

async function fetchProductBySlug(slug) {
  const detailResponse = await fetch(`${API_BASE_URL}/products/${slug}/`);

  if (detailResponse.ok) {
    const product = await detailResponse.json();
    return normalizeProduct(product);
  }

  const listResponse = await fetch(`${API_BASE_URL}/products/`);

  if (!listResponse.ok) {
    throw new Error('فشل تحميل تفاصيل المنتج');
  }

  const data = await listResponse.json();
  const items = Array.isArray(data) ? data : data.results || [];
  const foundProduct = items.map(normalizeProduct).find((item) => item.slug === slug || String(item.id) === String(slug));

  if (!foundProduct) {
    return null;
  }

  return foundProduct;
}

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

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

  return (
    <section className="details-page page-section">
      <div className="details-card">
        <div className="details-image">
          <span>{product.category}</span>
          <img src={product.image} alt={product.name} />
        </div>

        <div className="details-content">
          <p className="eyebrow">تفاصيل المنتج</p>
          <h1>{product.name}</h1>
          <p className="details-description">{product.description}</p>

          <div className="details-list">
            <div><strong>التصنيف</strong><span>{product.category}</span></div>
            <div><strong>المواد</strong><span>{product.materials}</span></div>
            <div><strong>الألوان</strong><span>{product.colors}</span></div>
            <div><strong>التخصيص</strong><span>{product.customizable ? 'متوفر حسب الطلب' : 'غير متوفر'}</span></div>
          </div>

          <div className="details-actions">
            <WhatsAppButton productName={product.name}>استفسار عن هذا المنتج</WhatsAppButton>
            <Link className="btn details-btn" to="/products">العودة للمنتجات</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
