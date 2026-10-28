#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
export NVM_DIR=~/.nvm; . "$NVM_DIR/nvm.sh"; nvm use 24 >/dev/null
pnpm install --ignore-workspace
pnpm build
docker rm -f charpente-livewire-app >/dev/null 2>&1 || true
exec docker run --rm --name charpente-livewire-app --user "$(id -u):$(id -g)" -p 5207:5207 -v "$PWD":/app -w /app php:8.4-cli php artisan serve --host=0.0.0.0 --port=5207
