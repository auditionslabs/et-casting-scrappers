#!/usr/bin/env bash
# Install OS packages required by Playwright Chromium (Debian/Ubuntu/WSL).
# Must be run with privileges — invokes sudo.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/app"
exec sudo npx playwright install-deps chromium
