import { spawn } from 'node:child_process';

const port = Number(process.env.API_PORT || 3004);
const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(command, ['json-server', '--watch', 'db.json', '--host', '127.0.0.1', '--port', String(port)], {
  stdio: 'inherit',
  env: { ...process.env, API_PORT: String(port) },
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
