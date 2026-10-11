import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

// Filters stored in the query string so a filtered view can be shared or bookmarked.
export default function useUrlFilters(keys) {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(
    () => Object.fromEntries(keys.map((k) => [k, params.get(k) ?? ''])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params, keys.join()]
  );

  const setFilter = (key, value) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );

  const clear = () => setParams({}, { replace: true });
  const active = keys.some((k) => filters[k]);

  return { filters, setFilter, clear, active };
}
