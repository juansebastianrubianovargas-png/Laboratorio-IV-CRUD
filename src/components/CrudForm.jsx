import { useEffect, useState } from 'react';
import { pesos } from '../config';

export default function CrudForm({ config, editData, onSave, onCancel, busy }) {
  const empty = () => Object.fromEntries(config.fields.map(field => [field.key, '']));
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  useEffect(() => { setForm(editData ?? empty()); setError(''); }, [editData, config]);

  async function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(config.fields.map(field => {
      const rawValue = String(form[field.key] ?? '').trim();
      const value = field.type === 'number'
        ? (rawValue === '' ? '' : Number(rawValue))
        : rawValue;
      return [field.key, value];
    }));

    const hasInvalidValues = config.fields.some(field => {
      const value = data[field.key];
      if (field.type === 'number') return value === '' || !Number.isFinite(value);
      return value === '';
    });

    if (hasInvalidValues) {
      setError('Completa todos los campos con datos válidos.'); return;
    }
    setError('');
    if (await onSave({ ...data, ...(editData ? { id: editData.id } : {}) })) setForm(empty());
  }
  return <section className="border rounded bg-white p-3 h-100" aria-labelledby="form-title">
    <h2 id="form-title" className="h5 mb-3">{editData ? 'Editar' : 'Registrar'} {config.singular}</h2>
    <form onSubmit={submit}>
      <fieldset disabled={busy}>
        {config.fields.map(field => <div className="mb-3" key={field.key}>
          <label className="form-label" htmlFor={field.key}>{field.label}</label>
          <input className="form-control" id={field.key} name={field.key} type={field.type} required
            maxLength={field.type === 'number' ? undefined : 120} min={field.min} step={field.step}
            value={form[field.key]} onChange={event => setForm({ ...form, [field.key]: event.target.value })} />
        </div>)}
        {config.total && <p>Total: <strong>{pesos(Number(form.cantidad || 0) * Number(form.valorUnitario || 0))}</strong></p>}
        {error && <p className="text-danger" role="alert">{error}</p>}
        <div className="d-flex gap-2"><button className="btn btn-primary" type="submit">{busy ? 'Guardando...' : editData ? 'Guardar cambios' : 'Guardar'}</button>
          <button className="btn btn-outline-secondary" type="button" onClick={() => { setForm(empty()); setError(''); onCancel(); }}>{editData ? 'Cancelar' : 'Limpiar'}</button></div>
      </fieldset>
    </form>
  </section>;
}
