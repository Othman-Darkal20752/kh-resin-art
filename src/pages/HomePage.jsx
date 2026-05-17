import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-clean.png';
import ProductCard from '../components/ProductCard';
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

function normalizeCategory(category) {
  return {
    id: category.id,
    name: category.name || 'تصنيف بدون اسم',
    slug: category.slug || String(category.id),
    description: category.description || '',
    order: category.order ?? 0,
    icon: category.icon || '✧',
  };
}

function normalizeProduct(product) {
  const categoryValue =
    product.category_name ||
    product.category?.name ||
    product.category_title ||
    'بدون تصنيف';

  return {
    ...product,
    id: product.id,
    slug: product.slug || String(product.id),
    name: product.name || product.title || 'منتج بدون اسم',
    category: categoryValue,
    categorySlug:
      product.category_slug ||
      product.category?.slug ||
      '',
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
    isFeatured: product.is_featured ?? product.isFeatured ?? false,
    createdAt: product.created_at || product.createdAt || null,
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

async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/categories/`);

  if (!response.ok) {
    throw new Error('فشل تحميل التصنيفات من السيرفر');
  }

  const data = await response.json();
  const items = Array.isArray(data) ? data : data.results || [];
  return items.map(normalizeCategory);
}

function sortByNewest(products) {
  return [...products].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    return dateB - dateA;
  });
}

function sortCategories(categories) {
  return [...categories].sort((a, b) => {
    const orderDiff = (a.order ?? 0) - (b.order ?? 0);
    if (orderDiff !== 0) return orderDiff;
    return a.name.localeCompare(b.name, 'ar');
  });
}

export default function HomePage() {
  const [apiProducts, setApiProducts] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    Promise.all([fetchProducts(), fetchCategories()])
      .then(([products, categories]) => {
        if (!isMounted) return;
        setApiProducts(products);
        setApiCategories(categories);
        setErrorMessage('');
      })
      .catch((error) => {
        if (!isMounted) return;
        setErrorMessage(error.message || 'حدث خطأ أثناء تحميل بيانات الصفحة');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const featured = apiProducts.filter((product) => product.isFeatured).slice(0, 3);
  const newest = sortByNewest(apiProducts).slice(0, 3);
  const categories = sortCategories(apiCategories);

  return (
    <>
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-copy">
            <span className="eyebrow">قطع ريزن يدوية للهدايا والديكور</span>
            <h1>Kh Resin Art</h1>
            <h2>تصاميم ريزن ناعمة تُصنع بعناية خصيصاً لكِ</h2>
            <p>
              اختاري من مجموعتنا الجاهزة أو اطلبي قطعة مخصصة باسم، لون، أو فكرة تناسب مناسبتك.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/products">تصفحي المنتجات</Link>
              <WhatsAppButton variant="soft">اسألي عبر واتساب</WhatsAppButton>
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
          <h2>اختاري حسب نوع القطعة</h2>
          <p>تصنيفات واضحة لتصفّح أسهل</p>
          <span />
        </div>

        {loading && <p className="empty-state">جاري تحميل التصنيفات...</p>}

        {!loading && !errorMessage && categories.length === 0 && (
          <p className="empty-state">لا توجد تصنيفات ظاهرة حالياً.</p>
        )}

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              className="category-card"
              key={category.id || category.slug}
              to={`/products?category=${encodeURIComponent(category.slug)}`}
            >
              <span>{category.icon}</span>
              <strong>{category.name}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section products-section">
        <div className="section-heading split">
          <div>
            <h2>مختارات مميزة</h2>
            <p>قطع نرشحها لكِ من أجمل الأعمال المتوفرة</p>
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
            <h2>وصل حديثاً</h2>
            <p>آخر التصاميم التي تمت إضافتها إلى المعرض</p>
          </div>
          <Link to="/products" className="view-all">عرض المزيد ←</Link>
        </div>

        {loading && <p className="empty-state">جاري تحميل المنتجات...</p>}
        {!loading && !errorMessage && newest.length === 0 && (
          <p className="empty-state">لا توجد منتجات حالياً.</p>
        )}

        <div className="products-grid home-grid">
          {newest.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="custom-order-section">
        <div className="custom-order-content">
          <span className="eyebrow custom-eyebrow">تصميم حسب الطلب</span>
          <h2>اطلبي قطعة باسمك، لونك، ومناسبتك</h2>
          <p>
            أرسلي لنا الفكرة أو صورة مرجعية، وسنساعدك باختيار الألوان والتفاصيل المناسبة قبل تنفيذ الطلب.
          </p>

          <ul className="custom-order-list" aria-label="تفاصيل يمكن تخصيصها">
            <li>اختيار الألوان والورود والإضافات</li>
            <li>إضافة اسم، حرف، تاريخ، أو عبارة قصيرة</li>
            <li>تنسيق التصميم حسب المناسبة أو الهدية</li>
          </ul>

          <div className="custom-order-actions">
            <WhatsAppButton variant="dark">ابدئي طلبك عبر واتساب</WhatsAppButton>
            <Link to="/products" className="custom-order-link">شاهدي المنتجات أولاً</Link>
          </div>
        </div>
      </section>
    </>
  );
}
