#!/usr/bin/env bash
# ==============================================================================
# MentorConnect AI - Sprint 6 Start Backend Server
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SPRINT6_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SERVER_DIR="$SPRINT6_DIR/server"

echo "Starting Sprint 6 Backend Server on port 5001..."
cd "$SERVER_DIR"
npm start
