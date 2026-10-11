import { ArrowLeft, Loader2, RefreshCw, SearchX } from 'lucide-react';

export function RouteLine({ from, to }) {
  return (
    <p className="flex flex-wrap items-center gap-2 font-display text-xl font-black text-navy">
      <span>{from}</span>
      <ArrowLeft className="h-5 w-5 shrink-0 text-gold" aria-label="إلى" />
      <span>{to}</span>
    </p>
  );
}

export function InfoRow({ icon: Icon, children }) {
  return (
    <li className="flex items-start gap-2 text-sm text-slate-600">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

export function Chip({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700',
    gold: 'bg-gold/15 text-gold-800',
    navy: 'bg-navy text-gold',
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>;
}

export function ListingCardShell({ children }) {
  return (
    <article className="flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-gold/50">
      {children}
    </article>
  );
}

// Grid + loading / error / empty / "load more" states for a public listings page.
export function ListingsGrid({ state, renderItem, emptyTitle, emptyAction }) {
  const { items, loading, error, hasMore, loadMore, retry } = state;

  if (error && !items.length) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-red-200">
        <p className="font-bold text-red-700">{error}</p>
        <button type="button" onClick={retry} className="btn-dark mt-4">
          <RefreshCw className="h-4 w-4" /> إعادة المحاولة
        </button>
      </div>
    );
  }

  if (loading && !items.length) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-busy="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-3xl bg-white ring-1 ring-slate-200" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-14 text-center ring-1 ring-slate-200">
        <SearchX className="h-12 w-12 text-slate-300" />
        <p className="mt-4 font-display text-xl font-black text-navy">{emptyTitle}</p>
        <p className="mt-1 text-slate-500">جرّب تغيير الفلاتر، أو كن أول من ينشر إعلاناً.</p>
        {emptyAction && <div className="mt-6">{emptyAction}</div>}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map(renderItem)}</div>
      {error && <p className="mt-6 text-center font-bold text-red-700">{error}</p>}
      {hasMore && (
        <div className="mt-10 text-center">
          <button type="button" onClick={loadMore} disabled={loading} className="btn-dark px-8">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} عرض المزيد
          </button>
        </div>
      )}
    </>
  );
}

// Labelled select used in the filter bars.
export function FilterSelect({ id, label, children, ...props }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1 block text-xs font-bold text-slate-500">{label}</label>
      <select id={id} className="input py-2.5" {...props}>{children}</select>
    </div>
  );
}
