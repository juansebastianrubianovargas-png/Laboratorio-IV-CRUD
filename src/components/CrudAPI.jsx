import { useEffect, useState } from 'react';
import { helpFetch } from '../helpers/helpFetch';
import CrudForm from './CrudForm';
import CrudTable from './CrudTable';

const API = helpFetch();

export default function CrudAPI({ resource, config }) {
  const [records, setRecords] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState('');
  const [reload, setReload] = useState(0);
  const cacheKey = `negocio-${resource}`;
  function cache(data) {
    try { localStorage.setItem(cacheKey, JSON.stringify(data)); } catch { /* La API conserva los datos aunque el navegador no permita guardar la copia. */ }
  }

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setMessage(null);
    API.get(resource, { signal: controller.signal }).then(result => {
      if (controller.signal.aborted) return;
      if (result?.error) {
        let saved = [];
        try { const parsed = JSON.parse(localStorage.getItem(cacheKey) || '[]'); if (Array.isArray(parsed)) saved = parsed; } catch { /* Sin copia local válida. */ }
        setRecords(saved);
        setMessage({ error: true, text: `${result.message} Se muestra la última copia local disponible.` });
      } else { setRecords(result); cache(result); }
      setLoading(false);
    });
    return () => controller.abort();
  }, [resource, reload]);

  async function save(data) {
    setBusy(true); setMessage(null);
    const editing = data.id !== undefined;
    const result = editing ? await API.put(`${resource}/${encodeURIComponent(data.id)}`, data) : await API.post(resource, data);
    setBusy(false);
    if (result?.error) { setMessage({ error: true, text: result.message }); return false; }
    const next = editing ? records.map(row => row.id === result.id ? result : row) : [...records, result];
    setRecords(next); cache(next); setEditData(null);
    setMessage({ text: editing ? 'Cambios guardados.' : 'Registro guardado.' }); return true;
  }

  async function remove(record) {
    if (!window.confirm(`¿Eliminar el registro de ${record.nombre || record.producto}?`)) return;
    setBusy(true); setMessage(null);
    const result = await API.del(`${resource}/${encodeURIComponent(record.id)}`);
    setBusy(false);
    if (result?.error) { setMessage({ error: true, text: result.message }); return; }
    const next = records.filter(row => row.id !== record.id);
    setRecords(next); cache(next);
    if (editData?.id === record.id) setEditData(null);
    setMessage({ text: 'Registro eliminado.' });
  }

  const filtered = records.filter(row => config.fields.some(field => String(row[field.key]).toLocaleLowerCase('es').includes(search.trim().toLocaleLowerCase('es'))));
  return <>
    <h1 className="h3">{config.title}</h1><p className="text-secondary">{config.description}</p>
    {config.total && <p className="small text-secondary">Cada registro corresponde a un producto. Las compras y ventas no cambian las existencias automáticamente.</p>}
    {message && <div role={message.error ? 'alert' : 'status'} className={`alert alert-${message.error ? 'danger' : 'success'}`}>{message.text}{message.error && <button className="btn btn-sm btn-outline-danger ms-2" disabled={busy || loading} onClick={() => setReload(value => value + 1)}>Reintentar</button>}</div>}
    <div className="row g-4">
      <div className="col-lg-4"><CrudForm config={config} editData={editData} onSave={save} onCancel={() => setEditData(null)} busy={busy || loading} /></div>
      <section className="col-lg-8" aria-label="Registros"><div className="border rounded bg-white p-3">
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 flex-wrap"><h2 className="h5 mb-0">Registros <span className="badge text-bg-light">{records.length}</span></h2>
          <div><label htmlFor="buscar" className="visually-hidden">Buscar registros</label><input id="buscar" type="search" className="form-control" placeholder="Buscar..." value={search} onChange={event => setSearch(event.target.value)} /></div></div>
        {loading ? <p role="status">Cargando registros...</p> : <CrudTable config={config} records={filtered} onEdit={setEditData} onDelete={remove} busy={busy} />}
      </div></section>
    </div>
  </>;
}
