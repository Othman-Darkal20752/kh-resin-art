import { Link } from 'react-router-dom';
import logo from '../assets/logo-clean.png';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import WhatsAppButton from '../components/WhatsAppButton';

const categories = [
  { name: 'ساعات ريزن', icon: '✧' },
  { name: 'ميداليات', icon: '✧' },
  { name: 'هدايا مخصصة', icon: '✧' },
  { name: 'قطع ديكور', icon: '✧' },
];

export default function HomePage() {
  const featured = products.filter((p) => p.isFeatured).slice(0, 3);
  const newest = products.filter((p) => p.isNew).slice(0, 3);

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
