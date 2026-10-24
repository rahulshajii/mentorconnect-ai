#!/usr/bin/env bash
# ==============================================================================
# MentorConnect AI - Sprint 6 Start Frontend Client
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SPRINT6_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CLIENT_DIR="$SPRINT6_DIR/client"

echo "Starting Sprint 6 Frontend Client on port 3000..."
cd "$CLIENT_DIR"
npm start
