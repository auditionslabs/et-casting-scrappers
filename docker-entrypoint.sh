#!/bin/bash
set -euo pipefail

# Coolify / Traefik expect an HTTP listener on ports_exposes (3000). This
# image is a cron worker; keep a tiny health endpoint so the proxy stays green.
node -e "require('http').createServer((_req, res) => { res.writeHead(200, { 'Content-Type': 'text/plain' }); res.end('ok'); }).listen(3000, '0.0.0.0');" &

exec cron -f
