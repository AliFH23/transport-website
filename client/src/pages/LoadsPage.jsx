import { useState } from 'react';
import { PackagePlus, X } from 'lucide-react';
import PageShell from '../components/PageShell';
import Modal from '../components/Modal';
import LoadForm from '../components/listings/LoadForm';
import LoadCard from '../components/listings/LoadCard';
import { FilterSelect, ListingsGrid } from '../components/listings/ListingParts';
import { LocationSelect } from '../components/FormControls';
import { CARGO_TYPES } from '../constants';
import useListings from '../hooks/useListings';
import useUrlFilters from '../hooks/useUrlFilters';

const FILTER_KEYS = ['cargoType', 'from', 'to'];

export default function LoadsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const { filters, setFilter, clear, active } = useUrlFilters(FILTER_KEYS);
  const listings = useListings('loads', filters);

  const addButton = (
    <button type="button" onClick={() => setFormOpen(true)} className="btn-gold px-6 py-3.5">
      <PackagePlus className="h-5 w-5" /> أضف حمولة
    </button>
  );

  return (
    <PageShell
      eyebrow="سوق النقل"
      title="عروض البضائع"
      subtitle="حمولات بضائع ومواشي بانتظار النقل من التجار ومربي المواشي. تواصل مع صاحب الحمولة مباشرة بالاتصال أو واتساب."
      actions={addButton}
    >
      <section aria-label="فلترة الحمولات" className="mb-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
          <FilterSelect id="f-cargo" label="نوع الحمولة" value={filters.cargoType} onChange={(e) => setFilter('cargoType', e.target.value)}>
            <option value="">الكل</option>
            {CARGO_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </FilterSelect>
          <div>
            <label htmlFor="f-from" className="mb-1 block text-xs font-bold text-slate-500">من</label>
            <LocationSelect id="f-from" className="input py-2.5" placeholder="كل المدن" value={filters.from} onChange={(e) => setFilter('from', e.target.value)} />
          </div>
          <div>
            <label htmlFor="f-to" className="mb-1 block text-xs font-bold text-slate-500">إلى</label>
            <LocationSelect id="f-to" className="input py-2.5" placeholder="كل الوجهات" value={filters.to} onChange={(e) => setFilter('to', e.target.value)} />
          </div>
          {active && (
            <button type="button" onClick={clear} className="btn border border-slate-300 py-2.5 text-sm text-slate-600 hover:border-navy hover:text-navy sm:col-span-3 lg:col-span-1">
              <X className="h-4 w-4" /> مسح الفلاتر
            </button>
          )}
        </div>
        {!listings.loading && !listings.error && (
          <p className="mt-4 text-sm font-bold text-slate-500">الحمولات المتاحة: {listings.total}</p>
        )}
      </section>

      <ListingsGrid
        state={listings}
        renderItem={(l) => <LoadCard key={l._id} load={l} />}
        emptyTitle="لا توجد حمولات متاحة حالياً"
        emptyAction={addButton}
      />

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="أضف حمولة" subtitle="انشر حمولتك ليتواصل معك السائقون مباشرة.">
        <LoadForm />
      </Modal>
    </PageShell>
  );
}
