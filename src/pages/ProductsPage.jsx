import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';
import React from 'react';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'الكل';
  const [category, setCategory] = useState(categories.includes(initialCategory) ? initialCategory : 'الكل');
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const value = query.trim();
    return products.filter((product) => {
      const matchesCategory = category === 'الكل' || product.category === category;
      const matchesSearch = !value || product.name.includes(value) || product.shortDescription.includes(value) || product.category.includes(value);
      return matchesCategory && matchesSearch;
    });
  }, [category, query]);

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

          <div className="products-grid catalog-grid">
            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          {!filteredProducts.length && <p className="empty-state">لا توجد منتجات مطابقة للبحث الحالي.</p>}
        </div>
      </div>
    </section>
  );
}
