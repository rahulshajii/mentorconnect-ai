#!/usr/bin/env bash
# ==============================================================================
# MentorConnect AI - Start Backend Server
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SERVER_DIR="$ROOT_DIR/server"

echo "Starting MentorConnect AI Backend Server..."
cd "$SERVER_DIR"
npm start
