import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';

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

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'الكل';
  const [category, setCategory] = useState(categories.includes(initialCategory) ? initialCategory : 'الكل');
  const [query, setQuery] = useState('');
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

  const filteredProducts = useMemo(() => {
    const value = query.trim();
    return apiProducts.filter((product) => {
      const matchesCategory = category === 'الكل' || product.category === category;
      const matchesSearch =
        !value ||
        product.name.includes(value) ||
        product.shortDescription.includes(value) ||
        product.category.includes(value);

      return matchesCategory && matchesSearch;
    });
  }, [apiProducts, category, query]);

  return (
    <section className="products-page page-section">
      <div className="page-title">
        <h1>تشكيلة المنتجات</h1>
        <p>تصفحي جميع أعمالنا اليدوية المصنوعة بحب</p>
      </div>

      <div className="catalog-layout">
        <aside className="filters-panel">
          <div className="filter-box">
            <h3>بحث <span>⌕</span></h3>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحثي عن منتج..."
              aria-label="البحث عن منتج"
            />
          </div>

          <div className="filter-box categories-filter">
            <h3>التصنيفات <span>▽</span></h3>
            <div>
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? 'active' : ''}
                  onClick={() => setCategory(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="catalog-content">
          <div className="mobile-filter-card">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحثي عن منتج..."
            />
            <div className="mobile-cats">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? 'active' : ''}
                  onClick={() => setCategory(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {loading && <p className="empty-state">جاري تحميل المنتجات...</p>}
          {!loading && errorMessage && <p className="empty-state">{errorMessage}</p>}

          {!loading && !errorMessage && (
            <>
              <div className="products-grid catalog-grid">
                {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
              {!filteredProducts.length && <p className="empty-state">لا توجد منتجات مطابقة أو لم يتم إضافة منتجات بعد.</p>}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
