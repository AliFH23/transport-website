import { useCallback, useState } from 'react';
import { Check, Phone, Trash2, X } from 'lucide-react';
import { deleteListing, fetchAdminListings, getErrorMessage, updateListingStatus } from '../../api/client';
import { CARGO_TYPES, LISTING_STATUS_LABELS, TRUCK_TYPES } from '../../constants';
import useAdminList from '../../hooks/useAdminList';
import { fmtDateTime, fmtDay, fmtNum, fmtPrice } from '../../utils';
import { ErrorBanner, ListState, StatCards, StatusBadge } from './AdminParts';

const STATUSES = Object.keys(LISTING_STATUS_LABELS);

function LoadSummary({ item: l }) {
  return (
    <>
      <p className="font-display text-lg font-black text-navy">{l.fromCity} ← {l.toCity} <span className="text-sm font-bold text-gold-700">({l.cargoType})</span></p>
      <p className="mt-1 text-sm text-slate-700">
        {l.cargoDescription}
        {l.cargoType === 'مواشي' && <> — {l.animalType} × <span className="ltr-nums">{fmtNum(l.animalCount)}</span></>}
        {l.approxWeightTons && <> — <span className="ltr-nums">{fmtNum(l.approxWeightTons)}</span> طن</>}
      </p>
      <p className="mt-1 text-sm text-slate-500">التحميل: {fmtDay(l.pickupDate)} · {l.merchantName}</p>
    </>
  );
}

function DriverSummary({ item: d }) {
  return (
    <>
      <p className="font-display text-lg font-black text-navy">
        {d.truckType === 'أخرى' ? `أخرى: ${d.truckTypeOther}` : d.truckType} — {d.currentCity}
      </p>
      <p className="mt-1 text-sm text-slate-700">
        مقطورة <span className="ltr-nums">{fmtNum(d.trailerLengthM)}</span> م · حتى <span className="ltr-nums">{fmtNum(d.maxLoadTons)}</span> طن
        {d.preferredRoutes && <> · {d.preferredRoutes}</>}
      </p>
      <p className="mt-1 text-sm text-slate-500">متوفر من: {fmtDay(d.availableFrom)} · {d.driverName}</p>
    </>
  );
}

const KINDS = {
  loads: { typeParam: 'cargoType', typeLabel: 'نوع الحمولة', typeOptions: CARGO_TYPES, Summary: LoadSummary },
  drivers: { typeParam: 'truckType', typeLabel: 'نوع الشاحنة', typeOptions: TRUCK_TYPES, Summary: DriverSummary },
};

// Moderation view for marketplace listings: counts per status, filters, approve / reject / delete.
export default function ListingsPanel({ kind, token, onUnauthorized, refreshSignal, onChanged }) {
  const { typeParam, typeLabel, typeOptions, Summary } = KINDS[kind];
  const [status, setStatus] = useState('Pending');
  const [type, setType] = useState('');
  const [busyId, setBusyId] = useState(null);

  const fetchPage = useCallback((params) => fetchAdminListings(token, kind, params), [token, kind]);
  const { items, meta, loading, error, setError, reload } = useAdminList(
    fetchPage,
    { status, [typeParam]: type, limit: 100 },
    { onUnauthorized, refreshSignal }
  );

  const act = async (id, fn) => {
    setBusyId(id);
    setError('');
    try {
      await fn();
      await reload();
      onChanged?.();
    } catch (err) {
      if (err?.response?.status === 401) onUnauthorized('رمز الدخول غير صحيح');
      else setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const setListingStatus = (id, s) => act(id, () => updateListingStatus(token, kind, id, s));
  const remove = (id) => {
    if (window.confirm('حذف هذا الإعلان نهائياً؟')) act(id, () => deleteListing(token, kind, id));
  };

  return (
    <>
      <StatCards statuses={STATUSES} labels={LISTING_STATUS_LABELS} stats={meta?.stats} value={status} onChange={setStatus} />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label htmlFor={`${kind}-type`} className="text-sm font-bold text-slate-600">{typeLabel}:</label>
        <select id={`${kind}-type`} value={type} onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30">
          <option value="">الكل</option>
          {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {meta && <span className="text-sm text-slate-500">{meta.total} نتيجة</span>}
      </div>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <ListState loading={loading} empty={!items.length}>
        <ul className="divide-y divide-slate-100">
          {items.map((item) => {
            const busy = busyId === item._id;
            const expired = item.status === 'Expired' || new Date(item.expiresAt) <= new Date();
            return (
              <li key={item._id} className={`flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between ${busy ? 'opacity-60' : ''}`}>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <StatusBadge status={item.status} labels={LISTING_STATUS_LABELS} />
                    <span>أُضيف {fmtDateTime(item.createdAt)}</span>
                    <span>· ينتهي {fmtDateTime(item.expiresAt)}</span>
                  </div>
                  <Summary item={item} />
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <a href={`tel:${item.phone}`} className="inline-flex items-center gap-1 font-bold text-navy hover:text-gold-700">
                      <Phone className="h-4 w-4" /><span dir="ltr" className="ltr-nums">{item.phone}</span>
                    </a>
                    <span className="font-bold text-slate-700">{fmtPrice(item)}</span>
                  </div>
                  {item.notes && <p className="mt-1 text-sm text-slate-500">{item.notes}</p>}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {item.status !== 'Approved' && !expired && (
                    <button type="button" disabled={busy} onClick={() => setListingStatus(item._id, 'Approved')}
                      className="btn bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700">
                      <Check className="h-4 w-4" /> قبول
                    </button>
                  )}
                  {item.status !== 'Rejected' && item.status !== 'Expired' && (
                    <button type="button" disabled={busy} onClick={() => setListingStatus(item._id, 'Rejected')}
                      className="btn border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                      <X className="h-4 w-4" /> رفض
                    </button>
                  )}
                  <button type="button" disabled={busy} onClick={() => remove(item._id)}
                    className="btn border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:border-red-400 hover:text-red-700" aria-label="حذف">
                    <Trash2 className="h-4 w-4" /> حذف
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </ListState>
    </>
  );
}
