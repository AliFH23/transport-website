import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchListings, getErrorMessage } from '../api/client';

const PAGE_SIZE = 12;

// Public listings with filters and "load more" pagination. Refetches from page 1 whenever `filters` change.
export default function useListings(kind, filters) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const requestId = useRef(0);
  const key = JSON.stringify(filters);

  const load = useCallback(
    async (page) => {
      const id = ++requestId.current;
      setLoading(true);
      setError('');
      try {
        const res = await fetchListings(kind, { ...JSON.parse(key), page, limit: PAGE_SIZE });
        if (id !== requestId.current) return; // a newer request superseded this one
        setItems((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
        setMeta(res.meta);
      } catch (err) {
        if (id === requestId.current) setError(getErrorMessage(err));
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [kind, key]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const hasMore = !!meta && meta.page < meta.pages;
  const loadMore = () => hasMore && !loading && load(meta.page + 1);
  const retry = () => load(1);

  return { items, total: meta?.total ?? 0, loading, error, hasMore, loadMore, retry };
}
