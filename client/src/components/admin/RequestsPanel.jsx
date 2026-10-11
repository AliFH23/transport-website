import { useCallback, useState } from 'react';
import { Phone } from 'lucide-react';
import { fetchRequests, getErrorMessage, updateRequestStatus } from '../../api/client';
import { STATUS_LABELS } from '../../constants';
import useAdminList from '../../hooks/useAdminList';
import { fmtDateTime } from '../../utils';
import { ErrorBanner, ListState, StatCards, StatusBadge } from './AdminParts';

const STATUSES = Object.keys(STATUS_LABELS);

function StatusSelect({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm font-bold focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
      aria-label="تغيير الحالة"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
      ))}
    </select>
  );
}

// Transport booking requests (the original admin view).
export default function RequestsPanel({ token, onUnauthorized, refreshSignal }) {
  const [filter, setFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const fetchPage = useCallback((params) => fetchRequests(token, params), [token]);
  const { items, meta, loading, error, setError, reload } = useAdminList(
    fetchPage,
    { status: filter || undefined, limit: 100 },
    { onUnauthorized, refreshSignal }
  );

  const changeStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateRequestStatus(token, id, status);
      await reload();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <StatCards statuses={STATUSES} labels={STATUS_LABELS} stats={meta?.stats} value={filter} onChange={setFilter} />
      {error && <ErrorBanner>{error}</ErrorBanner>}

      <ListState loading={loading} empty={!items.length}>
        {/* Desktop table */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full text-start text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {['العميل', 'الهاتف', 'الخدمة', 'من', 'إلى', 'ملاحظات', 'التاريخ', 'الحالة'].map((h) => (
                  <th key={h} className="px-4 py-3 text-start font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((r) => (
                <tr key={r._id} className="align-top hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-navy">{r.customerName}</td>
                  <td className="px-4 py-3">
                    <a href={`tel:${r.phone}`} dir="ltr" className="ltr-nums font-bold text-navy hover:text-gold-700">{r.phone}</a>
                  </td>
                  <td className="px-4 py-3">{r.serviceType}</td>
                  <td className="px-4 py-3">{r.pickupLocation}</td>
                  <td className="px-4 py-3">{r.destination}</td>
                  <td className="max-w-xs px-4 py-3 text-slate-500">{r.notes || '—'}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">{fmtDateTime(r.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={r.status} labels={STATUS_LABELS} />
                      <StatusSelect value={r.status} disabled={updatingId === r._id} onChange={(s) => changeStatus(r._id, s)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <ul className="divide-y divide-slate-100 lg:hidden">
          {items.map((r) => (
            <li key={r._id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-navy">{r.customerName}</p>
                  <p className="text-sm text-slate-500">{r.serviceType} • {fmtDateTime(r.createdAt)}</p>
                </div>
                <StatusBadge status={r.status} labels={STATUS_LABELS} />
              </div>
              <p className="mt-2 text-sm"><span className="font-bold">من:</span> {r.pickupLocation} — <span className="font-bold">إلى:</span> {r.destination}</p>
              {r.notes && <p className="mt-1 text-sm text-slate-500">{r.notes}</p>}
              <div className="mt-3 flex items-center justify-between gap-2">
                <a href={`tel:${r.phone}`} className="btn-dark px-3 py-1.5 text-sm">
                  <Phone className="h-4 w-4" /> <span dir="ltr" className="ltr-nums">{r.phone}</span>
                </a>
                <StatusSelect value={r.status} disabled={updatingId === r._id} onChange={(s) => changeStatus(r._id, s)} />
              </div>
            </li>
          ))}
        </ul>
      </ListState>
    </>
  );
}
