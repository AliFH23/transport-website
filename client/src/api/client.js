import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export const getErrorMessage = (err) =>
  err?.response?.data?.message ||
  (err?.code === 'ECONNABORTED' ? 'انتهت مهلة الاتصال بالخادم' : null) ||
  (err?.request && !err?.response ? 'تعذر الاتصال بالخادم، تحقق من الإنترنت' : null) ||
  'حدث خطأ غير متوقع';

const adminHeaders = (token) => ({ headers: { 'x-admin-token': token } });

export const createRequest = (payload) => api.post('/requests', payload).then((r) => r.data);

export const fetchRequests = (token, params = {}) =>
  api.get('/requests', { ...adminHeaders(token), params }).then((r) => r.data);

export const updateRequestStatus = (token, id, status) =>
  api.patch(`/requests/${id}`, { status }, adminHeaders(token)).then((r) => r.data);

export default api;
