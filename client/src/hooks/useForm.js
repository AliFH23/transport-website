import { useCallback, useState } from 'react';
import { getErrorMessage } from '../api/client';

/**
 * Small form-state helper: values, field errors, submit status and server message.
 * `validate(values)` returns an { field: message } object; `submit(values)` returns the API response.
 */
export default function useForm(initial, validate, submit) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverMsg, setServerMsg] = useState('');

  const onChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
    setErrors((er) => (er[name] ? { ...er, [name]: undefined } : er));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate(values);
    setErrors(v);
    if (Object.keys(v).length) return;

    setStatus('loading');
    try {
      const res = await submit(values);
      setStatus('success');
      setServerMsg(res.message);
      setValues(initial);
    } catch (err) {
      setStatus('error');
      setServerMsg(getErrorMessage(err));
      if (err?.response?.data?.errors) setErrors(err.response.data.errors);
    }
  };

  const reset = () => setStatus('idle');

  return { values, setValues, errors, status, serverMsg, onChange, onSubmit, reset };
}
