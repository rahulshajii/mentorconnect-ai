#!/usr/bin/env bash
# ==============================================================================
# MentorConnect AI - Sprint 6 Test Suite Runner
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SPRINT6_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SERVER_DIR="$SPRINT6_DIR/server"

echo "=================================================="
echo " Running MentorConnect AI - Sprint 6 Verification "
echo "=================================================="
echo "Working Directory: $SERVER_DIR"

cd "$SERVER_DIR"
node test_sprint6.js

echo "=================================================="
echo " Sprint 6 Test Suite Completed Successfully!      "
echo "=================================================="
