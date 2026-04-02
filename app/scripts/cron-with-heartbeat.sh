#!/usr/bin/env bash
# Wrap a cron command with TRMX dashboard heartbeats (start / stop / optional ping).
# Usage: ./scripts/cron-with-heartbeat.sh <trmxJobId> <command...>
# Job IDs must match trmx/.app/server/utils/castingCronCatalog.ts (e.g. project_casting_10).
#
# Env (see .env.example):
#   TRMX_CRON_HEARTBEAT_BASE_URL — e.g. https://trmx.cc (no trailing slash). If unset, only runs the command.
#   CRON_HEARTBEAT_SECRET or TRMX_CRON_HEARTBEAT_SECRET — same value as TRMX CRON_HEARTBEAT_SECRET
#   TRMX_CRON_HEARTBEAT_PING_SEC — optional; if set (seconds), send action=ping on that interval while running

set -euo pipefail

# Docker: docker-entrypoint.sh writes this; cron does not inherit container env.
# Local/WSL: set TRMX_* / CRON_HEARTBEAT_* in your crontab (see crontab.local.example), not via sourcing .env
# (values in .env are often unquoted and unsafe for `source` in bash).
[[ -f /etc/cron-env.sh ]] && set -a && . /etc/cron-env.sh && set +a

JOB_ID="${1:?Usage: cron-with-heartbeat.sh <jobId> <command...>}"
shift

if [[ $# -lt 1 ]]; then
  echo "cron-with-heartbeat.sh: missing command" >&2
  exit 1
fi

TRMX_BASE="${TRMX_CRON_HEARTBEAT_BASE_URL:-}"
SECRET="${CRON_HEARTBEAT_SECRET:-${TRMX_CRON_HEARTBEAT_SECRET:-}}"

heartbeat() {
  local action="$1"
  if [[ -z "$TRMX_BASE" ]]; then
    return 0
  fi
  local url="${TRMX_BASE%/}/api/cron/jobs/${JOB_ID}/heartbeat"
  local body
  body=$(printf '{"action":"%s"}' "$action")
  if [[ -n "$SECRET" ]]; then
    curl -sS -m 25 -X POST "$url" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer ${SECRET}" \
      -d "$body" \
      -f -o /dev/null 2>/dev/null || true
  else
    curl -sS -m 25 -X POST "$url" \
      -H "Content-Type: application/json" \
      -d "$body" \
      -f -o /dev/null 2>/dev/null || true
  fi
}

STOP_SENT=0
send_stop() {
  [[ $STOP_SENT -eq 1 ]] && return
  STOP_SENT=1
  if [[ -n "${PING_PID:-}" ]]; then
    kill "$PING_PID" 2>/dev/null || true
  fi
  heartbeat stop
}

heartbeat start
trap send_stop EXIT INT TERM HUP

PING_PID=""
if [[ -n "${TRMX_CRON_HEARTBEAT_PING_SEC:-}" ]] && [[ "$TRMX_CRON_HEARTBEAT_PING_SEC" =~ ^[0-9]+$ ]] && [[ "$TRMX_CRON_HEARTBEAT_PING_SEC" != "0" ]]; then
  (
    while true; do
      sleep "$TRMX_CRON_HEARTBEAT_PING_SEC"
      heartbeat ping
    done
  ) &
  PING_PID=$!
fi

set +e
"$@"
RC=$?
set -e
exit "$RC"
