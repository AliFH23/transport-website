import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import { BookingProvider } from './hooks/useBooking.jsx';

export default function App() {
  return (
    <BookingProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BookingProvider>
  );
}
