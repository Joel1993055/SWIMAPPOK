#!/usr/bin/env node

// =====================================================
// SENTRY CONFIGURATION VALIDATOR
// =====================================================

const fs = require('fs');
const path = require('path');

async function validateSentry() {
  console.log('🔍 Validating Sentry Configuration...\n');

  try {
    // Check environment variables
    console.log('📋 Checking environment variables...');

    const requiredVars = [
      'NEXT_PUBLIC_SENTRY_DSN',
      'SENTRY_ORG',
      'SENTRY_PROJECT',
      'SENTRY_AUTH_TOKEN',
    ];

    let allVarsPresent = true;
    requiredVars.forEach(varName => {
      if (process.env[varName]) {
        console.log(`  ✅ ${varName} is set`);
      } else {
        console.log(`  ❌ ${varName} is missing`);
        allVarsPresent = false;
      }
    });

    if (!allVarsPresent) {
      console.log('\n❌ Missing required environment variables');
      console.log(
        'Please check docs/SENTRY_ENVIRONMENT_SETUP.md for setup instructions'
      );
      process.exit(1);
    }

    // Check if Sentry config files exist
    console.log('\n📁 Checking Sentry configuration files...');

    const filesToCheck = [
      'sentry.client.config.ts',
      'sentry.server.config.ts',
      'sentry.edge.config.ts',
    ];

    filesToCheck.forEach(file => {
      if (fs.existsSync(file)) {
        console.log(`  ✅ ${file} exists`);
      } else {
        console.log(`  ❌ ${file} missing`);
      }
    });

    // Validate DSN format
    console.log('\n🔗 Validating DSN format...');
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (dsn && dsn.startsWith('https://') && dsn.includes('@sentry.io/')) {
      console.log('  ✅ DSN format is valid');
    } else {
      console.log('  ❌ DSN format is invalid');
      console.log('  Expected format: https://key@sentry.io/project-id');
    }

    // Test Sentry CLI if available
    console.log('\n🧪 Testing Sentry CLI...');
    try {
      const { execSync } = require('child_process');
      execSync('npx sentry-cli info', { stdio: 'pipe' });
      console.log('  ✅ Sentry CLI is working');
    } catch (error) {
      console.log('  ⚠️  Sentry CLI test failed (this is optional)');
    }

    console.log('\n✅ Sentry configuration validation completed!');
    console.log('\n📚 Next steps:');
    console.log('1. Configure your Sentry project settings');
    console.log('2. Test error reporting in development');
    console.log('3. Deploy to production and verify source maps');
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

validateSentry();
