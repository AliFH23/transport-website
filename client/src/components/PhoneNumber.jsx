// Renders a phone number left-to-right inside RTL text so digits never get reordered.
export default function PhoneNumber({ phone, className = '' }) {
  return (
    <span dir="ltr" className={`ltr-nums ${className}`}>
      {phone.display}
    </span>
  );
}
