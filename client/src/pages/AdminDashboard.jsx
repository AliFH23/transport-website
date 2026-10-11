import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Loader2, LogOut, Phone, RefreshCw } from 'lucide-react';
import { fetchRequests, getErrorMessage, updateRequestStatus } from '../api/client';
import { STATUS_LABELS } from '../constants';
import { LogoMark } from '../components/Logo';

const TOKEN_KEY = 'durrat_admin_token';
const STATUSES = Object.keys(STATUS_LABELS);

const fmtDate = (iso) =>
  new Intl.DateTimeFormat('ar-JO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));

const readToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

function StatusBadge({ status }) {
  const s = STATUS_LABELS[status];
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ring-1 ${s.className}`}>{s.label}</span>;
}

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

function Login({ onLogin, error }) {
  const [value, setValue] = useState('');
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) onLogin(value.trim());
        }}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
      >
        <LogoMark className="mx-auto h-16 w-16 text-navy" />
        <h1 className="mt-4 text-center font-display text-2xl font-black text-navy">لوحة التحكم</h1>
        <p className="mt-1 text-center text-sm text-slate-500">أدخل رمز المسؤول للمتابعة</p>
        <label htmlFor="admin-token" className="label mt-6">رمز الدخول</label>
        <input id="admin-token" type="password" value={value} onChange={(e) => setValue(e.target.value)}
          className="input" autoComplete="current-password" dir="ltr" />
        {error && <p className="mt-2 text-sm font-bold text-red-600">{error}</p>}
        <button type="submit" className="btn-gold mt-6 w-full">
          <KeyRound className="h-5 w-5" /> دخول
        </button>
        <Link to="/" className="mt-4 block text-center text-sm font-bold text-slate-500 hover:text-navy">العودة للموقع</Link>
      </form>
    </div>
  );
}

export default function AdminDashboard() {
  const [token, setToken] = useState(readToken);
  const [filter, setFilter] = useState('');
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const logout = useCallback((msg = '') => {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
    } catch { /* ignore */ }
    setToken('');
    setItems([]);
    setError(msg);
  }, []);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetchRequests(token, { status: filter || undefined, limit: 100 });
      setItems(res.data);
      setMeta(res.meta);
      try {
        sessionStorage.setItem(TOKEN_KEY, token);
      } catch { /* ignore */ }
    } catch (err) {
      if (err?.response?.status === 401) logout('رمز الدخول غير صحيح');
      else setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [token, filter, logout]);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateRequestStatus(token, id, status);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  if (!token) return <Login onLogin={setToken} error={error} />;

  const stats = meta?.stats ?? {};
  const total = STATUSES.reduce((n, s) => n + (stats[s] || 0), 0);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-navy text-white">
        <div className="container-x flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <LogoMark className="h-9 w-9 text-white" />
            <span className="font-display text-lg font-black">لوحة طلبات النقل</span>
          </Link>
          <div className="flex items-center gap-2">
            <button type="button" onClick={load} className="btn px-3 py-2 text-sm text-white hover:bg-white/10" aria-label="تحديث">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button type="button" onClick={() => logout()} className="btn-outline px-3 py-2 text-sm">
              <LogOut className="h-4 w-4" /> خروج
            </button>
          </div>
        </div>
      </header>

      <main className="container-x py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[{ key: '', label: 'كل الطلبات', count: total }, ...STATUSES.map((s) => ({ key: s, label: STATUS_LABELS[s].label, count: stats[s] || 0 }))].map(
            (c) => (
              <button key={c.key || 'all'} type="button" onClick={() => setFilter(c.key)}
                className={`rounded-2xl p-5 text-start shadow-sm ring-1 transition ${
                  filter === c.key ? 'bg-navy text-white ring-gold' : 'bg-white text-navy ring-slate-200 hover:ring-gold/60'
                }`}>
                <p className={`text-sm font-bold ${filter === c.key ? 'text-gold' : 'text-slate-500'}`}>{c.label}</p>
                <p className="mt-1 text-3xl font-black">{c.count}</p>
              </button>
            )
          )}
        </div>

        {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 font-bold text-red-700 ring-1 ring-red-200">{error}</p>}

        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          {loading && !items.length ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
          ) : !items.length ? (
            <p className="py-16 text-center font-bold text-slate-500">لا توجد طلبات</p>
          ) : (
            <>
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
                        <td className="whitespace-nowrap px-4 py-3 text-slate-500">{fmtDate(r.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={r.status} />
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
                        <p className="text-sm text-slate-500">{r.serviceType} • {fmtDate(r.createdAt)}</p>
                      </div>
                      <StatusBadge status={r.status} />
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}
