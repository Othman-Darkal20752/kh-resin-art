import { Link, useParams } from 'react-router-dom';
import { products } from '../data/products';
import WhatsAppButton from '../components/WhatsAppButton';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);

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
