import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-4 text-center text-white">
      <p className="font-display text-7xl font-black text-gold-gradient">404</p>
      <p className="mt-4 text-xl">الصفحة غير موجودة</p>
      <Link to="/" className="btn-gold mt-8">العودة للرئيسية</Link>
    </div>
  );
}
