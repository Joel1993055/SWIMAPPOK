/**
 * Environment variables validation
 * Ensures all required environment variables are present
 */

interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  NEXT_PUBLIC_APP_URL: string;
}

interface ValidationResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * Validates required environment variables
 */
export function validateEnvVars(): ValidationResult {
  const required: (keyof EnvConfig)[] = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_APP_URL'
  ];

  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // Check for common issues
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://')) {
    warnings.push('NEXT_PUBLIC_SUPABASE_URL should start with https://');
  }

  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.startsWith('http')) {
    warnings.push('NEXT_PUBLIC_APP_URL should start with http:// or https://');
  }

  // Development warnings
  if (process.env.NODE_ENV === 'development') {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('localhost')) {
      warnings.push('Using localhost Supabase URL in development');
    }
  }

  // Production warnings
  if (process.env.NODE_ENV === 'production') {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('localhost')) {
      warnings.push('WARNING: Using localhost Supabase URL in production!');
    }
    
    if (process.env.NEXT_PUBLIC_APP_URL?.includes('localhost')) {
      warnings.push('WARNING: Using localhost APP URL in production!');
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings
  };
}

/**
 * Validates environment variables and throws error if invalid
 */
export function validateEnvVarsOrThrow(): void {
  const result = validateEnvVars();
  
  if (!result.isValid) {
    const errorMessage = `Missing required environment variables: ${result.missing.join(', ')}`;
    console.error('❌ Environment validation failed:', errorMessage);
    throw new Error(errorMessage);
  }

  if (result.warnings.length > 0) {
    console.warn('⚠️ Environment warnings:', result.warnings);
  }

  console.log('✅ Environment variables validated successfully');
}

/**
 * Gets validated environment configuration
 */
export function getEnvConfig(): EnvConfig {
  validateEnvVarsOrThrow();
  
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? ''
  };
}

/**
 * Development helper to check environment status
 */
export function checkEnvStatus(): void {
  const result = validateEnvVars();
  
  console.log('🔍 Environment Status:');
  console.log(`   Valid: ${result.isValid ? '✅' : '❌'}`);
  
  if (result.missing.length > 0) {
    console.log(`   Missing: ${result.missing.join(', ')}`);
  }
  
  if (result.warnings.length > 0) {
    console.log(`   Warnings: ${result.warnings.length}`);
    result.warnings.forEach(warning => console.log(`     - ${warning}`));
  }
}
