import { NavLink } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';
import logo from '../assets/logo-clean.png';

const links = [
  { to: '/', label: 'الرئيسية' },
  { to: '/products', label: 'المنتجات' },
  { to: '/about', label: 'من نحن' },
  { to: '/contact', label: 'تواصل معنا' },
];

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="nav-shell">
        <NavLink to="/" className="brand-text" aria-label="Kh Resin Art">
          <img className="brand-logo" src={logo} alt="" aria-hidden="true" />
          <span className="brand-name"><b>Kh</b> Resin Art</span>
        </NavLink>

        <nav className="main-nav" aria-label="روابط الموقع">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <WhatsAppButton className="nav-whatsapp" variant="soft">واتساب</WhatsAppButton>
      </div>
    </header>
  );
}
