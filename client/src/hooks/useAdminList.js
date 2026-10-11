import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../api/client';

/**
 * Loads an admin list. `fetchPage(params)` calls the API; it is re-run when `params`
 * or `refreshSignal` change. A 401 calls `onUnauthorized` (logs the admin out).
 */
export default function useAdminList(fetchPage, params, { onUnauthorized, refreshSignal }) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);
  const key = JSON.stringify(params);

  const reload = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    setError('');
    try {
      const res = await fetchPage(JSON.parse(key));
      if (id !== requestId.current) return;
      setItems(res.data);
      setMeta(res.meta);
    } catch (err) {
      if (id !== requestId.current) return;
      if (err?.response?.status === 401) onUnauthorized('رمز الدخول غير صحيح');
      else setError(getErrorMessage(err));
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [fetchPage, key, onUnauthorized]);

  useEffect(() => {
    reload();
  }, [reload, refreshSignal]);

  return { items, meta, loading, error, setError, reload };
}
