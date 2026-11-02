import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiPort = process.env.API_PORT || '3004';
const proxy = { '/api': { target: `http://127.0.0.1:${apiPort}`, rewrite: path => path.replace(/^\/api/, '') } };
// Codespaces reenvía solo el front; la API se consulta por el mismo origen.
const codespaceHost = process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
  ? `${process.env.CODESPACE_NAME}-5173.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}` : null;

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true, proxy, allowedHosts: codespaceHost ? [codespaceHost] : [] },
  preview: { proxy }
});
