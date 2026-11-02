import { spawn } from 'node:child_process';
import net from 'node:net';

function isPortTaken(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', () => resolve(true));
    server.once('listening', () => {
      server.close(() => resolve(false));
    });

    server.listen(port, '127.0.0.1');
  });
}

async function findAvailablePort(startPort = 3004, limit = 20) {
  for (let port = startPort; port < startPort + limit; port += 1) {
    if (!(await isPortTaken(port))) return port;
  }
  throw new Error('No hay puertos libres disponibles.');
}

const apiPort = await findAvailablePort(3004, 20);
const webPort = await findAvailablePort(5173, 20);
const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const api = spawn(command, ['json-server', '--watch', 'db.json', '--host', '127.0.0.1', '--port', String(apiPort)], {
  stdio: 'inherit',
  env: { ...process.env, API_PORT: String(apiPort) },
});
const web = spawn(command, ['vite', '--host', '0.0.0.0', '--port', String(webPort)], {
  stdio: 'inherit',
  env: { ...process.env, API_PORT: String(apiPort), WEB_PORT: String(webPort) },
});

const shutdown = () => {
  api.kill('SIGINT');
  web.kill('SIGINT');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

api.on('exit', (code) => {
  if (code !== 0) {
    web.kill('SIGINT');
    process.exit(code ?? 1);
  }
});

web.on('exit', (code) => {
  if (code !== 0) {
    api.kill('SIGINT');
    process.exit(code ?? 1);
  }
});

console.log(`API disponible en http://127.0.0.1:${apiPort}`);
console.log(`Frontend disponible en http://localhost:${webPort}`);
