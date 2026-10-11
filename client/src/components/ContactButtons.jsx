import { MessageCircle, Phone } from 'lucide-react';
import { phoneLinks } from '../constants';
import PhoneNumber from './PhoneNumber';

// Call + WhatsApp buttons for a listing's 07XXXXXXXX number (links use +962).
export default function ContactButtons({ phone, message }) {
  const p = phoneLinks(phone);
  const wa = message ? `${p.whatsapp}?text=${encodeURIComponent(message)}` : p.whatsapp;
  return (
    <div className="grid grid-cols-2 gap-2">
      <a href={p.tel} className="btn-dark px-3 py-2.5 text-sm" aria-label={`اتصال ${p.display}`}>
        <Phone className="h-4 w-4" />
        <PhoneNumber phone={p} />
      </a>
      <a href={wa} target="_blank" rel="noopener noreferrer" className="btn bg-[#25D366] px-3 py-2.5 text-sm text-white hover:brightness-110">
        <MessageCircle className="h-4 w-4" /> واتساب
      </a>
    </div>
  );
}
