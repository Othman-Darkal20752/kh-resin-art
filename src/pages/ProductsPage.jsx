import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://kh-resin-art-backend.onrender.com/api').replace(/\/$/, '');
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/, '');
const FALLBACK_IMAGE = '/images/product-placeholder.svg';
const SEARCH_DEBOUNCE_MS = 350;

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

function buildProductsUrl({ categorySlug, searchTerm }) {
  const url = new URL(`${API_BASE_URL}/products/`);

  if (categorySlug && categorySlug !== ALL_CATEGORY.slug) {
    url.searchParams.set('category', categorySlug);
  }

  const cleanSearch = searchTerm.trim();
  if (cleanSearch) {
    url.searchParams.set('search', cleanSearch);
  }

  return url.toString();
}

async function fetchProducts({ categorySlug, searchTerm }) {
  const items = await fetchAllPages(buildProductsUrl({ categorySlug, searchTerm }));
  return items.map(normalizeProduct);
}

async function fetchCategories() {
  const items = await fetchAllPages(`${API_BASE_URL}/categories/`);
  return items.map(normalizeCategory);
}

function ProductSkeletonCard() {
  return (
    <article className="product-card product-skeleton-card" aria-hidden="true">
      <div className="skeleton-image skeleton-shine" />

      <div className="product-card-body skeleton-body">
        <div className="skeleton-line skeleton-title skeleton-shine" />
        <div className="skeleton-line skeleton-text skeleton-shine" />
        <div className="skeleton-line skeleton-text skeleton-text-short skeleton-shine" />

        <div className="product-actions skeleton-actions">
          <div className="skeleton-button skeleton-shine" />
          <div className="skeleton-button skeleton-shine" />
        </div>
      </div>
    </article>
  );
}

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const initialCategorySlug = searchParams.get('category') || ALL_CATEGORY.slug;

  const [selectedCategorySlug, setSelectedCategorySlug] = useState(initialCategorySlug);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setSelectedCategorySlug(searchParams.get('category') || ALL_CATEGORY.slug);
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    setCategoriesLoading(true);

    fetchCategories()
      .then((categories) => {
        if (!isMounted) return;
        setApiCategories(categories);
      })
      .catch(() => {
        if (!isMounted) return;
        setApiCategories([]);
      })
      .finally(() => {
        if (!isMounted) return;
        setCategoriesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    setProductsLoading(true);
    setErrorMessage('');

    const delay = query.trim() ? SEARCH_DEBOUNCE_MS : 0;

    const timer = window.setTimeout(() => {
      fetchProducts({
        categorySlug: selectedCategorySlug,
        searchTerm: query,
      })
        .then((nextProducts) => {
          if (!isMounted) return;
          setProducts(nextProducts);
          setErrorMessage('');
        })
        .catch((error) => {
          if (!isMounted) return;
          setProducts([]);
          setErrorMessage(error.message || 'حدث خطأ أثناء تحميل المنتجات');
        })
        .finally(() => {
          if (!isMounted) return;
          setProductsLoading(false);
        });
    }, delay);

    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, [selectedCategorySlug, query]);

  const categories = useMemo(() => {
    return [ALL_CATEGORY, ...apiCategories];
  }, [apiCategories]);

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
                  disabled={categoriesLoading && item.slug !== ALL_CATEGORY.slug}
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
              aria-label="البحث عن منتج"
            />

            <div className="mobile-cats">
              {categories.map((item) => (
                <button
                  key={item.slug}
                  className={selectedCategorySlug === item.slug ? 'active' : ''}
                  onClick={() => setSelectedCategorySlug(item.slug)}
                  type="button"
                  disabled={categoriesLoading && item.slug !== ALL_CATEGORY.slug}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {productsLoading && (
            <div className="products-grid catalog-grid skeleton-grid" aria-label="جاري تحميل المنتجات">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeletonCard key={`product-skeleton-${index}`} />
              ))}
            </div>
          )}

          {!productsLoading && errorMessage && <p className="empty-state">{errorMessage}</p>}

          {!productsLoading && !errorMessage && (
            <>
              <div className="products-grid catalog-grid">
                {products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>

              {!products.length && (
                <p className="empty-state">لا توجد منتجات مطابقة أو لم يتم إضافة منتجات بعد.</p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
