#!/bin/bash
set -euo pipefail

# Coolify / Traefik expect an HTTP listener on ports_exposes (3000). This
# image is a cron worker; keep a tiny health endpoint so the proxy stays green.
node -e "require('http').createServer((_req, res) => { res.writeHead(200, { 'Content-Type': 'text/plain' }); res.end('ok'); }).listen(3000, '0.0.0.0');" &

# Cron jobs do not inherit process environment. app/scripts/cron-with-heartbeat.sh sources this file.
umask 077
{
  printf 'export TRMX_CRON_HEARTBEAT_BASE_URL=%q\n' "${TRMX_CRON_HEARTBEAT_BASE_URL:-}"
  printf 'export CRON_HEARTBEAT_SECRET=%q\n' "${CRON_HEARTBEAT_SECRET:-}"
  printf 'export TRMX_CRON_HEARTBEAT_SECRET=%q\n' "${TRMX_CRON_HEARTBEAT_SECRET:-}"
  printf 'export TRMX_CRON_HEARTBEAT_PING_SEC=%q\n' "${TRMX_CRON_HEARTBEAT_PING_SEC:-}"
} >/etc/cron-env.sh
chmod 600 /etc/cron-env.sh

exec cron -f
