import { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import PageShell from '../components/PageShell';
import Modal from '../components/Modal';
import DriverForm from '../components/listings/DriverForm';
import DriverCard from '../components/listings/DriverCard';
import { FilterSelect, ListingsGrid } from '../components/listings/ListingParts';
import { LocationSelect } from '../components/FormControls';
import { TRAILER_LENGTH_FILTERS, TRUCK_TYPES } from '../constants';
import useListings from '../hooks/useListings';
import useUrlFilters from '../hooks/useUrlFilters';

const FILTER_KEYS = ['truckType', 'city', 'minLength'];

export default function DriversPage() {
  const [formOpen, setFormOpen] = useState(false);
  const { filters, setFilter, clear, active } = useUrlFilters(FILTER_KEYS);
  const listings = useListings('drivers', filters);

  const addButton = (
    <button type="button" onClick={() => setFormOpen(true)} className="btn-gold px-6 py-3.5">
      <UserPlus className="h-5 w-5" /> سجّل كسائق متوفر
    </button>
  );

  return (
    <PageShell
      eyebrow="سوق النقل"
      title="سائقين متوفرين"
      subtitle="شاحنات وسائقون جاهزون للنقل الآن. اختر نوع الشاحنة والمدينة وتواصل مع السائق مباشرة."
      actions={addButton}
    >
      <section aria-label="فلترة السائقين" className="mb-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
          <FilterSelect id="f-truck" label="نوع الشاحنة" value={filters.truckType} onChange={(e) => setFilter('truckType', e.target.value)}>
            <option value="">الكل</option>
            {TRUCK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </FilterSelect>
          <div>
            <label htmlFor="f-city" className="mb-1 block text-xs font-bold text-slate-500">المدينة</label>
            <LocationSelect id="f-city" className="input py-2.5" placeholder="كل المدن" value={filters.city} onChange={(e) => setFilter('city', e.target.value)} />
          </div>
          <FilterSelect id="f-length" label="أقل طول للمقطورة" value={filters.minLength} onChange={(e) => setFilter('minLength', e.target.value)}>
            <option value="">أي طول</option>
            {TRAILER_LENGTH_FILTERS.map((m) => <option key={m} value={m}>{m} متر فأكثر</option>)}
          </FilterSelect>
          {active && (
            <button type="button" onClick={clear} className="btn border border-slate-300 py-2.5 text-sm text-slate-600 hover:border-navy hover:text-navy sm:col-span-3 lg:col-span-1">
              <X className="h-4 w-4" /> مسح الفلاتر
            </button>
          )}
        </div>
        {!listings.loading && !listings.error && (
          <p className="mt-4 text-sm font-bold text-slate-500">السائقون المتوفرون: {listings.total}</p>
        )}
      </section>

      <ListingsGrid
        state={listings}
        renderItem={(d) => <DriverCard key={d._id} driver={d} />}
        emptyTitle="لا يوجد سائقون متوفرون حالياً"
        emptyAction={addButton}
      />

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="سجّل كسائق متوفر" subtitle="أعلن عن توفرك ليتواصل معك التجار وأصحاب الحمولات.">
        <DriverForm />
      </Modal>
    </PageShell>
  );
}
