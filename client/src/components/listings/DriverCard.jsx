import { CalendarDays, MapPin, Route, Ruler, StickyNote, Truck, User, Weight } from 'lucide-react';
import { COMPANY } from '../../constants';
import { fmtAgo, fmtDay, fmtNum, fmtPrice } from '../../utils';
import ContactButtons from '../ContactButtons';
import { Chip, InfoRow, ListingCardShell } from './ListingParts';

export default function DriverCard({ driver }) {
  const truck = driver.truckType === 'أخرى' ? driver.truckTypeOther : driver.truckType;
  const message = `السلام عليكم، بخصوص إعلانك كسائق ${truck} متوفر في ${driver.currentCity} على موقع ${COMPANY.name}`;

  return (
    <ListingCardShell>
      <div className="flex items-center justify-between gap-3">
        <Chip tone="navy"><Truck className="h-3.5 w-3.5" /> {truck}</Chip>
        <span className="text-xs text-slate-400">{fmtAgo(driver.createdAt)}</span>
      </div>

      <div className="mt-4">
        <p className="flex items-center gap-2 font-display text-xl font-black text-navy">
          <MapPin className="h-5 w-5 text-gold" /> {driver.currentCity}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip><Ruler className="h-3.5 w-3.5" /> <span className="ltr-nums">{fmtNum(driver.trailerLengthM)}</span> م</Chip>
          <Chip><Weight className="h-3.5 w-3.5" /> حتى <span className="ltr-nums">{fmtNum(driver.maxLoadTons)}</span> طن</Chip>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        <InfoRow icon={CalendarDays}>متوفر من: <strong className="text-navy">{fmtDay(driver.availableFrom)}</strong></InfoRow>
        {driver.preferredRoutes && <InfoRow icon={Route}>{driver.preferredRoutes}</InfoRow>}
        <InfoRow icon={User}>{driver.driverName}</InfoRow>
        {driver.notes && <InfoRow icon={StickyNote}><span className="line-clamp-2">{driver.notes}</span></InfoRow>}
      </ul>

      <div className="mt-auto pt-5">
        <p className="mb-3 rounded-xl bg-slate-50 px-4 py-2.5 text-center font-black text-navy ring-1 ring-slate-200">{fmtPrice(driver)}</p>
        <ContactButtons phone={driver.phone} message={message} />
      </div>
    </ListingCardShell>
  );
}
