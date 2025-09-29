#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

/**
 * Safe version of the env sync script for use in Git hooks
 *
 * This version:
 * - Checks prerequisites before attempting sync
 * - Fails gracefully with helpful messages
 * - Doesn't exit process (for use in hooks)
 * - Returns success/failure status
 */

const ENV_FILE = '.env.production';

function safeExec(command, options = {}) {
  try {
    return {
      success: true,
      output: execSync(command, { encoding: 'utf8', ...options }),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      output: error.stdout || '',
    };
  }
}

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { success: false, error: `${filePath} not found` };
  }

  try {
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

    return { success: true, envVars };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse ${filePath}: ${error.message}`,
    };
  }
}

function checkPrerequisites() {
  // Check if Vercel CLI is available
  const vercelCheck = safeExec('npx vercel --version', { stdio: 'pipe' });
  if (!vercelCheck.success) {
    return {
      success: false,
      error: 'Vercel CLI not found. Install it with: npm install -g vercel',
    };
  }

  // Check if user is logged in
  const authCheck = safeExec('npx vercel whoami', { stdio: 'pipe' });
  if (!authCheck.success) {
    return {
      success: false,
      error: 'Not logged in to Vercel. Run: npx vercel login',
    };
  }

  return { success: true };
}

function syncToVercel(envVars) {
  const environments = ['production', 'preview', 'development'];
  const results = [];

  for (const [key, value] of Object.entries(envVars)) {
    console.log(`📝 Setting ${key}...`);

    // Remove existing variable first (ignore errors if it doesn't exist)
    for (const env of environments) {
      safeExec(`npx vercel env rm ${key} ${env} --yes`, { stdio: 'pipe' });
    }

    // Add the variable to all environments
    let success = true;
    for (const env of environments) {
      const result = safeExec(`npx vercel env add ${key} ${env}`, {
        input: value,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      if (!result.success) {
        success = false;
        break;
      }
    }

    if (success) {
      console.log(`✅ ${key} synced to all environments`);
      results.push({ key, success: true });
    } else {
      console.log(`❌ Failed to sync ${key}`);
      results.push({ key, success: false });
    }
  }

  return results;
}

function main() {
  console.log('🔄 Syncing environment variables to Vercel...');

  // Check prerequisites
  const prereqCheck = checkPrerequisites();
  if (!prereqCheck.success) {
    console.log(`❌ ${prereqCheck.error}`);
    return { success: false, error: prereqCheck.error };
  }

  // Parse environment file
  const parseResult = parseEnvFile(ENV_FILE);
  if (!parseResult.success) {
    console.log(`❌ ${parseResult.error}`);
    return { success: false, error: parseResult.error };
  }

  const { envVars } = parseResult;
  const varCount = Object.keys(envVars).length;

  if (varCount === 0) {
    const error = 'No environment variables found in .env.production';
    console.log(`❌ ${error}`);
    return { success: false, error };
  }

  console.log(`📋 Found ${varCount} environment variables to sync`);

  // Sync to Vercel
  const results = syncToVercel(envVars);
  const failedCount = results.filter((r) => !r.success).length;

  if (failedCount === 0) {
    console.log('✅ All environment variables synced successfully!');
    return { success: true, results };
  } else {
    console.log(`⚠️  ${failedCount} variables failed to sync`);
    return {
      success: false,
      results,
      error: `${failedCount} variables failed to sync`,
    };
  }
}

// Export for use as module
module.exports = { main, parseEnvFile, syncToVercel, checkPrerequisites };

// Run if called directly
if (require.main === module) {
  const result = main();
  process.exit(result.success ? 0 : 1);
}
