import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://kh-resin-art-backend.onrender.com/api').replace(/\/$/, '');
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/, '');
const FALLBACK_IMAGE = '/images/product-placeholder.svg';

const ALL_CATEGORY = {
  id: 'all',
  name: 'الكل',
  slug: 'all',
};

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

async function fetchProducts() {
  const items = await fetchAllPages(`${API_BASE_URL}/products/`);
  return items.map(normalizeProduct);
}

async function fetchCategories() {
  const items = await fetchAllPages(`${API_BASE_URL}/categories/`);
  return items.map(normalizeCategory);
}

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const initialCategorySlug = searchParams.get('category') || ALL_CATEGORY.slug;

  const [selectedCategorySlug, setSelectedCategorySlug] = useState(initialCategorySlug);
  const [query, setQuery] = useState('');
  const [apiProducts, setApiProducts] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setSelectedCategorySlug(searchParams.get('category') || ALL_CATEGORY.slug);
  }, [searchParams]);

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

  const categories = useMemo(() => {
    return [ALL_CATEGORY, ...apiCategories];
  }, [apiCategories]);

  const filteredProducts = useMemo(() => {
    const value = query.trim();

    return apiProducts.filter((product) => {
      const matchesCategory =
        selectedCategorySlug === ALL_CATEGORY.slug ||
        product.categorySlug === selectedCategorySlug;

      const matchesSearch =
        !value ||
        product.name.includes(value) ||
        product.shortDescription.includes(value) ||
        product.category.includes(value);

      return matchesCategory && matchesSearch;
    });
  }, [apiProducts, selectedCategorySlug, query]);

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
                  key={item.slug}
                  className={selectedCategorySlug === item.slug ? 'active' : ''}
                  onClick={() => setSelectedCategorySlug(item.slug)}
                  type="button"
                >
                  {item.name}
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
                  key={item.slug}
                  className={selectedCategorySlug === item.slug ? 'active' : ''}
                  onClick={() => setSelectedCategorySlug(item.slug)}
                  type="button"
                >
                  {item.name}
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

              {!filteredProducts.length && (
                <p className="empty-state">لا توجد منتجات مطابقة أو لم يتم إضافة منتجات بعد.</p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
