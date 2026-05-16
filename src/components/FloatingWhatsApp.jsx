import { getWhatsAppLink } from './WhatsAppButton';

export default function FloatingWhatsApp() {
  return (
    <a className="floating-whatsapp" href={getWhatsAppLink()} target="_blank" rel="noreferrer">
      <span>☏</span>
      <strong>واتساب</strong>
    </a>
  );
}
