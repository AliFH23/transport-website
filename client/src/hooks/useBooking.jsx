import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [presetService, setPresetService] = useState('');

  const openBooking = useCallback((service = '') => {
    setPresetService(service);
    setOpen(true);
  }, []);
  const closeBooking = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, presetService, openBooking, closeBooking }),
    [open, presetService, openBooking, closeBooking]
  );
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>');
  return ctx;
};
