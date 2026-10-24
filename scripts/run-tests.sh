#!/usr/bin/env bash
# ==============================================================================
# MentorConnect AI - Test Suite Runner
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SERVER_DIR="$ROOT_DIR/server"

echo "=================================================="
echo " Running MentorConnect AI Full-Stack Verification "
echo "=================================================="
echo "Working Directory: $SERVER_DIR"

cd "$SERVER_DIR"
node test.js

echo "=================================================="
echo " MentorConnect AI Test Suite Completed!           "
echo "=================================================="
