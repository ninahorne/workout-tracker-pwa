#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Script to sync environment variables from .env.production to Vercel
 *
 * Usage:
 * node scripts/sync-env.js
 *
 * Make sure you're logged in to Vercel CLI first:
 * npx vercel login
 */

const ENV_FILE = '.env.production';
const PROJECT_NAME = 'workout-tracker-pwa'; // Update this to match your Vercel project name

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ ${filePath} not found`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const envVars = {};

  content.split('\n').forEach((line) => {
    line = line.trim();

    // Skip empty lines and comments
    if (!line || line.startsWith('#')) return;

    const equalIndex = line.indexOf('=');
    if (equalIndex === -1) return;

    const key = line.substring(0, equalIndex).trim();
    const value = line.substring(equalIndex + 1).trim();

    // Remove quotes if present
    const cleanValue = value.replace(/^["']|["']$/g, '');

    envVars[key] = cleanValue;
  });

  return envVars;
}

function syncToVercel(envVars) {
  console.log('🚀 Syncing environment variables to Vercel...\n');

  const environments = ['production', 'preview', 'development'];

  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`📝 Setting ${key}...`);

    try {
      // Remove existing variable first (ignore errors if it doesn't exist)
      try {
        execSync(`npx vercel env rm ${key} production --yes`, {
          stdio: 'pipe',
        });
        execSync(`npx vercel env rm ${key} preview --yes`, { stdio: 'pipe' });
        execSync(`npx vercel env rm ${key} development --yes`, {
          stdio: 'pipe',
        });
      } catch (error) {
        // Ignore errors for non-existent variables
      }

      // Add the variable to all environments
      environments.forEach((env) => {
        const command = `npx vercel env add ${key} ${env}`;
        const child = execSync(command, {
          input: value,
          stdio: ['pipe', 'pipe', 'pipe'],
          encoding: 'utf8',
        });
      });

      console.log(`✅ ${key} synced to all environments`);
    } catch (error) {
      console.error(`❌ Failed to sync ${key}:`, error.message);
    }
  });
}

function main() {
  console.log('🔄 Vercel Environment Variable Sync Tool\n');

  // Check if Vercel CLI is available
  try {
    execSync('npx vercel --version', { stdio: 'pipe' });
  } catch (error) {
    console.error(
      '❌ Vercel CLI not found. Install it with: npm install -g vercel',
    );
    process.exit(1);
  }

  // Check if user is logged in
  try {
    execSync('npx vercel whoami', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Not logged in to Vercel. Run: npx vercel login');
    process.exit(1);
  }

  const envVars = parseEnvFile(ENV_FILE);
  const varCount = Object.keys(envVars).length;

  if (varCount === 0) {
    console.log('❌ No environment variables found in .env.production');
    process.exit(1);
  }

  console.log(`📋 Found ${varCount} environment variables:`);
  Object.keys(envVars).forEach((key) => {
    console.log(`   - ${key}`);
  });
  console.log();

  syncToVercel(envVars);

  console.log('\n✨ Environment variables synced successfully!');
  console.log('🚀 Your next deployment will use the updated variables.');
}

if (require.main === module) {
  main();
}

module.exports = { parseEnvFile, syncToVercel };
