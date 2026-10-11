import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import BookingSection from '../components/BookingSection';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import WhatsAppButton from '../components/WhatsAppButton';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <BookingSection />
        <Contact />
      </main>
      <Footer />
      <BookingModal />
      <WhatsAppButton />
    </>
  );
}
