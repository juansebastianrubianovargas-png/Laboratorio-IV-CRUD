import { pesos } from '../config';

export default function CrudTable({ config, records, onEdit, onDelete, busy }) {
  return <div className="table-responsive"><table className="table table-striped align-middle mb-0">
    <caption className="visually-hidden">Lista de {config.title.toLowerCase()}</caption>
    <thead><tr>{config.fields.map(field => <th scope="col" key={field.key}>{field.label}</th>)}{config.total && <th scope="col">Total</th>}<th scope="col">Acciones</th></tr></thead>
    <tbody>{records.length === 0 ? <tr><td colSpan={config.fields.length + (config.total ? 2 : 1)} className="text-secondary py-4">No hay registros para mostrar.</td></tr> : records.map(record => <tr key={record.id}>
      {config.fields.map(field => <td key={field.key}>{['precio', 'valorUnitario'].includes(field.key) ? pesos(record[field.key]) : record[field.key]}</td>)}
      {config.total && <td>{pesos(record.cantidad * record.valorUnitario)}</td>}
      <td><div className="d-flex gap-2"><button disabled={busy} className="btn btn-sm btn-outline-primary" onClick={() => onEdit(record)} aria-label={`Editar ${record.nombre || record.producto}`}>Editar</button>
        <button disabled={busy} className="btn btn-sm btn-outline-danger" onClick={() => onDelete(record)} aria-label={`Eliminar ${record.nombre || record.producto}`}>Eliminar</button></div></td>
    </tr>)}</tbody>
  </table></div>;
}
