import { Beef, CalendarDays, Package, Scale, StickyNote, User } from 'lucide-react';
import { COMPANY } from '../../constants';
import { fmtAgo, fmtDay, fmtNum, fmtPrice } from '../../utils';
import ContactButtons from '../ContactButtons';
import { Chip, InfoRow, ListingCardShell, RouteLine } from './ListingParts';

export default function LoadCard({ load }) {
  const livestock = load.cargoType === 'مواشي';
  const message = `السلام عليكم، بخصوص حمولة ${load.cargoType} من ${load.fromCity} إلى ${load.toCity} المنشورة على موقع ${COMPANY.name}`;

  return (
    <ListingCardShell>
      <div className="flex items-center justify-between gap-3">
        <Chip tone={livestock ? 'navy' : 'gold'}>
          {livestock ? <Beef className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
          {load.cargoType}
        </Chip>
        <span className="text-xs text-slate-400">{fmtAgo(load.createdAt)}</span>
      </div>

      <div className="mt-4">
        <RouteLine from={load.fromCity} to={load.toCity} />
        <p className="mt-2 font-semibold text-navy-800">{load.cargoDescription}</p>
      </div>

      <ul className="mt-4 space-y-2">
        <InfoRow icon={CalendarDays}>التحميل: <strong className="text-navy">{fmtDay(load.pickupDate)}</strong></InfoRow>
        {livestock && (
          <InfoRow icon={Beef}>{load.animalType} — <span className="ltr-nums">{fmtNum(load.animalCount)}</span> رأس</InfoRow>
        )}
        {load.approxWeightTons && (
          <InfoRow icon={Scale}>الوزن التقريبي: <span className="ltr-nums">{fmtNum(load.approxWeightTons)}</span> طن</InfoRow>
        )}
        <InfoRow icon={User}>{load.merchantName}</InfoRow>
        {load.notes && <InfoRow icon={StickyNote}><span className="line-clamp-2">{load.notes}</span></InfoRow>}
      </ul>

      <div className="mt-auto pt-5">
        <p className="mb-3 rounded-xl bg-slate-50 px-4 py-2.5 text-center font-black text-navy ring-1 ring-slate-200">{fmtPrice(load)}</p>
        <ContactButtons phone={load.phone} message={message} />
      </div>
    </ListingCardShell>
  );
}
