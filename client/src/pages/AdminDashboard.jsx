import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { KeyRound, LogOut, RefreshCw } from 'lucide-react';
import { fetchAdminListings } from '../api/client';
import { LogoMark } from '../components/Logo';
import RequestsPanel from '../components/admin/RequestsPanel';
import ListingsPanel from '../components/admin/ListingsPanel';

const TOKEN_KEY = 'durrat_admin_token';

const TABS = [
  { key: 'requests', label: 'طلبات النقل' },
  { key: 'loads', label: 'الحمولات' },
  { key: 'drivers', label: 'السائقين' },
];

const readToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

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
  const [loginError, setLoginError] = useState('');
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [pending, setPending] = useState({});
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.key === params.get('tab')) ? params.get('tab') : 'requests';

  const logout = useCallback((msg = '') => {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
    } catch { /* ignore */ }
    setToken('');
    setLoginError(typeof msg === 'string' ? msg : '');
  }, []);

  // Pending-review counts shown on the listing tabs. A successful call also confirms the token.
  const refreshPending = useCallback(async () => {
    if (!token) return;
    try {
      const [loads, drivers] = await Promise.all(
        ['loads', 'drivers'].map((k) => fetchAdminListings(token, k, { status: 'Pending', limit: 1 }))
      );
      setPending({ loads: loads.meta.stats.Pending, drivers: drivers.meta.stats.Pending });
      try {
        sessionStorage.setItem(TOKEN_KEY, token);
      } catch { /* ignore */ }
    } catch (err) {
      if (err?.response?.status === 401) logout('رمز الدخول غير صحيح');
    }
  }, [token, logout]);

  useEffect(() => {
    refreshPending();
  }, [refreshPending, refreshSignal]);

  if (!token) {
    return (
      <Login
        error={loginError}
        onLogin={(t) => {
          setLoginError('');
          setToken(t);
        }}
      />
    );
  }

  const panelProps = { token, onUnauthorized: logout, refreshSignal };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-navy text-white">
        <div className="container-x flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <LogoMark className="h-9 w-9 text-white" />
            <span className="font-display text-lg font-black">لوحة التحكم</span>
          </Link>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setRefreshSignal((n) => n + 1)} className="btn px-3 py-2 text-sm text-white hover:bg-white/10" aria-label="تحديث">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => logout()} className="btn-outline px-3 py-2 text-sm">
              <LogOut className="h-4 w-4" /> خروج
            </button>
          </div>
        </div>
        <nav className="container-x flex gap-1 overflow-x-auto" role="tablist" aria-label="أقسام لوحة التحكم">
          {TABS.map((t) => (
            <button key={t.key} type="button" role="tab" aria-selected={tab === t.key}
              onClick={() => setParams({ tab: t.key }, { replace: true })}
              className={`flex items-center gap-2 whitespace-nowrap rounded-t-xl px-5 py-3 text-sm font-bold transition ${
                tab === t.key ? 'bg-slate-100 text-navy' : 'text-slate-300 hover:bg-white/5 hover:text-gold'
              }`}>
              {t.label}
              {pending[t.key] > 0 && (
                <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-black text-navy" title="بانتظار المراجعة">{pending[t.key]}</span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="container-x py-8" role="tabpanel">
        {tab === 'requests' && <RequestsPanel {...panelProps} />}
        {tab === 'loads' && <ListingsPanel key="loads" kind="loads" {...panelProps} onChanged={refreshPending} />}
        {tab === 'drivers' && <ListingsPanel key="drivers" kind="drivers" {...panelProps} onChanged={refreshPending} />}
      </main>
    </div>
  );
}
