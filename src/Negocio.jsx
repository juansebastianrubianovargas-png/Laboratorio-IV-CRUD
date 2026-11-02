import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { sections } from './config';
import CrudAPI from './components/CrudAPI';

export default function Negocio() {
  return <>
    <header className="border-bottom bg-white"><div className="container py-3">
      <NavLink className="brand" to="/productos">Tienda La Esquina</NavLink>
      <span className="text-secondary d-block small">Administración del negocio</span>
    </div></header>
    <nav className="bg-white border-bottom" aria-label="Secciones del negocio"><div className="container">
      <div className="nav nav-underline flex-nowrap overflow-auto">
        {Object.entries(sections).map(([key, section]) => <NavLink key={key} to={`/${key}`} className={({ isActive }) => `nav-link px-2${isActive ? ' active' : ''}`}>{section.title}</NavLink>)}
      </div>
    </div></nav>
    <main className="container py-4"><Routes>
      <Route path="/" element={<Navigate to="/productos" replace />} />
      {Object.keys(sections).map(key => <Route key={key} path={`/${key}`} element={<CrudAPI key={key} resource={key} config={sections[key]} />} />)}
      <Route path="*" element={<><h1>Página no encontrada</h1><NavLink to="/productos">Volver a productos</NavLink></>} />
    </Routes></main>
    <footer className="container text-secondary small pb-4">Tienda La Esquina · Registro de datos del negocio</footer>
  </>;
}
