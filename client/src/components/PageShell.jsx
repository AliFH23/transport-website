import Navbar from './Navbar';
import Footer from './Footer';
import BookingModal from './BookingModal';
import WhatsAppButton from './WhatsAppButton';

// Layout for inner pages: dark header band under the navbar, then page content.
export default function PageShell({ eyebrow, title, subtitle, actions, children }) {
  return (
    <>
      <Navbar />
      <header className="relative isolate overflow-hidden bg-navy pb-14 pt-32 text-white">
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gold/20 blur-3xl" />
        <div className="container-x flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="animate-fade-up">
            {eyebrow && <p className="font-bold text-gold">{eyebrow}</p>}
            <h1 className="mt-2 font-display text-4xl font-black sm:text-5xl">{title}</h1>
            <div className="mt-4 h-1 w-24 rounded-full bg-gold-gradient" />
            {subtitle && <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-col gap-3 sm:flex-row">{actions}</div>}
        </div>
      </header>
      <main className="min-h-[50vh] bg-slate-50 py-10 sm:py-14">
        <div className="container-x">{children}</div>
      </main>
      <Footer />
      <BookingModal />
      <WhatsAppButton />
    </>
  );
}
