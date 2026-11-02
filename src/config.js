const text = (key, label, type = 'text') => ({ key, label, type });
const number = (key, label, step = '1') => ({ key, label, type: 'number', step, min: 0 });
const movement = person => [text('fecha', 'Fecha', 'date'), text(person, person === 'cliente' ? 'Cliente' : 'Proveedor'), text('producto', 'Producto'), { ...number('cantidad', 'Cantidad'), min: 1 }, number('valorUnitario', 'Valor unitario', '0.01')];

export const sections = {
  productos: { title: 'Productos', singular: 'producto', description: 'Consulta los precios y las unidades disponibles.', fields: [text('nombre', 'Nombre'), text('categoria', 'Categoría'), number('precio', 'Precio', '0.01'), number('existencias', 'Existencias')] },
  clientes: { title: 'Clientes', singular: 'cliente', description: 'Guarda los datos de contacto de tus clientes.', fields: [text('nombre', 'Nombre'), text('documento', 'Documento'), text('telefono', 'Teléfono', 'tel'), text('correo', 'Correo', 'email')] },
  proveedores: { title: 'Proveedores', singular: 'proveedor', description: 'Mantén a mano los contactos de quienes surten la tienda.', fields: [text('nombre', 'Nombre'), text('nit', 'NIT'), text('telefono', 'Teléfono', 'tel'), text('correo', 'Correo', 'email')] },
  compras: { title: 'Compras', singular: 'compra', description: 'Registra las compras realizadas a los proveedores.', fields: movement('proveedor'), total: true },
  ventas: { title: 'Ventas', singular: 'venta', description: 'Registra las ventas realizadas a los clientes.', fields: movement('cliente'), total: true }
};
export const pesos = value => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 2 }).format(value);
