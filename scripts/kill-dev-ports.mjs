#!/usr/bin/env node
/** Free dev ports before turbo dev — avoids EADDRINUSE from stale next/nest processes. */
import { execSync } from 'node:child_process';

const PORTS = [3000, 3001];

for (const port of PORTS) {
  try {
    const out = execSync(`lsof -ti :${port}`, { encoding: 'utf8' }).trim();
    if (!out) continue;
    for (const pid of out.split('\n').filter(Boolean)) {
      try {
        process.kill(Number(pid), 'SIGTERM');
        console.log(`Freed port ${port} (pid ${pid})`);
      } catch {
        /* already exited */
      }
    }
  } catch {
    /* nothing listening */
  }
}
