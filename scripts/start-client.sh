#!/usr/bin/env bash
# ==============================================================================
# MentorConnect AI - Start Frontend Client
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CLIENT_DIR="$ROOT_DIR/client"

echo "Starting MentorConnect AI Frontend Client..."
cd "$CLIENT_DIR"
npm start
