import { Loader2 } from 'lucide-react';

export function StatusBadge({ status, labels }) {
  const s = labels[status];
  return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ring-1 ${s.className}`}>{s.label}</span>;
}

// "All" + one card per status; clicking a card filters the list.
export function StatCards({ statuses, labels, stats = {}, value, onChange }) {
  const total = statuses.reduce((n, s) => n + (stats[s] || 0), 0);
  const cards = [{ key: '', label: 'الكل', count: total }, ...statuses.map((s) => ({ key: s, label: labels[s].label, count: stats[s] || 0 }))];
  return (
    <div className={`grid grid-cols-2 gap-4 ${cards.length > 4 ? 'sm:grid-cols-3 lg:grid-cols-5' : 'md:grid-cols-4'}`}>
      {cards.map((c) => (
        <button key={c.key || 'all'} type="button" onClick={() => onChange(c.key)} aria-pressed={value === c.key}
          className={`rounded-2xl p-5 text-start shadow-sm ring-1 transition ${
            value === c.key ? 'bg-navy text-white ring-gold' : 'bg-white text-navy ring-slate-200 hover:ring-gold/60'
          }`}>
          <p className={`text-sm font-bold ${value === c.key ? 'text-gold' : 'text-slate-500'}`}>{c.label}</p>
          <p className="mt-1 text-3xl font-black">{c.count}</p>
        </button>
      ))}
    </div>
  );
}

export function ErrorBanner({ children }) {
  return <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 font-bold text-red-700 ring-1 ring-red-200">{children}</p>;
}

export function ListState({ loading, empty, children }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      {loading && empty ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
      ) : empty ? (
        <p className="py-16 text-center font-bold text-slate-500">لا توجد نتائج</p>
      ) : (
        children
      )}
    </div>
  );
}
