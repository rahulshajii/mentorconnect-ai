#!/usr/bin/env bash
# ==============================================================================
# MentorConnect AI - Sprint 6 Database Seeder
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SPRINT6_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SERVER_DIR="$SPRINT6_DIR/server"

echo "=================================================="
echo " Seeding MentorConnect AI Sprint 6 Database       "
echo "=================================================="

cd "$SERVER_DIR"
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
const { seedCoursesAndUsers } = require('./seeds/seedData');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mentorconnect_sprint6';
mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to MongoDB. Running seed...');
    await seedCoursesAndUsers();
    console.log('Seeding completed successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
"
