import BookingForm from './BookingForm';
import Modal from './Modal';
import { useBooking } from '../hooks/useBooking';

export default function BookingModal() {
  const { open, presetService, closeBooking } = useBooking();
  return (
    <Modal
      open={open}
      onClose={closeBooking}
      title="طلب خدمة نقل"
      subtitle="املأ البيانات وسيتواصل معك فريقنا لتأكيد الموعد والسعر."
    >
      <BookingForm presetService={presetService} idPrefix="modal" />
    </Modal>
  );
}
