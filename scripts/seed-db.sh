#!/usr/bin/env bash
# ==============================================================================
# MentorConnect AI - Database Baseline Seeder
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SERVER_DIR="$ROOT_DIR/server"

echo "=================================================="
echo " Seeding MentorConnect AI Baseline Database       "
echo "=================================================="

cd "$SERVER_DIR"
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
const { seedDatabase } = require('./seeds/seedData');

const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mentorconnect';
mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to MongoDB. Running seed...');
    await seedDatabase();
    console.log('Seeding completed successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Seeding error:', err.message);
    process.exit(1);
  });
"

echo "=================================================="
echo " Seeding Process Finished                         "
echo "=================================================="
