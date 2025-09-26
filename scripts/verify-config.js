#!/usr/bin/env node

/**
 * Script to verify Supabase and environment configuration
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_APP_URL'
];

console.log('🔍 Verifying environment configuration...\n');

// Check if we're in production or development
const isProduction = process.env.NODE_ENV === 'production';
const environment = isProduction ? 'Production' : 'Development';

console.log(`📍 Environment: ${environment}`);
console.log(`🌐 App URL: ${process.env.NEXT_PUBLIC_APP_URL || 'Not set'}\n`);

// Check required environment variables
let allVarsPresent = true;
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: Not set`);
    allVarsPresent = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allVarsPresent) {
  console.log('✅ All required environment variables are set!');
  console.log('🚀 Your app should work correctly.');
} else {
  console.log('❌ Some environment variables are missing.');
  console.log('📝 Please check your .env.local file or Vercel environment variables.');
}

console.log('\n📋 Next steps:');
console.log('1. Verify Supabase URL configuration includes your domain');
console.log('2. Check Google OAuth redirect URIs are configured');
console.log('3. Test authentication flow in both environments');
