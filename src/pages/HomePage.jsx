import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-clean.png';
import ProductCard from '../components/ProductCard';
import WhatsAppButton from '../components/WhatsAppButton';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://kh-resin-art-backend.onrender.com/api').replace(/\/$/, '');
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/, '');
const FALLBACK_IMAGE = '/images/product-placeholder.svg';

const categories = [
  { name: 'ساعات ريزن', icon: '✧' },
  { name: 'ميداليات', icon: '✧' },
  { name: 'هدايا مخصصة', icon: '✧' },
  { name: 'قطع ديكور', icon: '✧' },
];

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

async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/products/`);

  if (!response.ok) {
    throw new Error('فشل تحميل المنتجات من السيرفر');
  }

  const data = await response.json();
  const items = Array.isArray(data) ? data : data.results || [];
  return items.map(normalizeProduct);
}

export default function HomePage() {
  const [apiProducts, setApiProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetchProducts()
      .then((items) => {
        if (!isMounted) return;
        setApiProducts(items);
        setErrorMessage('');
      })
      .catch((error) => {
        if (!isMounted) return;
        setErrorMessage(error.message || 'حدث خطأ أثناء تحميل المنتجات');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const featured = apiProducts.filter((p) => p.isFeatured).slice(0, 3);
  const newest = apiProducts.filter((p) => p.isNew).slice(0, 3);

  return (
    <>
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-copy">
            <span className="eyebrow">أهلاً بكِ في عالم الجمال</span>
            <h1>Kh Resin Art</h1>
            <h2>فن الريزن بلمسة أنثوية ناعمة</h2>
            <p>قطع يدوية مميزة مصنوعة بعناية لتناسب الهدايا والديكور والمناسبات الخاصة.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/products">تصفحي المنتجات</Link>
              <WhatsAppButton variant="soft">تواصلي عبر واتساب</WhatsAppButton>
            </div>
          </div>

          <div className="hero-visual" aria-label="شعار Kh Resin Art">
            <div className="logo-frame">
              <img src={logo} alt="Kh Resin Art" />
            </div>
          </div>
        </div>
      </section>

      <section className="section categories-section">
        <div className="section-heading center">
          <h2>تصنيفات المنتجات</h2>
          <span />
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link className="category-card" key={category.name} to={`/products?category=${encodeURIComponent(category.name)}`}>
              <span>{category.icon}</span>
              <strong>{category.name}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section products-section">
        <div className="section-heading split">
          <div>
            <h2>أعمال مميزة</h2>
            <p>أكثر القطع طلباً وإعجاباً</p>
          </div>
          <Link to="/products" className="view-all">عرض الكل ←</Link>
        </div>

        {loading && <p className="empty-state">جاري تحميل المنتجات...</p>}
        {!loading && errorMessage && <p className="empty-state">{errorMessage}</p>}
        {!loading && !errorMessage && featured.length === 0 && (
          <p className="empty-state">لا توجد منتجات مميزة حالياً. أضيفي منتجات من لوحة التحكم.</p>
        )}

        <div className="products-grid home-grid">
          {featured.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="section products-section small-top">
        <div className="section-heading split">
          <div>
            <h2>أحدث المنتجات</h2>
            <p>تصاميم جديدة مصنوعة بعناية</p>
          </div>
          <Link to="/products" className="view-all">عرض المزيد ←</Link>
        </div>

        {loading && <p className="empty-state">جاري تحميل المنتجات...</p>}
        {!loading && !errorMessage && newest.length === 0 && (
          <p className="empty-state">لا توجد منتجات جديدة حالياً.</p>
        )}

        <div className="products-grid home-grid">
          {newest.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="custom-order-section">
        <div>
          <h2>اطلبي تصميمك الخاص</h2>
          <p>يمكنك طلب لون أو اسم أو تصميم مخصص حسب المناسبة لتكون هديتك فريدة من نوعها ومصممة خصيصاً لكِ.</p>
          <WhatsAppButton variant="dark">اطلبي عبر واتساب</WhatsAppButton>
        </div>
      </section>
    </>
  );
}
