# Laboratorio 4 CRUD de negocio

Tienda La Esquina. Aplicación en React para registrar, consultar, editar y eliminar productos, clientes, proveedores, compras y ventas. Usa Bootstrap, useState, useEffect y el helper helpFetch.

## Ejecutar en Codespaces

1. Sube el contenido de esta carpeta a la raíz de un repositorio de GitHub, incluidos los archivos ocultos.
2. Crea un Codespace. La configuración instala las dependencias con `npm ci`.
3. En la terminal ejecuta `npm run dev`.
4. Abre el puerto 5173 desde la pestaña Puertos. Mantén su visibilidad privada.

Para ejecutarlo localmente necesitas Node.js 22.12 o superior: `npm ci` y `npm run dev`.

React usa el puerto 5173 y json-server el 3004. Vite comunica la página con la API mediante `/api`, por lo que no necesitas publicar el puerto 3004.

## Uso

Elige una sección, completa el formulario y pulsa Guardar. Los botones Editar y Eliminar permiten modificar los registros. Puedes buscar por cualquiera de sus campos.

La API guarda los datos en `db.json`. El navegador mantiene una copia en localStorage para consultar la última lista si la API falla. Los cambios se guardan solo cuando la API responde. GitHub conserva únicamente lo que subas al repositorio; no guarda automáticamente el localStorage del navegador.

Los datos iniciales son ejemplos ficticios. Cada compra o venta registra un producto y calcula su total. El inventario se edita en Productos; los movimientos no lo actualizan automáticamente.

## Archivos

`src/index.jsx` inicia la aplicación y carga `Negocio.jsx`. Las rutas muestran un `CrudAPI` reutilizable con `CrudForm` y `CrudTable`. `src/helpers/helpFetch.js` reúne las peticiones GET, POST, PUT y DELETE.

`npm run build` genera la carpeta `dist`. Para revisar esa compilación ejecuta `npm run api` y, en otra terminal, `npm run preview`. GitHub Pages por sí solo no ejecuta json-server.

## Entrega

Completa el nombre y el enlace real del repositorio en `entrega/Entrega.docx`. Incluye una captura de tu ejecución en Codespaces antes de entregar. La captura incluida corresponde a la revisión local.

Material de clase: Laboratorio 4 CRUD Negocio, Unidad 2 Estados, Unidad 2 Enrutamiento React y Guía 25 de CRUD con API y helper.

Consulta técnica: [proxy de Vite](https://vite.dev/config/server-options#server-proxy) y [json-server](https://github.com/typicode/json-server/tree/v0.17.4).
